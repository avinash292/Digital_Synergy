"user strict";

const { Op, fn, col } = require("sequelize");
const config = require("../config");
const { ErrorHandler } = require("../helpers/errorhandler");
const Orders = require("../models/orderModel");
const OrderProducts = require("../models/orderProductModel");
const Addresses = require("../models/addressModel");
const OrderShipments = require("../models/orderShipmentModel");
// const Products = require('../models/productModel');
// const { filterOutCart, paddZeros } = require('../helpers/commonHelper');

/**
 * Get user order summary
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_all_orders = async (req, res, next) => {
	const userId = parseInt(req.user_id);
	const request = {
		orderBy:
			req.body.orderBy !== undefined && req.body.orderBy !== ""
				? req.body.orderBy
				: "id",
		order:
			req.body.order !== undefined && req.body.order !== ""
				? req.body.order
				: "ASC",
		pageSize: req.body.pageSize !== undefined ? req.body.pageSize : 10,
		pageOffset:
			req.body.pageOffset !== undefined && req.body.pageOffset !== null
				? req.body.pageOffset
				: 0,
		searchText:
			req.body.searchText !== undefined ? req.body.searchText : "",
	};
	// return res.json({ success: false, message: 'Test fetched successfully!', userId, request });

	let order = [request.orderBy, request.order];
	if (request.orderBy === "full_name") {
		order = ["addresses", "full_name", request.order];
	}

	const searchColumns = [
		"id",
		"total_quantity",
		"total_price",
		"order_status",
		"createdAt",
	];

	let likeSearch = {};
	if (request.searchText !== "") {
		const likeColumns = searchColumns.map((column) => {
			return { [column]: { [Op.like]: "%" + request.searchText + "%" } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}

	try {
		// const count = await Orders.count({ where: { ...likeSearch, user_id: userId } });
		let result = await Orders.findAndCountAll({
			// attributes: ['id', 'user_id', 'order_number', 'total_quantity', 'subtotal', 'tax', 'discount', 'total_price', 'order_status', 'createdAt', [fn('COUNT', col('order_products.id')), 'product_count'] ],
			where: { ...likeSearch, user_id: userId },
			include: {
				model: Addresses,
				where: { type: "shipping" },
				attributes: [
					"email",
					"full_name",
					"id",
					"mobile",
					"order_id",
					"type",
					"user_id",
				],
			},
			// group: ['id'],
			order: [order],
			offset: request.pageOffset,
			limit: request.pageSize,
			subQuery: false,
		}); // , logging: console.log
		return res.json({
			success: true,
			message: "Orders fetched successfully!",
			data: result,
		});
		// return res.json({ success: true, message: 'Orders fetched successfully!', data: { count, rows: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Get user order details
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_order_details = async (req, res, next) => {
	const userId = parseInt(req.user_id),
		orderId = parseInt(req.params.id);
	// return res.json({ success: false, message: 'Test fetched successfully!', userId, orderId });
	try {
		const result = await Orders.findOne({
			where: { user_id: userId, id: orderId },
			include: [
				{
					model: Addresses,
				},
				{
					model: OrderProducts,
				},
				{
					model: OrderShipments,
					where: { is_active: true },
					required: false,
				},
			],
		}); // , logging: console.log
		let filteredResult = result;
		if (result && result.order_products && result.order_products.length) {
			result.order_products.forEach((orderItem, index) => {
				filteredResult.order_products[index].product_data =
					orderItem.product_data
						? JSON.parse(orderItem.product_data)
						: orderItem.product_data;
			});
		} else if (!result) {
			filteredResult = null;
		}
		return res.json({
			success: true,
			message: "Order details fetched successfully!",
			data: { order_details: filteredResult },
		});
		// return res.json({ success: true, message: 'Orders fetched successfully!', data: { count, rows: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Get all orders (ADMIN)
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_all_admin_orders = async (req, res, next) => {
	const request = {
		orderBy:
			req.body.orderBy !== undefined && req.body.orderBy !== ""
				? req.body.orderBy
				: "id",
		order:
			req.body.order !== undefined && req.body.order !== ""
				? req.body.order
				: "ASC",
		pageSize: req.body.pageSize !== undefined ? req.body.pageSize : 10,
		pageOffset:
			req.body.pageOffset !== undefined && req.body.pageOffset !== null
				? req.body.pageOffset
				: 0,
		searchText:
			req.body.searchText !== undefined ? req.body.searchText : "",
	};
	// return res.json({ success: false, message: 'Test fetched successfully!', userId, request });

	let order = [request.orderBy, request.order];
	if (request.orderBy === "full_name") {
		order = ["addresses", "full_name", request.order];
	}

	const searchColumns = [
		"id",
		"order_number",
		"total_quantity",
		"total_price",
		"order_status",
		"createdAt",
	];

	let likeSearch = {};
	if (request.searchText !== "") {
		const likeColumns = searchColumns.map((column) => {
			return { [column]: { [Op.like]: "%" + request.searchText + "%" } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}

	try {
		// const count = await Orders.count({ where: { ...likeSearch, user_id: userId } });
		let result = await Orders.findAndCountAll({
			// attributes: ['id', 'user_id', 'order_number', 'total_quantity', 'subtotal', 'tax', 'discount', 'total_price', 'order_status', 'createdAt', [fn('COUNT', col('order_products.id')), 'product_count'] ],
			where: { ...likeSearch },
			include: {
				model: Addresses,
				where: { type: "billing" },
				attributes: [
					"email",
					"full_name",
					"id",
					"mobile",
					"order_id",
					"type",
					"user_id",
				],
			},
			// group: ['id'],
			order: [order],
			offset: request.pageOffset,
			limit: request.pageSize,
			subQuery: false,
		}); // , logging: console.log
		return res.json({
			success: true,
			message: "Orders fetched successfully!",
			data: result,
		});
		// return res.json({ success: true, message: 'Orders fetched successfully!', data: { count, rows: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Get order details (ADMIN)
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_admin_order_details = async (req, res, next) => {
	const orderId = parseInt(req.params.id);
	// return res.json({ success: false, message: 'Test fetched successfully!', userId, orderId });
	try {
		const result = await Orders.findOne({
			where: { id: orderId },
			include: [
				{
					model: Addresses,
				},
				{
					model: OrderProducts,
				},
				{
					model: OrderShipments,
					where: { is_active: true },
					required: false,
				},
			],
		}); // , logging: console.log
		let filteredResult = result;
		if (result && result.order_products && result.order_products.length) {
			result.order_products.forEach((orderItem, index) => {
				filteredResult.order_products[index].product_data =
					orderItem.product_data
						? JSON.parse(orderItem.product_data)
						: orderItem.product_data;
			});
		} else if (!result) {
			filteredResult = null;
		}
		return res.json({
			success: true,
			message: "Order details fetched successfully!",
			data: { order_details: filteredResult },
		});
		// return res.json({ success: true, message: 'Orders fetched successfully!', data: { count, rows: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Update order status (ADMIN)
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON response
 */
const update_order_status = async (req, res, next) => {
	const orderId = parseInt(req.params.id),
		request = req.body;
	try {
		if (!request.order_status) {
			return next(new ErrorHandler(400, config.missing_fields));
		}
		const result = await Orders.update(
			{ order_status: request.order_status },
			{ where: { id: orderId } }
		); // , logging: console.log
		return res.json({
			success: true,
			message: "Order status updated successfully!",
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Update order status (ADMIN)
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON response
 */
const update_shipment_details = async (req, res, next) => {
	const orderId = parseInt(req.params.id),
		request = req.body;
	try {
		if (!request.shipping_id && !request.shipping_url) {
			return next(new ErrorHandler(400, config.missing_fields));
		}
		const data = {
			order_id: orderId,
			shipping_id: request.shipping_id
				? request.shipping_id.toString().trim()
				: null,
			shipping_url: request.shipping_url
				? request.shipping_url.toString().trim()
				: null,
		};

		const result = await OrderShipments.findOne({
			where: { order_id: orderId },
		});
		if (!result) {
			await OrderShipments.create(data);
		} else {
			await OrderShipments.update(data, { where: { order_id: orderId } });
		}
		return res.json({
			success: true,
			message: "Order shpiment details updated successfully!",
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

module.exports = {
	get_all_orders,
	get_order_details,
	get_all_admin_orders,
	get_admin_order_details,
	update_order_status,
	update_shipment_details,
};
