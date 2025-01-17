'use strict';

const Users = require("../models/userModel");

const check = async (req, res, next) => {
	const permittedUrls = ['/login', '/set_password', '/app/languages', '/app/signup','/app/sendOtp', '/app/login', '/app/forgot_password', '/reset_password', '/test_call']; //  '/token'
	
	if (permittedUrls.includes(req.originalUrl) || req.method === 'OPTIONS') {
		next();
	} else if (req.originalUrl.includes('/app/')) {
		if (!req.headers.device_id) {
			return res.status(401).json({ success: false, message: 'Device ID is missing' });
		}
		const result = await Users.findOne({
			attributes: ['id', 'first_name', 'email', 'device_id'],
			where: { id: req.user_id, device_id: req.headers.device_id, is_deleted: false }
		});		
		if (!result) {
			return res.status(403).json({ success: false, message: 'Muitiple devices detected', status: 'mutiple-login' });
		}
		next();
	} else {
		next();
	}
};

module.exports = { check };