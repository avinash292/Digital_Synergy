"user strict";

// const Users = require('../models/userModel');
const config = require("../config");
const { ErrorHandler } = require("../helpers/errorhandler");
const Products = require("../models/productModel");
const Shapes = require("../models/shapeModel");
const Colors = require("../models/colorModel");
const Layouts = require("../models/layoutModel");
const Sizes = require("../models/sizeModel");
const { Op } = require("sequelize");
const IncomingForm = require("formidable").IncomingForm;
const fs = require("fs");

const CMColorUploadDir = "assets/colors/city_map/";

/**
 * Fetch products listing
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Object} json object
 */
const get_products = async (req, res, next) => {
	// const request = req.body;
	// if (!request.email || !request.password) { next(new ErrorHandler(400, 'Missing required email and password fields')); }

	let request = {};
	request.orderBy =
		req.body.orderBy !== undefined && req.body.orderBy !== ""
			? req.body.orderBy
			: "id";
	request.order =
		req.body.order !== undefined && req.body.order !== ""
			? req.body.order
			: "ASC";
	request.pageSize = req.body.pageSize !== undefined ? req.body.pageSize : 10;
	request.pageOffset =
		req.body.pageOffset !== undefined && req.body.pageOffset !== null
			? req.body.pageOffset
			: 0;
	request.searchText =
		req.body.searchText !== undefined ? req.body.searchText : "";

	const searchColumns = ["id", "name"];
	let likeSearch = {};
	if (request.searchText !== "") {
		const likeColumns = searchColumns.map((column) => {
			return { [column]: { [Op.like]: "%" + request.searchText + "%" } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	try {
		let result = await Products.findAndCountAll({
			where: { ...likeSearch, is_deleted: false },
			order: [[request.orderBy, request.order]],
			offset: request.pageOffset,
			limit: request.pageSize,
		});
		return res.json({
			success: true,
			message: "Fetched products successfully!",
			data: result,
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update product
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const save_product = async (req, res, next) => {
	const request = req.body;
	if (!request.name || request.is_active === undefined) {
		return next(new ErrorHandler(400, "Missing required product fields."));
	}
	request.name = request.name.trim();

	try {
		const productId =
			request.type == "edit" && request.id !== undefined
				? request.id
				: false;
		// console.log("productId : ",productId);
		let ifExist = await check_if_product_name_exist(
			request.name,
			productId,
			next
		);
		if (ifExist) {
			return res.json({
				success: false,
				message: "Product name already exists!",
			});
		}
		// return res.json({ success: true, message: 'Fetched prod successfully!', request, ifExist });
		const product = { name: request.name, is_active: request.is_active };
		if (request.type == "add") {
			const result = await Products.create(product);
			return res.json({
				success: true,
				message: "Product created successfully!",
				result,
			});
		} else {
			const result = await Products.update(product, {
				where: { id: request.id },
			});
			return res.json({
				success: true,
				message: "Product updated successfully!",
				result,
			});
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Check if name exists
 *
 * @param {*} name
 * @param {*} prodId
 * @param {*} next
 */
const check_if_product_name_exist = async (name, prodId, next) => {
	try {
		let where = { name, is_deleted: false };
		if (prodId) {
			where = { ...where, id: { [Op.not]: prodId } };
		}
		let result = await Products.findOne({ where }); // , logging: console.log
		// console.log(result);
		return result ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const get_product_details = async (req, res, next) => {
	const prodId = parseInt(req.params.id);
	try {
		let result = await Products.findOne({
			where: { id: prodId, is_deleted: false },
			include: [
				{ model: Shapes },
				{ model: Colors },
				{ model: Layouts },
				{
					model: Sizes,
					attributes: [
						"id",
						"name",
						"price",
						"pdf_price",
						"currency",
						"is_active",
					],
				},
			],
		}); // , logging: console.log
		return res.json({
			success: true,
			message: "Product fetched successfully!",
			data: { product_details: result },
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * get product deatil from label
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_product_details_by_label = async (req, res, next) => {
	const prodLabel = req.params.label;
	// return res.json({ success: false, message: 'Product fetched successfully!', data: { prodLabel } });
	let joins = [
		{
			model: Colors,
			attributes: [
				"id",
				"name",
				"label",
				"primary_color",
				"secondary_color",
				"tertiary_color",
				"outline_color",
				"text_color",
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
			order: [["id", "ASC"]],
			required: false,
		},
		{
			model: Sizes,
			where: { is_active: true },
			required: false,
		},
	];
	if (prodLabel !== "coordinate_poster") {
		joins = [
			...joins,
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
			},
		];
	}
	try {
		let result = await Products.findOne({
			where: { label: prodLabel, is_deleted: false, is_active: true },
			include: joins,
		}); // , logging: console.log
		return res.json({
			success: true,
			message: "Product fetched successfully!",
			data: { product_details: result },
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch video from APP
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_all_products = async (req, res, next) => {
	try {
		const result = await Products.findAll({
			attributes: ["id", "name", "label", "is_active"],
			where: { is_deleted: false, is_active: true },
		});
		return res.json({
			success: true,
			message: "Fetched products successfully!",
			data: result,
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update product shapes
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const activate_deactivate_shape = async (req, res, next) => {
	const request = req.body;
	if (!request.id || request.is_active === undefined) {
		return next(new ErrorHandler(400, "Missing required product fields."));
	}
	// return res.json({ success: true, message: 'Fetched prod successfully!', request });

	try {
		const result = await Shapes.update(
			{ is_active: request.is_active },
			{ where: { id: request.id } }
		);
		return res.json({
			success: true,
			message: "Product updated successfully!",
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update product layouts
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const activate_deactivate_layout = async (req, res, next) => {
	const request = req.body;
	if (!request.id || request.is_active === undefined) {
		return next(new ErrorHandler(400, "Missing required product fields."));
	}
	// return res.json({ success: true, message: 'Fetched prod successfully!', request });

	try {
		const result = await Layouts.update(
			{ is_active: request.is_active },
			{ where: { id: request.id } }
		);
		return res.json({
			success: true,
			message: "Product updated successfully!",
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update product price
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const update_size_price = async (req, res, next) => {
	const request = req.body;
	if (!request.id || request.is_active === undefined) {
		return next(new ErrorHandler(400, "Missing required product fields."));
	}

	try {
		let size = { is_active: request.is_active };
		if (request.price) {
			size = { ...size, price: parseFloat(request.price) };
		}
		if (request.pdf_price) {
			size = { ...size, pdf_price: parseFloat(request.pdf_price) };
		}
		// return res.json({ success: false, message: 'Product updated successfully!', request, size });
		const result = await Sizes.update(size, { where: { id: request.id } });
		return res.json({
			success: true,
			message: "Product updated successfully!",
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update product shapes
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const activate_deactivate_color = async (req, res, next) => {
	const request = req.body;
	if (!request.id || request.is_active === undefined) {
		return next(new ErrorHandler(400, "Missing required product fields."));
	}

	try {
		const result = await Colors.update(
			{ is_active: request.is_active },
			{ where: { id: request.id } }
		);
		return res.json({
			success: true,
			message: "Product updated successfully!",
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Check if color label exists
 *
 * @param {*} label
 * @param {*} colorId
 * @param {*} next
 * @param {*} returnResult
 */
const check_if_color_label_exist = async (
	label,
	colorId,
	next,
	returnResult
) => {
	try {
		let where = { label, product_id: 1 };
		if (colorId) {
			where = { ...where, id: { [Op.not]: colorId } };
		}
		// console.log("where : ", where);
		const result = await Colors.findOne({ where }); // , logging: console.log
		if (returnResult) {
			return result;
		}
		return result ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update color
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const save_color = async (req, res, next) => {
	let form = new IncomingForm();

	form.uploadDir = CMColorUploadDir; //set upload directory
	form.keepExtensions = true; //keep file extension

	form.parse(req, async (err, fields, files) => {
		if (err) {
			return next(new ErrorHandler(500, config.common_err_msg, err));
		}
		// const userId = req.user_id;
		let filePath = files && files.file ? files.file.path : null;
		let filename = filePath ? filePath.replace(CMColorUploadDir, "") : null;
		// delete_file(filePath);
		const data = JSON.parse(fields.data);
		if (!data && !data.name) {
			delete_file(filePath);
			return next(
				new ErrorHandler(400, "Missing required name or label fields")
			);
		}
		data.name = data.name.trim();
		data.label = data.label.trim();
		data.colorUrl = data.colorUrl.trim();
		// data.image = filename;

		// return res.json({ success: false, message: 'User created successfully!', data });
		try {
			const colorId =
				data.type == "edit" && data.id !== undefined ? data.id : false;
			let ifExist = await check_if_color_label_exist(
				data.label,
				colorId,
				next
			);
			// return res.json({ success: false, message: 'User created successfully!', fields, files, data, ifExist });
			if (ifExist) {
				return res.json({
					success: false,
					message:
						"Color label already exists! Please enter a unique label for colors.",
				});
			}

			let color = {
				name: data.name,
				label: data.label,
				// primary_color		: data.primaryColor,
				// secondary_color	: data.secondaryColor,
				color_url: data.colorUrl,
				is_active: data.is_active,
				product_id: 1,
			};
			if (filename) {
				color.image = filename;
			}
			// console.log(data.type);
			if (data.type == "add") {
				const result = await Colors.create(color);
				return res.json({
					success: true,
					message: "Color created successfully!",
					result,
				});
			} else {
				if (fields.old_image_path) {
					delete_file(CMColorUploadDir + fields.old_image_path);
				}
				await Colors.update(color, { where: { id: data.id } });
				return res.json({
					success: true,
					message: "Color updated successfully!",
					data: { image_name: filename },
				});
			}
		} catch (error) {
			delete_file(filePath);
			next(new ErrorHandler(200, config.common_err_msg, error));
		}
	});
	form.on("error", (err) => {
		return next(new ErrorHandler(500, config.common_err_msg, err));
	});
};

/**
 * Add delete user
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const delete_color = async (req, res, next) => {
	const colorId = parseInt(req.params.id),
		imageName = req.params.image;
	if (!colorId) {
		next(new ErrorHandler(400, "Missing delete ID"));
	}
	// return res.json({ success: false, message: 'test successfully!', colorId, imageName });

	try {
		if (imageName) {
			delete_file(CMColorUploadDir + imageName);
		}
		const result = await Colors.destroy({ where: { id: colorId } });
		return res.json({
			success: true,
			message: "Color deleted successfully!",
			result,
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const delete_file = (filepath) => {
	if (fs.existsSync(filepath)) {
		fs.unlinkSync(filepath);
	}
};

module.exports = {
	get_products,
	save_product,
	get_product_details,
	get_all_products,
	get_product_details_by_label,
	activate_deactivate_shape,
	activate_deactivate_color,
	activate_deactivate_layout,
	update_size_price,
	save_color,
	delete_color,
};
