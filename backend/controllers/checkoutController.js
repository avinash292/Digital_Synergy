'user strict';

const Stripe = require('stripe');
const config = require('../config');
const moment = require('moment');
const { ErrorHandler } = require('../helpers/errorhandler');
const sequelize = require('../db');
const Cart = require('../models/cartModel');
const CartProducts = require('../models/cartProductModel');
const Products = require('../models/productModel');
const Countries = require('../models/countryModel');
const Shapes = require('../models/shapeModel');
const Colors = require('../models/colorModel');
const Layouts = require('../models/layoutModel');
const Sizes = require('../models/sizeModel');
const Customers = require('../models/customerModel');
const Orders = require('../models/orderModel');
const OrderProducts = require('../models/orderProductModel');
const Addresses = require('../models/addressModel');
const Payments = require('../models/paymentModel');
const User = require('../models/userModel');
const { filterOutCart, paddZeros, formatOrderConfirmationMail } = require('../helpers/commonHelper');
const Mailer = require('../helpers/mailer');
// const CMColorUploadDir = 'assets/colors/city_map/';


/**
 * Get user order summary
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_order_summary = async (req, res, next) => {
	const userId = parseInt(req.user_id), email = req.email;
	// return res.json({ success: false, message: 'Product fetched successfully!', data: { prodLabel } });
	try {
		let result = await Cart.findOne({
			where: { user_id: userId },
			include: {
				model: CartProducts,
				required: false,
				include: [{
					model: Products,
					where: { is_active: true, is_deleted: false },
					required: true,
				}, {
					model: Sizes,
					attributes: ['id', 'name', 'label', 'is_active', 'price', 'pdf_price', 'currency', 'product_id'],
					where: { is_active: true },
					required: true,
				}, {
					model: Colors,
					attributes: ['id', 'name', 'label', 'primary_color', 'secondary_color', 'color_url', 'image', 'is_active', 'product_id'],
					where: { is_active: true },
					required: false,
				}, {
					model: Layouts,
					attributes: ['id', 'name', 'label', 'image', 'is_active', 'product_id'],
					where: { is_active: true },
					required: false,
				}, {
					model: Shapes,
					attributes: ['id', 'name', 'label', 'image', 'is_active', 'product_id'],
					where: { is_active: true },
					required: false,
				}],
			},
		}); // , logging: console.log
		if (result && result.cart_products && result.cart_products.length) {
			filteredResult = await filterOutCart(result);
		} else if (!result) { filteredResult = {}; }
		return res.json({ success: true, message: 'Cart fetched successfully!', data: { cart: filteredResult, email } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const get_countries = async (req, res, next) => {
	try {
		const result = await Countries.findAll();
		return res.json({ success: true, message: 'Fetched countries successfully!', data: { countries: result } });
	} catch (error) {
		next(new ErrorHandler(500, config.common_err_msg, error));
	}
};

/**
 * Process stripe payment and generate plan
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkout = async (req, res, next) => {
	const request = req.body, userId = req.user_id, email = req.email;
	if (!request.tokenId || !request.billingAddress) { next(new ErrorHandler(400, config.missing_fields)); }
	let charge;
	try {
		const cart = await Cart.findOne({
			where: { user_id: userId },
			include: {
				model: CartProducts,
				required: false,
				include: [{
					model: Products,
					attributes: ['id', 'name', 'label'],
					where: { is_active: true, is_deleted: false },
					required: true,
				}, {
					model: Sizes,
					attributes: ['id', 'name', 'label', 'price', 'pdf_price', 'currency'],
					where: { is_active: true },
					required: true,
				}, {
					model: Colors,
					attributes: ['id', 'name', 'label', 'primary_color', 'secondary_color', 'color_url', 'image'],
					where: { is_active: true },
					required: false,
				}, {
					model: Layouts,
					attributes: ['id', 'name', 'label', 'image'],
					where: { is_active: true },
					required: false,
				}, {
					model: Shapes,
					attributes: ['id', 'name', 'label', 'image'],
					where: { is_active: true },
					required: false,
				}],
			},
		}); // , logging: console.log
		if (!cart || !cart.cart_products || !cart.cart_products.length) {
			return res.json({ success: true, message: 'Your cart is empty !!!', cart });
		}
		const filteredCart = await filterOutCart(cart);
		const user = await get_user(userId);
		if (!user || !user.id) {
			return res.json({ success: false, message: "User no longer exist in our system." });
		}

		const fullName 	= user && user.first_name ? (user.first_name + ' ' + user.last_name).trim() : null;
		const phone = user && user.mobile ? user.mobile : null;

		/* const mailData = {
			email				: user.email,
			fullName,
			orderDate		: moment().format('MMMM Do YYYY'),
			orderNumber : 'PR00001',
			orderLink		: encodeURI(`${config.site_url}orders/${1}`),
			products		: filteredCart,
			shippingAdd	: (request.billingAddress.useDifferentShippingAddress && request.shippingAddress.full_name) ? request.shippingAddress : request.billingAddress,
		};
		const mailSent = await sendOrderConfirmationViaEmail(mailData);

		return res.json({ success: false, message: request.tokenId, request, filteredCart, user, mailData, mailSent }); */

		const txnResult = await sequelize.transaction(async (t) => {
			try {
				const stripe = Stripe(config.stripe_secret_key);
				const custData = { tokenId: request.tokenId, userId, email, fullName, phone };
				const customer = await fetch_or_create_customer(stripe, t, custData);

				const orderNumber = await generate_order_number(t);

				const order = await create_order(userId, orderNumber, filteredCart, t);
				const orderProducts = await create_order_products(order.id, filteredCart, t);
				// const order = { id: 1 }, orderProducts = { }, addresses = [];
				const addresses = await insert_customer_addressess(userId, order.id, request, t);
				await CartProducts.destroy({ where: { cart_id: filteredCart.id } }, { transaction: t });

				if (customer.type === 'old_customer') {
					await stripe.customers.update(customer.customerId, {
						source: request.tokenId,
					});
				}
				const chargeMetadata = {
					user_id					: userId,
					order_id				: order.id,
					order_number		: orderNumber,
					total_quantity	: filteredCart.cart_products.length,
					total_price			: filteredCart.total_price,
				};
				
				charge = await stripe.charges.create({
					amount: filteredCart.total_price * 100,
					currency: config.stripe_currency,
					customer: customer.customerId,
					description: `Order Number: ${orderNumber} / Order ID: ${order.id} (Price: ${filteredCart.total_price})`,
					metadata: chargeMetadata
				});
				// return res.json({ success: false, message: request.tokenId, request, filteredCart, customer, order, orderProducts, addresses, charge });
				const paymentInserted = await insert_payment(userId, order.id, charge, t);
				// await t.commit();

				const mailData = {
					email				: user.email,
					fullName,
					orderDate		: moment().format('MMMM Do YYYY'),
					orderNumber,
					orderLink		: encodeURI(`${config.site_url}orders/${order.id}`),
					products		: filteredCart,
					shippingAdd	: (request.billingAddress.useDifferentShippingAddress && request.shippingAddress.full_name) ? request.shippingAddress : request.billingAddress,
				};
				sendOrderConfirmationViaEmail(mailData);
				return res.json({ success: true, message: 'Order placed successfully!', data: { order } });
			} catch (error) {
				console.log("******************** TRANSACTION ROLLBACK ****************************");
				// console.log(error);
				await t.rollback();
				return next(new ErrorHandler(200, config.common_err_msg, error));
			}
		});
		// console.log("******************** TRANSACTION RESULT ****************************");
		// console.log(txnResult);
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch existing customer or create a new in stripes
 * 
 * @param {*} stripe 
 * @param {*} t 
 * @param {*} data 
 * @returns 
 */
const fetch_or_create_customer = async (stripe, t, data) => {
	const existingCustomer = await Customers.findOne({ where: { user_id: data.userId } });
	if (existingCustomer) {
		return { customerId: existingCustomer.customer_id, type: 'old_customer' };
	}
	const customer = await stripe.customers.create({
		source: data.tokenId,
		email	: data.email,
		name	: data.fullName,
		phone	: data.phone
	});
	await Customers.create({
		user_id: data.userId, customer_id: customer.id
	}, { transaction: t });
	return { customerId: customer.id, type: 'new_customer' };
};

const insert_payment = async (userId, orderId, charge, t) => {
	// try {
		const payments = {
			user_id				: userId,
			order_id			: orderId,
			charge_id 		: charge.id,
			currency 			: charge.currency,
			amount				: charge.amount,
			payment_method: charge.payment_method,
		};
		return await Payments.create(payments, { transaction: t });
	// } catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	// }
};

/**
 * Generate unique order number
 * 
 * @param {*} t 
 * @returns {String} orderNumber
 */
const generate_order_number = async (t) => {
	const result = await Orders.findOne({
		attributes: ['id', 'order_number'],
		order: [['id', 'DESC']],
	}, { transaction: t });
	// return result;
	if (!result || !result.order_number) { return config.order_number_prefix + paddZeros(1, config.order_number_zeros_length); }
	const nextDigit = parseInt(result.order_number.replace(config.order_number_prefix, '')) + 1
	return config.order_number_prefix + paddZeros(nextDigit, config.order_number_zeros_length);
};

/**
 * Create order
 * 
 * @param {*} userId 
 * @param {*} orderNumber 
 * @param {*} filteredCart 
 * @param {*} t 
 * @returns inserted order
 */
const create_order = async (userId, orderNumber, filteredCart, t) => {
	const orderDetails = {
		user_id				: userId,
		order_number	: orderNumber,
		total_quantity: filteredCart.cart_products.length,
		subtotal			: filteredCart.total_price,
		tax						: 0,
		discount			: 0,
		total_price		: filteredCart.total_price,
	};
	return await Orders.create(orderDetails, { transaction: t })
};

/**
 * Create products in a order
 * 
 * @param {*} orderId 
 * @param {*} filteredCart 
 * @param {*} t 
 * @returns inserted docs
 */
const create_order_products = async (orderId, filteredCart, t) => {
	let products = [];

	filteredCart.cart_products.map(cartItem => {
		const productData = JSON.stringify({
			product: cartItem.product,
			color: cartItem.color,
			layout: cartItem.layout,
			shape: cartItem.shape,
			size: cartItem.size,
			...cartItem.product_data
		});

		products = [ ...products, {
			order_id			: orderId,
			product_id		: cartItem.product_id,
			purchaseType	: cartItem.purchaseType,
			quantity			: 1,
			price 				: cartItem.purchaseType === "print" ? cartItem.size.price : cartItem.size.pdf_price,
			product_data	: productData,
			image_path		: cartItem.image_path,
			pdf_path			: cartItem.pdf_path,
		}];
	});
	return await OrderProducts.bulkCreate(products, { transaction: t })
};

/**
 * Insert billing and shipping address
 * 
 * @param {*} userId 
 * @param {*} orderId 
 * @param {*} request 
 * @param {*} t 
 * @returns inserted docs
 */
const insert_customer_addressess = async (userId, orderId, request, t) => {
	const billingAddress = {
		user_id			: userId,
		order_id		: orderId,
		type				: 'billing',
		full_name		: request.billingAddress.full_name.trim(),
		email				: request.billingAddress.email.trim(),
		mobile			: request.billingAddress.mobile.trim(),
		address			: request.billingAddress.addressLine2 ? request.billingAddress.address + ', ' + request.billingAddress.addressLine2 : request.billingAddress.address,
		city				: request.billingAddress.city.trim(),
		state				: request.billingAddress.state.trim(),
		country			: request.billingAddress.country.country,
		postal_code	: request.billingAddress.postal_code.trim(),
	};
	const shippingAddress = (!request.billingAddress.useDifferentShippingAddress || !request.shippingAddress.full_name) ? {
		...billingAddress,
		type: 'shipping',
	} : {
		user_id			: userId,
		order_id		: orderId,
		type				: 'shipping',
		full_name		: request.shippingAddress.full_name.trim(),
		email				: request.shippingAddress.email.trim(),
		mobile			: request.shippingAddress.mobile.trim(),
		address			: request.shippingAddress.addressLine2 ? request.shippingAddress.address + ', ' + request.shippingAddress.addressLine2 : request.shippingAddress.address,
		city				: request.shippingAddress.city.trim(),
		state				: request.shippingAddress.state.trim(),
		country			: request.shippingAddress.country.country,
		postal_code	: request.shippingAddress.postal_code.trim(),
	};
	return await Addresses.bulkCreate([billingAddress, shippingAddress], { transaction: t })
};


/**
 * Fetch user details
 * @param {*} userId 
 * @returns {Object}
 */
const get_user = async (userId) => {
	return await User.findOne({
		attributes: ['id', 'first_name', 'last_name', 'email', 'mobile', 'profile_image', 'is_deleted', 'createdAt', 'updatedAt'],
		where: { id: userId, is_deleted: false },
		// raw: true
	}); // , logging: console.log
};

/**
 * Send order confirmation via email
 * @param {*} mailData 
 */
const sendOrderConfirmationViaEmail = async (mailData) => {
	try {
		const mailer = new Mailer();
		const { mailText, mailHTML, productAttachments } = await formatOrderConfirmationMail(mailData);
		const mailDetails = {
			to: mailData.email,
			// to: 'kanishk@ourdesignz.in',
			subject: `Order confrmation on ${config.app_name}  #${mailData.orderNumber}`, // Subject line
			text: mailText, // plain text body
			html: mailHTML, // html body
			attachments: productAttachments
		};
		mailer.sendMail(mailDetails);
		return { mailText, mailHTML, productAttachments };
	} catch (error) {
		console.log("ERROR in sendAccessCodeEmail : ", error);
	}
};

module.exports = {
	get_order_summary,
	get_countries,
	checkout
};