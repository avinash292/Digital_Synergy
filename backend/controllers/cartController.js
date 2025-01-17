"user strict";

// const Users = require('../models/userModel');

// const { Op } = require('sequelize');
const IncomingForm = require("formidable").IncomingForm;
const fs = require("fs");
const PDFDocument = require("pdfkit");
const pdf2img = require("pdf2img");
const sharp = require("sharp");

const config = require("../config");
const { ErrorHandler } = require("../helpers/errorhandler");
const { filterOutCart } = require("../helpers/commonHelper");
const Cart = require("../models/cartModel");
const CartProducts = require("../models/cartProductModel");
const Products = require("../models/productModel");
const Shapes = require("../models/shapeModel");
const Colors = require("../models/colorModel");
const Layouts = require("../models/layoutModel");
const Sizes = require("../models/sizeModel");

const uploadDir = config.product_file_path;

const createImageFromPdf = async (uploadDir, pdfFilePath, imageFileName) => {
	return new Promise((resolve, reject) => {
		pdf2img.setOptions({
			type: "png", // png or jpg, default jpg
			size: 1024, // default 1024
			density: 600, // default 600
			outputdir: uploadDir, // output folder, default null (if null given, then it will create folder name same as file name)
			outputname: imageFileName, // output file name, dafault null (if null given, then it will create image name same as input name)
			page: 0, // convert selected page, default null (if null given, then it will convert all pages)
		});

		pdf2img.convert(pdfFilePath, (err, info) => {
			if (err) {
				reject(err);
			} else {
				const imgFilePath =
					info.message[0] && info.message[0].name
						? info.message[0].name
						: "";
				resolve(imgFilePath);
			}
		});
	});
};

/**
 * Add update cart
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const save_cart = async (req, res, next) => {
	const userId = parseInt(req.user_id);
	let form = new IncomingForm();
	form.uploadDir = uploadDir; //set upload directory
	form.keepExtensions = true; //keep file extension
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir);
	}

	form.parse(req, async (err, fields, files) => {
		if (err) {
			return next(new ErrorHandler(500, config.common_err_msg, err));
		}
		// const userId = req.user_id;
		var pdfFilePath = files && files.file ? files.file.path : null;
		var imageFilePath =
			files && files.image_file ? files.image_file.path : null;
		let pdfFileName = pdfFilePath
			? pdfFilePath.replace(uploadDir, "")
			: null;
		let imageFileName = imageFilePath
			? imageFilePath.replace(uploadDir, "")
			: null;
		const data = JSON.parse(fields.data);

		if (!userId || !data.product_id || !data.purchaseType) {
			delete_file(imageFilePath);
			delete_file(pdfFilePath);
			return next(
				new ErrorHandler(400, "Missing required product fields.")
			);
		}

		try {
			if (data.generate_pdf && imageFilePath) {
				let scale = data.scale || 8;
				scale = scale / 2;
				pdfFileName = imageFileName.split(".")[0] + ".pdf";
				let doc = new PDFDocument({ autoFirstPage: false });
				doc.pipe(fs.createWriteStream(uploadDir + pdfFileName));
				const img = doc.openImage(imageFilePath);
				let scaledHeight = img.height / scale,
					scaledWidth = img.width / scale;
				doc.addPage({ size: [scaledWidth, scaledHeight] });
				doc.image(img, 0, 0, {
					height: scaledHeight,
					width: scaledWidth,
				});
				doc.end();
			} else if (data.generate_image && pdfFilePath) {
				imageFileName = pdfFileName.split(".")[0];
				imageFileName = await createImageFromPdf(
					uploadDir,
					pdfFilePath,
					imageFileName
				);
				imageFilePath = uploadDir + imageFileName;
			}
			const thumbnailName = await create_thumbnail_image(
				imageFileName,
				imageFilePath
			);

			// return res.json({ success: false, message: 'Test successfully!', data, fields, files, thumbnailName });

			const cartResult = await Cart.findOrCreate({
				where: { user_id: userId },
				defaults: { subtotal: 0, total_price: 0 },
			});
			if (cartResult.length === 0) {
				delete_file(pdfFilePath);
				delete_file(imageFilePath);
				return res.json({
					success: false,
					message: "Unable to create user cart",
					result,
				});
			}
			const cart = cartResult[0];
			let productData = {};
			if (data.product_label === "city_map") {
				productData = JSON.stringify({
					text: data.text,
					location: data.location,
					icon: data.icon,
				});
			} else if (data.product_label === "star_map") {
				productData = JSON.stringify({
					text: data.text,
					location: data.location,
					elements: data.elements,
					date: data.date,
				});
			} else if (data.product_label === "coordinate_poster") {
				productData = JSON.stringify({
					text: data.text,
					location: data.location,
				});
			} else {
				productData = JSON.stringify({
					text: data.text,
					location: data.location,
				});
			}
			const product = {
				cart_id: cart.id,
				product_id: data.product_id,
				color_id: data.color ? data.color.id : null,
				layout_id: data.layout ? data.layout.id : null,
				shape_id: data.shape ? data.shape.id : null,
				size_id: data.size ? data.size.id : null,
				product_data: productData,
				purchaseType: data.purchaseType,
				pdf_path: pdfFileName,
				image_path: thumbnailName,
			};
			// return res.json({ success: false, message: 'Test successfully!', data, userId, cart, product });
			const result = await CartProducts.create(product);
			return res.json({
				success: true,
				message: "Product added to cart successfully!",
				result,
			});
		} catch (error) {
			delete_file(pdfFilePath);
			delete_file(imageFilePath);
			next(new ErrorHandler(200, config.common_err_msg, error));
		}
	});
	form.on("error", (err) => {
		return next(new ErrorHandler(500, config.common_err_msg, err));
	});
};

const create_thumbnail_image = async (imageFileName, imageFilePath) => {
	const thumbnailName = imageFileName.replace("upload_", "thumb_");
	const img = await sharp(imageFilePath)
		.resize(200)
		.toFile(uploadDir + thumbnailName);
	delete_file(imageFilePath);
	return thumbnailName;
};

/**
 * Delete file
 *
 * @param {*} filepath
 */
const delete_file = (filepath) => {
	try {
		if (fs.existsSync(filepath)) {
			fs.unlinkSync(filepath);
		}
	} catch (error) {}
};

/**
 * Get user cart products
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_cart = async (req, res, next) => {
	const userId = parseInt(req.user_id),
		type = req.params.type;
	// return res.json({ success: false, message: 'Product fetched successfully!', data: { prodLabel } });
	try {
		let result = await Cart.findOne({
			where: { user_id: userId },
			include: {
				model: CartProducts,
				required: false,
				include: [
					{
						model: Products,
						where: { is_active: true, is_deleted: false },
						required: true,
					},
					{
						model: Colors,
						attributes: [
							"id",
							"name",
							"label",
							"primary_color",
							"secondary_color",
							"color_url",
							"image",
							"is_active",
							"product_id",
						],
						where: { is_active: true },
						required: false,
					},
					{
						model: Layouts,
						attributes: [
							"id",
							"name",
							"label",
							"image",
							"is_active",
							"product_id",
						],
						where: { is_active: true },
						required: false,
					},
					{
						model: Sizes,
						attributes: [
							"id",
							"name",
							"label",
							"is_active",
							"price",
							"pdf_price",
							"currency",
							"product_id",
						],
						where: { is_active: true },
						required: true,
					},
					{
						model: Shapes,
						attributes: [
							"id",
							"name",
							"label",
							"image",
							"is_active",
							"product_id",
						],
						where: { is_active: true },
						required: false,
						/* on: {
						col1: where(col("cart_products.shape_id"), "=", col("cart_products->shape.id")),
						col2: where(col("cart_products->shape.is_active"), "=", true)
					}, */
					},
				],
			},
			// raw: true
		});
		let filteredResult = result,
			cartCount = 0;
		if (result && result.cart_products && result.cart_products.length) {
			filteredResult = await filterOutCart(result);
			cartCount = filteredResult.cart_products.length;
		} else if (!result) {
			filteredResult = {};
		}

		if (type === "count") {
			return res.json({
				success: true,
				message: "Fetched cart count successfully!",
				data: { count: cartCount },
			});
		} else {
			return res.json({
				success: true,
				message: "Cart fetched successfully!",
				data: { cart: filteredResult, type },
			});
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Delete product from cart
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const delete_cart_product = async (req, res, next) => {
	const cartProductId = parseInt(req.params.id);
	const pdfPath = req.params.pdfPath;
	const imgPath = req.params.imgPath;
	if (!cartProductId) {
		next(new ErrorHandler(400, "Missing delete ID"));
	}

	try {
		if (imgPath) {
			delete_file(uploadDir + imgPath);
		}
		if (pdfPath) {
			delete_file(uploadDir + pdfPath);
		}
		const result = await CartProducts.destroy({
			where: { id: cartProductId },
		});
		return res.json({
			success: true,
			message: "Product removed successfully from the cart!",
			result,
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

module.exports = {
	save_cart,
	get_cart,
	delete_cart_product,
};
