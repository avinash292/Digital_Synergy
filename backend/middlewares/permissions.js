'use strict';

const Users =  require('../models/userModel');
const config = require('../config');
const { ErrorHandler } = require('../helpers/errorhandler');

const checkPermissions = async (req, res, next) => {
	
	const permittedUrls = [ '/login', '/set_password', '/forgot_password', '/test_call' ];
	const semiPermittedUrls = ['/employee_profile', '/employee_profile/password', '/employee_profile/image', '/refresh_token', '/check_unique_email', '/check_unique_role', '/check_if_config_exists', '/check_unique_tracker_id', '/check_resource_assignment', '/get_urgency_levels', '/check_tracker_assignments', '/token'];

	if (req.method !== 'OPTIONS') {
		// console.log('Request URL : ', req.originalUrl);
		// console.log('semiPermittedUrls.indexOf(req.originalUrl) : ', semiPermittedUrls.indexOf(req.originalUrl));
	}

	if (permittedUrls.indexOf(req.originalUrl) > -1  || req.method === 'OPTIONS') {
		req.decoded = null;
		next();
	} else if (semiPermittedUrls.indexOf(req.originalUrl) > -1) {
		let ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress;
		req.ip_address = ip_address;
		if (!req.decoded && req.originalUrl === '/token'){
			next();
		} else {
			req.user_id = req.decoded.user_id;
			req.role_id = req.decoded.role_id;
			req.full_name = req.decoded.full_name;
			req.decoded = null;
			next();
		}
	} else {
		let userId = req.decoded.user_id;
		if (!userId) { return res.status(401).json({ success: false,  message: 'Access denied. Malformed token.' }); }
		req.decoded = null;
		if (userId) {

			try {
				let result = await Users.findById(userId).
										select('first_name last_name role_id').
										where('is_active', true).
										where('is_deleted', false).
										populate({ path: 'role_id', match: { is_deleted: false }, populate: { path: 'permission_ids' }}).
										exec();
				if (result && result.role_id && result.role_id.permission_ids) {
					// console.log(result);
					let havePermission = false;
					result.role_id.permission_ids.forEach(value => {
						if (value.link && req.originalUrl.indexOf(value.link) > -1) {
							havePermission = true;
						}
					});

					if (havePermission) { // Allow super admin for full access
					// if (havePermission || result.role_id.is_super_admin === true) { // Allow super admin for full access
						let ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress;
						req.ip_address = ip_address;
						req.user_id = userId;
						req.role_id = result.role_id._id;
						req.is_super_admin = result.role_id.is_super_admin;
						req.full_name = result.first_name + " " + result.last_name;
						next();
					} else {
						return next(new ErrorHandler(403, 'Access denied.'));
					}
				} else {
					return next(new ErrorHandler(403, 'Access denied.'));
				}

			} catch (error) {
				return next(new ErrorHandler(200, config.common_err_msg, error));	
			}
		} else {
			return next(new ErrorHandler(401, 'Access denied. Malformed token.'));
		}
	}
};

module.exports = {
	checkPermissions : checkPermissions,
}
