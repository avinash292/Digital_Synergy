"use strict";

let jwt = require("jsonwebtoken");
const config = require("../config");

const checkToken = (req, res, next) => {
	// console.log('Request URL:', req.originalUrl)
	const permittedUrls = [
		"/login",
		"/set_password",
		"/front/signup",
		"/front/sendOtp",
		"/front/login",
		"/front/forgot_password",
		"/reset_password",
	];
	const secureUrls = [
		"/front/refresh_token",
		"/front/cart",
		"/front/cart/count",
		"/front/checkout",
		"/front/orders",
		"/front/profile",
		"/front/profile/update_password",
	];
	let splitUrl = req.originalUrl.split("/");
	req.header_sub_domain =
		req.headers["x-sub-domain"] !== undefined
			? req.headers["x-sub-domain"]
			: "";

	if (
		permittedUrls.indexOf(req.originalUrl) > -1 ||
		req.method === "OPTIONS"
	) {
		next();
	} else if (
		splitUrl[1] !== undefined &&
		splitUrl[1] === "front" &&
		!secureUrls.includes(req.originalUrl) &&
		!req.originalUrl.includes("/front/orders/")
	) {
		next();
	} else {
		let token =
			req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
		if (token) {
			if (token.startsWith("Bearer ")) {
				token = token.slice(7, token.length); // Remove Bearer from string
			}
			jwt.verify(token, config.secret, (err, decoded) => {
				if (err && req.originalUrl === "/token") {
					next();
				} else if (err && req.originalUrl !== "/token") {
					return res.status(401).json({
						success: false,
						message: "Invalid token",
						status: "logged-out",
					});
				} else {
					// console.log(decoded);
					req.access_token = token;
					req.user_id = decoded.user_id;
					// req.role_id = decoded.role_id;
					req.email = decoded.email;
					next();
				}
			});
		} else {
			console.log("Access denied. No token provided.");
			return res.status(401).json({
				success: false,
				message: "Access denied. No token provided.",
			});
		}
	}
};

const authorize = async (userData, tokenTime) => {
	tokenTime = tokenTime || "6h";
	let token = await jwt.sign(
		userData,
		config.secret,
		{ expiresIn: tokenTime } // expires in 1 hour ( 180000 )
	);
	return token;
};

const refreshToken = async (token, userData, tokenTime) => {
	if (token.startsWith("Bearer ")) {
		token = token.slice(7, token.length); // Remove Bearer from string
	}
	return jwt.verify(token, config.secret, async (err, decoded) => {
		if (err) {
			return { status: "error", message: "expired-token" };
		} else {
			if (decoded.user_id == userData.user_id) {
				let newToken = await authorize(userData, tokenTime);
				return { status: "success", token: newToken };
			} else {
				return json_encode({
					status: "error",
					message: "mismatch-token",
				});
			}
		}
	});
};

module.exports = {
	checkToken,
	authorize,
	refreshToken,
};
