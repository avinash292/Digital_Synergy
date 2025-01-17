'user strict';

const config = require('../config');

/**
 * Filter out cart as per product types
 * 
 * @param {Object} result 
 * @returns {Object} filteredResult
 */
const filterOutCart = async (result) => {
	const hasAll = ['city_map', 'star_map'];
	let filteredResult = {
		id: result.id,
		user_id: result.user_id,
		discount: result.discount,
		subtotal: result.subtotal,
		tax: result.tax,
		total_price: result.total_price,
		updatedAt: result.updatedAt,
		createdAt: result.createdAt,
		cart_products: []
	}
	result.cart_products.forEach((cartItem, index) => {
		const productData = cartItem.product_data ? JSON.parse(cartItem.product_data) : cartItem.product_data;
		const totalPrice = cartItem.purchaseType === "print" ? cartItem.size.price : cartItem.size.pdf_price;
		if ((hasAll.includes(cartItem.product.label) && cartItem.color && cartItem.layout && cartItem.size && cartItem.shape)
			|| (cartItem.product.label === 'coordinate_poster' && cartItem.color && cartItem.layout && cartItem.size)
			|| (cartItem.product.label === 'family_poster' && cartItem.layout && cartItem.size)
		) {
			cartItem.product_data = productData;
			filteredResult.cart_products = [ ...filteredResult.cart_products, cartItem];
			filteredResult.total_price += totalPrice;
		}
	});
	return filteredResult;
};

/**
 * Padding zeros
 * 
 * @param {*} value 
 * @param {*} paddingNumber 
 * @returns 
 */
const paddZeros = (value, paddingNumber) => {
	if (value === undefined || value === null) { return '00'; }
	paddingNumber = paddingNumber || 2;
	return value.toString().padStart(paddingNumber, '0')
};

const formatUnderscore = (text) => {
	if (!text || text === '') { return text };
	let splitText = text.split('_');
	return splitText.map((word) => word.charAt(0).toUpperCase() +  word.slice(1)).join(' ');
};

const formatCurrency = (value, deciamalPlaces) => {
	if (!value || value === '') { return value };
	deciamalPlaces = deciamalPlaces || 2;
	return value.toFixed(deciamalPlaces);
};

const formatOrderConfirmationMail = async (mailData) => {
	const serverPath = `https://stagingwebsites.info/odz/posters/api/`;
	// const serverPath = `http://localhost/posters/api/`;
	const imgPath = serverPath + config.product_file_path;
	let productAttachments = [];

	const style = `
	<style type="text/css">
		body,
		table,
		td,
		a {
				-webkit-text-size-adjust: 100%;
				-ms-text-size-adjust: 100%;
		}

		table,
		td {
				mso-table-lspace: 0pt;
				mso-table-rspace: 0pt;
				font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;
		}

		img {
				-ms-interpolation-mode: bicubic;
		}

		img {
				border: 0;
				height: auto;
				line-height: 100%;
				outline: none;
				text-decoration: none;
		}

		table {
				border-collapse: collapse !important;
		}

		body {
				height: 100% !important;
				margin: 0 !important;
				padding: 0 !important;
				width: 100% !important;
				margin: 0 !important; padding: 0 !important; background-color: #eeeeee;
		}

		a[x-apple-data-detectors] {
				color: inherit !important;
				text-decoration: none !important;
				font-size: inherit !important;
				font-family: inherit !important;
				font-weight: inherit !important;
				line-height: inherit !important;
		}
		.w-75{width: 75%;}
		.w-25{width: 25%;}
		td{padding: 10px;}
		.pl-0{padding-left: 0 !important;}
		.pr-0{padding-right: 0 !important;}
		.pt-0{padding-top: 0 !important}
		.pb-0{padding-bottom: 0 !important}
		.p-0{padding: 0 !important;}
		p {margin: 10px 0;}
		b {font-weight: 800;}

		
		.manage-order {
			text-align: center;
		}
		.manage-order a {
			color: #f50057;
			font-weight: bold;
		}
		.logo {background: #000;color: #fff;padding: 20px 0;}
		.logo h4 {margin: 0;font-size: 24px;text-transform: uppercase;}
	</style>`;

	const addressHTML = `<span>${mailData.shippingAdd.full_name.trim()}</span>
		<span>${mailData.shippingAdd.addressLine2 ? mailData.shippingAdd.address + ', ' + mailData.shippingAdd.addressLine2 : mailData.shippingAdd.address}</span>
		<span>${mailData.shippingAdd.city.trim()}</span>
		<span>${mailData.shippingAdd.state.trim()}</span>
		<span>${mailData.shippingAdd.country.country}</span>
		<span>${mailData.shippingAdd.postal_code.trim()}</span>`;

	let mailText = `Hi  ${mailData.fullName}\n\n
	Your order has been successfully placed.\n
	Order placed on ${mailData.orderDate}\n
	Order ID ${mailData.orderNumber}\n\n
	Manage your order from ${mailData.orderLink}\n\n\n`;



	let mailHTML = `<html>
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<meta name="x-apple-disable-message-reformatting" />

			${style}
		</head>

		<body>
			<table border="0" cellpadding="0" cellspacing="0" width="100%">
				<tr>
					<td align="center" style="background-color: #eeeeee;" bgcolor="#eeeeee">
						<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
							<tr>
								<td class="logo" align="center">
									<h4>Poster</h4>
								</td>
							</tr>
							<tr>
								<td align="center" style="padding: 35px 35px 20px 35px; background-color: #ffffff;">
									<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
										<tr>
											<td class="p-0" align="center">
												<h2 style="font-size: 30px; font-weight: 800; line-height: 36px; color: #333333; margin: 0;"> Thank You For Your Order! </h2>
											</td>
										</tr>
										<tr>
											<td class="pl-0 pr-0 pb-0">
												<p style="font-size: 16px; font-weight: 400; line-height: 24px; color: #777777;">
													<b>Hi ${mailData.fullName}</b>, Your order has been successfully placed.
												</p>
											</td>
										</tr>
										<tr>
											<td class="p-0">
												<table cellspacing="0" cellpadding="0" border="0" width="100%">
													<!-- <tr>
														<td class="w-75" align="center">
															<img src="">
														</td>
													</tr> -->
													<tr>
														<td class="w-75" bgcolor="#eeeeee"><b>Order Details</b></td>
														<td class="w-25" align="center" bgcolor="#eeeeee"><b>Product</b></td>
													</tr>`;

	mailData.products.cart_products.forEach((product, index) => {
		const price = product.purchaseType === "print" ? product.size.price : product.size.pdf_price;
		mailText += `${product.product.name}\nMedium: ${formatUnderscore(product.purchaseType)}\nSize: ${product.size.name}\nPrice: $${formatCurrency(price)}\n\n`;
		productAttachments = [...productAttachments, {
			filename: `image_${index}.png`,
			path: imgPath + product.image_path,
			cid: `image_${index}` //same cid value as in the html img src
		}];


		mailHTML += `<tr>
			<td class="w-25" style="font-family: Open Sans, Helvetica, Arial, sans-serif; padding: 10px 10px 0 10px;">
				<span><b>${product.product.name}</b></span><br />
				<span>Medium: ${formatUnderscore(product.purchaseType)}</span><br />
				<span>Size: ${product.size.name}</span><br />
				<span>Price: $${formatCurrency(price)}</span><br />
			</td>
			<td class="w-75" align="center">
				<img src="cid:image_${index}" width="70" height="" style="display: block; border: 0px;" />
			</td>
		</tr>`;
	});

	mailHTML += `
													<tr>
														<td></td>
													</tr>
													<tr>
														<td class="w-75" bgcolor="#eeeeee"><b>Order Confirmation</b></td>
														<td class="w-25" bgcolor="#eeeeee"><b>#${mailData.orderNumber}</b></td>
													</tr>
													<tr>
														<td class="w-75" align="left"> Purchased Item (${mailData.products.cart_products.length}) </td>
														<td class="w-25" align="left"> $${formatCurrency(mailData.products.total_price)} </td>
													</tr>
													<tr>
														<td class="w-75" align="left"> Shipping + Handling </td>
														<td class="w-25" align="left"> $0.00 </td>
													</tr>
												</table>
											</td>
										</tr>
										<tr>
											<td style="padding-top: 20px;">
												<table cellspacing="0" cellpadding="0" border="0" width="100%">
													<tr>
														<td class="w-75" style=" border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;"><b>TOTAL</b></td>
														<td class="w-25" style=" border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;"><b>$${formatCurrency(mailData.products.total_price)}</b></td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td align="center" height="100%" valign="top" width="100%" style="padding: 0 35px 35px 35px; background-color: #ffffff;" bgcolor="#ffffff">
									<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px;">
										<tr>
											<td class="p-0" align="center" valign="top" style="font-size:0;">
												<div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%;">
													<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
														<tr>
															<td valign="top">
																<span style="font-weight: 800;">Delivery Address</span>
																<p>${addressHTML}</p>
															</td>
														</tr>
													</table>
												</div>
												<div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%;">
													<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
														<tr>
															<td class="manage-order">
																<a href="${mailData.orderLink}" target="_blank">Manage Order</a>
															</td>
														</tr>
													</table>
												</div>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</body>		
	</html>`;
	

	return { mailText, mailHTML, productAttachments };
};


module.exports = {
  filterOutCart,
	paddZeros,
	formatUnderscore,
	formatCurrency,
	formatOrderConfirmationMail,
};