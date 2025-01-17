"user strict";

const config = require("../config");
const bcrypt = require("bcrypt");
const { ErrorHandler } = require("../helpers/errorhandler");
const Auth = require("../middlewares/auth");
const Users = require("../models/userModel");
const sequelize = require("../db");
// const { Op, col, where } = require('sequelize');

/**
 * Validate admin credentials
 *
 * @param {*} req
 * @param {*} res
 */
const login = async (req, res, next) => {
	const request = req.body;
	if (!request.email || !request.password) {
		next(
			new ErrorHandler(400, "Missing required email and password fields")
		);
	}
	request.password = request.password.trim();
	request.email = request.email.trim();

	try {
		let user = await Users.findOne({
			attributes: [
				"id",
				"first_name",
				"last_name",
				"email",
				"password",
				"role",
				"profile_image",
				"is_deleted",
				[
					sequelize.fn(
						"CONCAT",
						sequelize.col("first_name"),
						" ",
						sequelize.col("last_name")
					),
					"full_name",
				],
			],
			where: { email: request.email, is_deleted: false, role: "admin" },
			raw: true,
		});
		if (!user) {
			return next(new ErrorHandler(200, "Email doesn't exist", user));
		}
		user.full_name = user.first_name;
		if (user.last_name) {
			user.full_name = user.full_name + " " + user.last_name;
		}
		let valid = await bcrypt.compareSync(request.password, user.password);
		if (valid) {
			let userData = {
				user_id: user.id,
				full_name: user.full_name,
				profile_image: user.profile_image ? user.profile_image : "",
			};
			// return res.json({ success: false, message: 'Invalid credentails!', userData, user, name: user.full_name });
			let token = await Auth.authorize(userData);
			res.json({
				success: true,
				message: "Authentication successful!",
				data: { userData: userData },
				token,
			});
		} else {
			res.json({
				success: false,
				message: "Invalid credentails!",
				data: {},
			});
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Refresh token
 *
 * @param {*} req
 * @param {*} res
 */
const refresh_token = async (req, res, next) => {
	let token = req.body.token;
	let userData = req.body.userData;
	if (token && userData) {
		try {
			let user = await Users.findOne({
				where: {
					id: userData.user_id,
					is_deleted: false,
					role: "admin",
				},
			});
			if (!user) {
				return res.status(401).json({
					success: false,
					message: "Invalid user details",
					status: "logged-out",
				});
			}

			let response = await Auth.refreshToken(token, userData);
			return res.json({
				success: true,
				message: "Authentication successful!",
				token: response.token,
			});
		} catch (error) {
			return next(new ErrorHandler(200, config.common_err_msg, error));
		}
	} else {
		res.status(400).json({
			success: false,
			message: "Refresh token failed! Data missing",
		});
	}
};

/**
 * Validate admin credentials
 *
 * @param {*} req
 * @param {*} res
 */
const front_login = async (req, res, next) => {
	const request = req.body;
	if (!request.email || !request.password) {
		next(
			new ErrorHandler(400, "Missing required email and password fields")
		);
	}
	request.password = request.password.trim();
	request.email = request.email.trim();
	try {
		let user = await Users.findOne({
			attributes: [
				"id",
				"first_name",
				"last_name",
				"email",
				"password",
				"mobile",
				"profile_image",
				"is_deleted",
				[
					sequelize.fn(
						"CONCAT",
						sequelize.col("first_name"),
						" ",
						sequelize.col("last_name")
					),
					"full_name",
				],
			],
			where: { email: request.email, is_deleted: false, role: "user" },
			/* include: {
				model: UserPaidPlan,
				on: {
					col1: where(col("user_paid_plans.user_id"), "=", col("users.id")),
					col2: where(col("user_paid_plans.end_date"), "<=", currentDateTime),
					col3: where(col("user_paid_plans.is_active"), "=", true)
				},
			}, */
			// logging: console.log,
			// raw: true,
		});
		if (!user) {
			return next(new ErrorHandler(200, "Email doesn't exist", user));
		}
		user.full_name = user.first_name;
		let valid = await bcrypt.compareSync(request.password, user.password);
		if (valid) {
			const userData = {
				user_id: user.id,
				full_name: user.full_name,
				email: user.email,
				profile_image: user.profile_image ? user.profile_image : "",
				mobile: user.mobile,
			};
			const token = await Auth.authorize(userData, "30d");
			delete userData.email;
			delete userData.mobile;
			delete userData.profile_image;
			// return res.json({ success: false, message: 'Invalid credentails!', userData, token });
			res.json({
				success: true,
				message: "Authentication successful!",
				data: { userData: userData },
				token,
			});
		} else {
			res.json({
				success: false,
				message: "Invalid credentails!",
				data: {},
			});
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Refresh token
 *
 * @param {*} req
 * @param {*} res
 */
const front_refresh_token = async (req, res, next) => {
	let token = req.access_token;
	let userData = req.body.userData;
	if (token && userData) {
		try {
			let user = await Users.findOne({
				where: {
					id: userData.user_id,
					is_deleted: false,
					role: "user",
				},
			});
			if (!user) {
				return res.status(401).json({
					success: false,
					message: "Invalid user details",
					status: "logged-out",
				});
			}
			user.full_name = (user.first_name + " " + user.last_name).trim();
			let updatedUserData = {
				user_id: user.id,
				full_name: user.full_name,
				profile_image: user.profile_image ? user.profile_image : "",
				mobile: user.mobile,
			};
			let response = await Auth.refreshToken(
				token,
				updatedUserData,
				"30d"
			);
			// return res.json({ success: false, message: 'Invalid credentails!', updatedUserData, response });
			return res.json({
				success: true,
				message: "Authentication successful!",
				data: { userData: updatedUserData },
				token: response.token,
			});
		} catch (error) {
			console.log("catch");
			return next(new ErrorHandler(200, config.common_err_msg, error));
		}
	} else {
		console.log("Refresh token failed");
		res.status(400).json({
			success: false,
			message: "Refresh token failed! Data missing",
		});
	}
};

module.exports = {
	login,
	refresh_token,
	front_login,
	front_refresh_token,
};
