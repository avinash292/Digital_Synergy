'user strict';

const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
// const { Op, fn, col, where } = require('sequelize');
const moment = require('moment');
const config = require('../config');
const { ErrorHandler } = require('../helpers/errorhandler');
const User = require('../models/userModel');
const Auth = require('../middlewares/auth');
const Mailer = require('../helpers/mailer');
const ConnectUser = require('../models/connectUserModel');
const saltRounds = 10;

/**
 * Sign Up user
 *
 * @param {*} req
 * @param {*} res
 */
const signup = async (req, res, next) => {
	const request = req.body;
	if ( !request.firstName || !request.email || (!request.password && request.source === 'email') ) {
		return next(new ErrorHandler(400, 'Missing required first name, email or password field'));
	} else if (request.password !== request.password_confirmation && request.source === 'email') {
		return next(new ErrorHandler(400, "Password and confirm password don't match"));
	}
	request.password = request.password ? request.password.trim() : '';
	request.email = request.email.trim();
	request.firstName = request.firstName.trim();

	try {
		let user = await check_if_email_exist(request.email, false, next, true);
		if (user && user.id && request.source === 'email') {
			return res.json({ success: false, message: 'Email already exists!' });
		}
		if (!user || !user.id) {
			user = {
				first_name 	: request.firstName,
				last_name  	: request.lastName,
				email      	: request.email,
				mobile			: request.mobile,
				source			: request.source,
			};
			if (request.source === 'email') { user.password = await bcrypt.hashSync(request.password, saltRounds); }
			// return res.json({ success: false, message: 'User created successfully!', user });
			user = await User.create(user);
			console.log(user);
			sendRegistrationEmail({ full_name: (user.first_name + ' ' + user.last_name).trim(), email: user.email });
		}
		const userData = {
			user_id				: user.id,
			full_name			: (user.first_name + ' ' + user.last_name).trim(),
			email					: user.email,
			profile_image	: (user.profile_image) ? user.profile_image : '',
			mobile				: user.mobile,
		};
		const token = await Auth.authorize(userData, '30d');
		delete userData.email;
		res.json({ success: true, message: 'Account created successfully!', data: { userData: userData }, token });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Check if email exists
 *
 * @param {*} email
 * @param {*} userId
 * @param {*} next
 */
const check_if_email_exist = async (email, userId, next, returnResult) => {
	try {
		let where = { email };
		if (userId) {
			where = { ...where, id: { [Op.not]: userId } }
		}
		const result = await User.findOne({ where }); // , logging: console.log
		if (returnResult) { return result; }
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Send registration email to user
 *
 * @param {Object} mailData
 */
const sendRegistrationEmail = async (mailData) => {
	try {
		const mailer = new Mailer();

		let mailText = `Hello ` + mailData.full_name  + `\n\n Welcome to ${config.app_name}`;
		mailText += "\n\n\nThanks and Regards\n" + config.smtp.fromAlias;

		let mailHtml = `<b>Hello ` + mailData.full_name  + `</b><br/><br/>
										Welcome to ${config.app_name} <br/>
										<br/><br/><br/><b>Thanks and Regards<br/>` + config.smtp.fromAlias + `</b>`;

		const mailDetails = {
			to: mailData.email,
			// to: 'kanishk@ourdesignz.in',
			subject: 'Welcome to ' + config.app_name, // Subject line
			text: mailText, // plain text body
			html: mailHtml, // html body
		};
		mailer.sendMail(mailDetails);
	} catch (error) {
		console.log("ERROR in sendRegistrationEmail : ", error);
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};


/**
 * Fetch user listing
 *
 * @param {*} req
 * @param {*} res
 */
const get_users = async (req, res, next) => {
	let request = {};
	request.orderBy    = (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'first_name';
	request.order   	= (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC';
	request.pageSize 	= (req.body.pageSize !== undefined) ? req.body.pageSize : 10;
	request.pageOffset 	= (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0;
	request.searchText 	= (req.body.searchText !== undefined) ? req.body.searchText : '';

	const searchColumns = ['first_name', 'last_name', 'email', 'mobile'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	let order = [request.orderBy, request.order];
	/* if (request.orderBy === "user_paid_plans") {
		order = ['user_paid_plans', request.orderBy, request.order];
	} */

	try {
		// const currentDateTime = moment().toDate();
		let result = await User.findAndCountAll({
			attributes: ['id', 'first_name', 'last_name', 'email', 'mobile', 'profile_image', 'is_deleted', 'createdAt', 'updatedAt','profileVisibility'],
			where: {
				...likeSearch,
				role: { [Op.not]: 'admin' },
				is_deleted: false
			},
			/* include: {
				model: UserPaidPlans,
				on: {
					col1: where(col("user_paid_plans.user_id"), "=", col("users.id")),
					col2: where(col("user_paid_plans.end_date"), ">=", currentDateTime),
					col3: where(col("user_paid_plans.is_active"), "=", true)
				},
			}, */
			order: [order],
			offset: request.pageOffset,
			limit: request.pageSize,
		});
		return res.json({ success: true, message: 'Fetched users successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update user
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const save_user = async (req, res, next) => {
	const uploadDir = 'assets/profile_images/';
	let form = new IncomingForm();

	form.uploadDir = uploadDir;		//set upload directory
	form.keepExtensions = true;		//keep file extension

	form.parse(req, async (err, fields, files) => {
		if (err) { return next(new ErrorHandler(500, config.common_err_msg, err)); }
		// const userId = req.user_id;
		let filePath = (files && files.file) ? files.file.path : null;
		let filename = (filePath) ? filePath.replace(uploadDir, '') : null;
		if (!fields.first_name || !fields.email) { delete_file(filePath); return next(new ErrorHandler(400, 'Missing required name or label fields')); }
		fields.first_name = fields.first_name.trim();
		fields.email = fields.email.trim();
		fields.profile_image = filename;

		// return res.json({ success: false, message: 'User created successfully!', fields });
		try {
			const userId = (fields.type == 'edit' && fields.id !== undefined) ? fields.id : false;
			let ifExist = await check_if_email_exist(fields.email, userId, next);
			if (ifExist) {
				return res.json({ success: false, message: 'Email already exists!' });
			}

			let user = {
				first_name	: fields.first_name,
				last_name	: fields.last_name,
				email		: fields.email,
				mobile		: fields.mobile,
			};
			if (fields.type == 'add') {
				user.password = await bcrypt.hashSync(fields.password, saltRounds);
				user.profile_image = fields.profile_image;
				const result = await User.create(user);
				return res.json({ success: true, message: 'User created successfully!', result });
			} else {
				const result = await User.update(user, { where: { id: fields.id } });
				return res.json({ success: true, message: 'User updated successfully!', result });
			}
		} catch (error) {
			delete_file(filePath);
			next(new ErrorHandler(200, config.common_err_msg, error));
		}
	});
	form.on('error', (err) => {
		return next(new ErrorHandler(500, config.common_err_msg, err));
	});
};

/**
 * send otp on sign up
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const send_otp = async (req, res, next) => {
		const userId = (req.body.type == 'edit' && req.body.id !== undefined) ? req.body.id : false;
		let ifExist = await check_if_email_exist(req.body.email, userId, next);
		if (ifExist) {
			return res.json({ success: false, message: 'Email already exists!' });
		}
		let otp = Math.floor(Math.random() * 100000000);
		try {
			const mailer = new Mailer();
			//const resetLink = config.site_url + 'reset-pasword/' + mailData.hash;

			let mailText = 'Otp for signup -'+otp;
			mailText += "\n\n\nThanks and Regards\n" + config.smtp.fromAlias;

			let mailHtml = "<b>Otp for signup -"+otp+"</b>";
			mailHtml += "<br/><br/><br/><b>Thanks and Regards<br/>" + config.smtp.fromAlias + "</b>";

			const mailDetails = {
				to: req.body.email,
				// to: 'kanishkgupta55@gmail.com',
				subject: 'OTP For Signup', // Subject line
				text: mailText, // plain text body
				html: mailHtml, // html body
			};
			mailer.sendMail(mailDetails);

			/*mailgun.messages().send(data, function (error, body) {
			  console.log(body);
			});*/
			return res.json({ success: true,otp: otp});
		} catch (error) {

			next(new ErrorHandler(200, config.common_err_msg, error));
		}
};

/**
 * Fetch user details
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_user_details = async (req, res, next) => {
	const userId = parseInt(req.params.id);
	try {
		let result = await User.findOne({
			attributes: ['id', 'first_name', 'last_name', 'email', 'mobile', 'profile_image', 'is_deleted', 'createdAt', 'updatedAt','profileVisibility'],
			where: { id: userId, is_deleted: false },
			/* include: {
				model: UserPaidPlans,
				on: {
					col1: where(col("user_paid_plans.user_id"), "=", col("users.id")),
					col2: where(col("user_paid_plans.end_date"), ">=", currentDateTime),
					col3: where(col("user_paid_plans.is_active"), "=", true)
				}
			}, */
			// raw: true
		}); // , logging: console.log
		const { id, first_name, last_name, email, mobile, profile_image, is_deleted, createdAt, updatedAt } = result;
		// let user_paid_plans = result.user_paid_plans.length > 0 ? result.user_paid_plans[0] : result.user_paid_plans;
		let userDetails = { id, first_name, last_name, email, mobile, profile_image, is_deleted, createdAt, updatedAt };
		return res.json({ success: true, message: 'Fetched user details successfully!', data: { user_details: userDetails } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};


/**
 * Add delete user
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const delete_users = async (req, res, next) => {
	/* const request = req.body;
	if (!request.deleteIds) { next(new ErrorHandler(400, 'Missing delete IDs')); }
	// return res.json({ success: true, message: 'Fetched user successfully!', request });

	try {
		const result = await User.destroy({ where: { id: { [Op.in]: request.deleteIds } } });
		return res.json({ success: true, message: 'User deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	} */
};

/**
 * Fetch admin profile
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_profile = async (req, res, next) => {
	try {
		const userId = req.user_id;
		let result = await User.findOne({
			attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'profile_image', 'mobile','profileVisibility'],
			where: { id: userId, is_deleted: false },
			raw: true,
		}); // , logging: console.log
		result.full_name = (result.first_name + ' ' + result.last_name).trim();
		return res.json({ success: true, message: 'Fetch user profile successfully!', data: { profile_details: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Update admin profile
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const update_profile = async (req, res, next) => {
	try {
		const request = req.body, userId = req.user_id;
		if (!request.first_name || !request.email) { return next(new ErrorHandler(400, 'Missing required fields!')); }
		// return res.json({ success: true, message: 'Fetch user profile successfully!', request });
		request.first_name = request.first_name.trim();
		request.last_name = (request.last_name) ? request.last_name.trim() : null;
		request.email = request.email.trim();
		let result = await User.update(request, { where: { id: userId } }); // , logging: console.log
		return res.json({ success: true, message: 'Updated profile successfully!' });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Update profile image
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const update_password = async (req, res, next) => {
	try {
		const request = req.body, userId = req.user_id;
		if (!request.password) { return next(new ErrorHandler(400, 'Missing required fields!')); }
		const passwordHash = await bcrypt.hashSync(request.password, saltRounds);
		// return res.json({ success: true, message: 'Fetch user profile successfully!', request, passwordHash });
		let result = await User.update({ password: passwordHash }, { where: { id: userId, role: 'admin' } }); // , logging: console.log
		return res.json({ success: true, message: 'Updated password successfully!' });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const delete_file = (filepath) => {
	if (fs.existsSync(filepath)) {
		fs.unlinkSync(filepath);
	}
};


/**
 * Fetch user profile
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get_user_profile = async (req, res, next) => {
	try {
		const userId = req.user_id;
		let result = await User.findOne({
			attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image', 'mobile','profileVisibility'],
			where: { id: userId, is_deleted: false },
			// logging: console.log
		});
		return res.json({ success: true, message: 'Fetch user profile successfully!', data: { profile_details: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};


/**
 * Update profile image
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const update_profile_image = async (req, res, next) => {
	const uploadDir = 'assets/profile_images/';
	let form = new IncomingForm();

	form.uploadDir = uploadDir;		//set upload directory
	form.keepExtensions = true;		//keep file extension

	form.parse(req, async (err, fields, files) => {
		if (err) { return next(new ErrorHandler(500, config.common_err_msg, err)); }
		const userId = req.user_id;
		// return res.json({ success: false, message: 'reached!', files, fields });
		let filePath = files.file.path;
		// if (!fields.id) { delete_file(filePath); return next(new ErrorHandler(400, 'Missing dialogue ID!')); }
		let filename = filePath.replace(uploadDir, '');

		try {
			if (fields.old_image_path && fs.existsSync(uploadDir + fields.old_image_path)) {
				delete_file(uploadDir + fields.old_image_path);
			}
			// return res.json({ success: false, message: 'asdasd!', files, fields, ifExist, uploadDir, filePath, dialogue });
			const result = await User.update({ profile_image: filename }, { where: { id: userId } });
			return res.json({ success: true, message: 'Uploaded profile image successfully!', data: { filename } });
		} catch (error) {
			next(new ErrorHandler(200, config.common_err_msg, error));
		}
	});
	form.on('error', (err) => {
		return next(new ErrorHandler(500, config.common_err_msg, err));
	});
};

/**
 * Update user profile
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const update_user_profile = async (req, res, next) => {
	try {
		const request = req.body, userId = req.user_id;
		if (!request.firstName) { return next(new ErrorHandler(400, 'Missing required fields!')); }
		const user = {
			first_name: request.firstName.trim(),
			last_name	: (request.lastName) ? request.lastName.trim() : null,
			mobile		: (request.mobile) ? request.mobile.trim() : null,
			profileVisibility		: (request.profileVisibility) ? request.profileVisibility.trim() : 'public',

		};
		// return res.json({ success: false, message: 'Fetch user profile successfully!', request, userId, user });
		let result = await User.update(user, { where: { id: userId } }); // , logging: console.log
		return res.json({ success: true, message: 'Updated profile successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Update user profile password
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const update_user_password = async (req, res, next) => {
	try {
		const request = req.body, userId = req.user_id;
		if (!request.password) { return next(new ErrorHandler(400, 'Missing required fields!')); }
		const passwordHash = await bcrypt.hashSync(request.password, saltRounds);
		await User.update({ password: passwordHash }, { where: { id: userId, role: 'user' } }); // , logging: console.log
		return res.json({ success: true, message: 'Updated password successfully!' });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};


/**
 * Generate a random code of specified length
 *
 * @param {Number} length
 */
const generate_unique_code = async (length) => {
	length = length || 15;
	let uniqueCode = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + moment().unix();
	const charactersLength = characters.length;
	for ( let i = 0; i < length; i++ ) {
		uniqueCode += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return uniqueCode;
}

/**
 * To send reset password link
 *
 * @param {*} req
 * @param {*} res
 */
const forgot_password = async (req, res, next) => {
	const email = req.body.email;
	if (!email) { return next(new ErrorHandler(400, 'Missing email in request!')); }
	try {
		const user = await User.findOne({ attributes: ['id', 'first_name', 'last_name', 'email'], where: { email, is_deleted: false, role: 'user' } });
		if (!user) {
			return res.status(200).json({ success: false, message: "Email doesn't exist", data: { description: 'Sign Up to create account'} });
		}
		const hash = await generate_unique_code(40);
		const currentDatetime = moment().format("YYYY-MM-DD HH:mm:ss");
		const userUpdate = {
			forgot_pass_hash: hash,
			forgot_pass_date: currentDatetime,
		};
		const mailData = {
			email: user.email,
			full_name: (user.first_name + ' ' + user.last_name).trim(),
			hash,
			valid_till: moment(currentDatetime).add(config.reset_password_validity, 'days').format("YYYY-MM-DD HH:mm:ss")
		};
		// return res.json({ success: false, message: 'asdasdsadsadasdsadsd', user, hash, userUpdate, mailData });
		let result = await User.update(userUpdate, { where: { id: user.id } })
		await sendResetPasswordEmail(mailData, next);
		res.json({ success: true, message: 'Reset password link is sent to your registered email' });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Send reset password mail to user
 *
 * @param {Object} mailData
 */
const sendResetPasswordEmail = async (mailData) => {
	try {
		const mailer = new Mailer();
		const resetLink = config.site_url + 'reset-password/' + mailData.hash;

		let mailText = "Hello " + mailData.full_name  + "\n\Below here is your reset password link valid till " + mailData.valid_till + " : \n" + resetLink;
		mailText += "\n\n\nThanks and Regards\n" + config.smtp.fromAlias;

		let mailHtml = "<b>Hello " + mailData.full_name  + "</b><br/><br/>Below here is your reset password link valid till " + mailData.valid_till + ` : <br/>
			<a href="` + resetLink + `" target="_blank" >Click here</a> or go to this link <b>` + resetLink + "</b>";
		mailHtml += "<br/><br/><br/><b>Thanks and Regards<br/>" + config.smtp.fromAlias + "</b>";

		const mailDetails = {
			to: mailData.email,
			// to: 'kanishkgupta55@gmail.com',
			subject: 'Reset password', // Subject line
			text: mailText, // plain text body
			html: mailHtml, // html body
		};
		mailer.sendMail(mailDetails);
	} catch (error) {
		console.log("ERROR in sendResetPasswordEmail : ", error);
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Reset USER password
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const reset_password = async (req, res, next) => {
	try {
		const request = req.body;
		if (!request.email || !request.password || !request.hash) { return next(new ErrorHandler(400, config.missing_fields)); }
		if (request.password !== request.password_confirmation) {
			return next(new ErrorHandler(400, "Password and confirm password don't match"));
		}
		request.email = request.email.trim();
		request.password = request.password.trim();
		request.hash = request.hash.trim();

		let user = await User.findOne({
			where: {
				email: request.email,
				is_deleted: false,
				forgot_pass_hash: request.hash,
				forgot_pass_date: {[Op.gte]: moment().subtract(config.reset_password_validity, 'days')},
				role: 'user',
			}
		});
		if (!user) {
			return res.status(200).json({ success: false, message: "Reset email token is expired!"});
		}
		// return res.json({ success: false, message: 'Password reset successfully.', request });
		const passwordHash = await bcrypt.hashSync(request.password, saltRounds);
		const updateUser = {
			password: passwordHash,
			forgot_pass_hash: null,
			forgot_pass_date: null,
		};
		let result = await User.update(updateUser, { where: { id: user.id } });
		res.json({ success: true, message: 'Password reset successfully.' });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * To check password hash
 *
 * @param {*} req
 * @param {*} res
 */
const check_password_hash = async (req, res, next) => {
	const hash = req.params.hash;
	if (!hash) { return next(new ErrorHandler(400, 'Missing hash in request!')); }
	try {
		const user = await User.findOne({
			attributes: ['email'], // 'id', 'first_name', 'last_name',
			where: {
				forgot_pass_hash: hash,
				is_deleted: false,
				role: 'user',
				forgot_pass_date: {[Op.gte]: moment().subtract(config.reset_password_validity, 'days')}
			}
		});
		// return res.json({ success: false, message: 'This link is expired', hash, user });
		if (!user) {
			return res.status(200).json({ success: false, message: "This link is expired", data: { description: 'This link is expired'} });
		}
		res.json({ success: true, message: 'Fetch valid hash related account', data: { user } });

	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};



/**
 * connect New User
 *
 * @param {*} req
 * @param {*} res
 */

const connectNewUser = async (req, res, next) => {
			const request = req.body;
			const userId = request.loginUser;
			try {
					if ( !request.loginUser || !request.id ) {
						return next(new ErrorHandler(400, 'Something wrong'));
					}
 					 let user = await getUserProfile(userId,next);
					 let fullName = user.first_name +" "+ user.last_name
					connectRequestData = {
						login_user_id 	: request.loginUser,
						to_connect_user_id  	: request.id,
						login_user_firstName  	: user.first_name,
						login_user_LastName  	: user.last_name,
						connect_request_status      	: "request",
					};
					user = await ConnectUser.create(connectRequestData);
					//sendRegistrationEmail({ full_name: (user.first_name + ' ' + user.last_name).trim(), email: user.email });
			} catch (error) {
					next(new ErrorHandler(200, config.common_err_msg, error));
			}
	return res.json({ success: true, message: 'User connect request sent successfully!', data: { user_details: connectRequestData } });
};


/**
 * disconnect User
 *
 * @param {*} req
 * @param {*} res
 */

const disconnectUser = async (req, res, next) => {
		const request = req.body;
		const userId = parseInt(request.loginUser);

			try {
					if ( !request.loginUser || !request.id ) {
						return next(new ErrorHandler(400, 'Something wrong'));
					}
					 let loginuserProfile = await getUserProfile(userId,next);
					 let user = await getUserProfile(request.id,next);
						if (loginuserProfile.connects == "NULL" || loginuserProfile.connects === null || loginuserProfile.connects === undefined || loginuserProfile.connects.length === 0) {} else {
							let loginuserProfileConnects = loginuserProfile.connects;
							await updateDisconnectInDatabase(userId,loginuserProfileConnects,request.id);
						}
						if (user.connects == "NULL" || user.connects === null || user.connects === undefined || user.connects.length === 0) {} else {
							let connects = user.connects;
							await updateDisconnectInDatabase(request.id,connects,userId);
						}
						//sendRegistrationEmail({ full_name: (user.first_name + ' ' + user.last_name).trim(), email: user.email });
			} catch (error) {
					next(new ErrorHandler(200, config.common_err_msg, error));
			}
	return res.json({ success: true, message: 'Connection has been removed successfully!' });
};

/**
 * connect Approved
 *
 * @param {*} req
 * @param {*} res
 */

const connectApproved = async (req, res, next) => {
			const request = req.body;
			const userId = request.loginUser;
			try {
					if ( !request.loginUser || !request.id ) {
						return next(new ErrorHandler(400, 'Something wrong'));
					}
 					 let loginuserProfile = await getUserProfile(userId,next);
					 	if (loginuserProfile.connects == "NULL" || loginuserProfile.connects === null || loginuserProfile.connects === undefined || loginuserProfile.connects.length === 0) {
						  let loginuserProfileConnects = "start";
							await updateConnectInDatabase(userId,loginuserProfileConnects,request.connectId);
						} else {
							let loginuserProfileConnects = loginuserProfile.connects;
							await updateConnectInDatabase(userId,loginuserProfileConnects,request.connectId);
						}
						let user = await getUserProfile(request.connectId,next);
 					 	if (user.connects == "NULL" || user.connects === null || user.connects === undefined || user.connects.length === 0) {
 						  let connects = "start";
 							await updateConnectInDatabase(request.connectId,connects,userId);
 						} else {
 							let connects = user.connects;
 							await updateConnectInDatabase(request.connectId,connects,userId);
 						}
						updateConnectRequestData = {
							connect_request_status   : request.status,
						};

						await ConnectUser.update(updateConnectRequestData, { where: { id: request.id } });
						//sendRegistrationEmail({ full_name: (user.first_name + ' ' + user.last_name).trim(), email: user.email });
			} catch (error) {
					next(new ErrorHandler(200, config.common_err_msg, error));
			}
	return res.json({ success: true, message: 'Connect request Approved!', data: { user_details: request.id } });
};

/**
 * connect Denied
 *
 * @param {*} req
 * @param {*} res
 */

const connectDenied = async (req, res, next) => {
			const request = req.body;
			const userId = request.loginUser;
			try {
					if ( !request.loginUser || !request.id ) {
						return next(new ErrorHandler(400, 'Something wrong'));
					}
 					 	updateConnectRequestData = {
							connect_request_status   : request.status,
						};
						await ConnectUser.update(updateConnectRequestData, { where: { id: request.id } });
						//sendRegistrationEmail({ full_name: (user.first_name + ' ' + user.last_name).trim(), email: user.email });
			} catch (error) {
					next(new ErrorHandler(200, config.common_err_msg, error));
			}
	return res.json({ success: true, message: 'Connect request denied!', data: { user_details: request.id } });
};


/**
 * Fetch connect Request
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const connectRequest = async (req, res, next) => {
	const request = req.body;
	const userId = request.loginUser;
	try {

		let result = await ConnectUser.findAll({
			attributes: ['id', 'login_user_id', 'to_connect_user_id', 'login_user_firstName','login_user_LastName', 'connect_request_status'],
			where: { to_connect_user_id: userId, connect_request_status: "request" },
			raw: true,
		}); // , logging: console.log


	 	return res.json({ success: true, message: 'Fetch user profile successfully!', data: { userDetail: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch connect Request
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const userConnectList = async (req, res, next) => {
	const request = req.body;
	const userId = request.loginUser;
	try {

		let result = await User.findAll({
			attributes: ['id', 'connects'],
			where: { id: userId },
			raw: true,
		}); // , logging: console.log
		processConnections(result)
		  .then(allConnections => {
		    //console.log('All connections:', allConnections);
		   return res.json({ success: true, message: 'Fetch user Connect List successfully!', data: { data: allConnections } });
		  })
		  .catch(error => {
					next(new ErrorHandler(200, config.common_err_msg, error));
			});
		} catch (error) {
			next(new ErrorHandler(200, config.common_err_msg, error));
		}
};


const processConnections = async (result) => {
  const allConnections = [];
	for (const user of result) {
    try {
			if (user.connects == "NULL" || user.connects === null || user.connects === undefined || user.connects.length === 0) {}else {
				const connects = JSON.parse(user.connects);
				for (const connect of connects) {
					const userProfile = await getUserProfile(connect.connectId); // Assuming getUserProfile is an async function
					const fullName = `${userProfile.first_name},${userProfile.last_name},${userProfile.id}`;
					allConnections.push(fullName);
				}
			}
    } catch (error) {
      console.error('Error processing connections:', error);
      // Handle errors as needed (e.g., logging, error recovery)
    }
  }

  return allConnections;
};
/***
get all Users
***/
const getAllUsers = async (req, res, next) => {
	const request = req.body;
	const userId = request.loginUser;
	try {
		let user = await getUserProfile(userId,next);
		let loginuserProfileConnects = user.connects;
		let connectIds = [];
  	let toConnectUserIds = [];
		let connectUserIds = [];

		if (loginuserProfileConnects) {
			let connects = JSON.parse(loginuserProfileConnects);
			    connectIds = connects.map(connection => connection.connectId);
    }

		let connectUser = await ConnectUser.findAll({
			attributes: ['login_user_id','to_connect_user_id'],
			where: {
				// [Op.or]: [ { login_user_id: userId },{ to_connect_user_id: userId } ],
				to_connect_user_id: userId,
      connect_request_status: "request"
    },
			raw: true,
		});
		if (connectUser && Array.isArray(connectUser)) {
			 connectUserIds = connectUser.map(connection => parseInt(connection.to_connect_user_id));
			 loginUserIds = connectUser.map(connection => parseInt(connection.login_user_id));
			 toConnectUserIds = connectUserIds.concat(loginUserIds);
		}
		const userIdArray = [userId];
	  const mergedUserId = userIdArray.concat(connectIds, toConnectUserIds);
	  const excludedIds = [...new Set(mergedUserId)];
		let  result = await User.findAndCountAll({
        attributes: ['id', 'first_name', 'last_name', 'email', 'mobile', 'profile_image', 'is_deleted', 'createdAt', 'updatedAt','profileVisibility'],
        where: {
            role: { [Op.not]: 'admin'},
            profileVisibility: 'public',
            id: { [Op.notIn]: excludedIds}
        },
        raw: true
    });
		return res.json({ success: true, message: 'Fetch user profile successfully!', data: { data: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const requestedUser = async (req, res, next) => {
	const request = req.body;
	const userId = request.loginUser;
	try {
		let connectUser = await ConnectUser.findAndCountAll({
			attributes: ['to_connect_user_id'],
				where: {
					login_user_id: userId,
					//to_connect_user_id: request.id,
	      	connect_request_status: "request"
	    },
			raw: true
		});
		 return res.json({ success: true, message: 'requestedUser', data: { data: connectUser } });
	 } catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};


/**
 * get user profile
 */

const getUserProfile = async (userId,next) => {
	try {
		//const userId = req.user_id;
		let result = await User.findOne({
			attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image', 'connects', 'mobile','profileVisibility'],
			where: { id: userId, is_deleted: false },
			// logging: console.log
		});
		return result;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};
	/**
	 * update Connect In Database
	 */
	const updateConnectInDatabase = async (loginUser, connectsData,connectId) => {
		if(connectsData == "start"){
				let connects = [];
				connects.push({ connectId: parseInt(connectId) });
				updateConnectList = {
				 	connects   : JSON.stringify(connects),
				 };
				await User.update(updateConnectList, { where: { id: loginUser } });
		}else {
				let connects = JSON.parse(connectsData);
				connects.push({ connectId: parseInt(connectId) });
				updateConnectList = {
				 	connects   : JSON.stringify(connects),
				 };
				await User.update(updateConnectList, { where: { id: loginUser } });
		}
	};


	/**
	 * Update disconnect In Database
	 */
	const updateDisconnectInDatabase = async (loginUser, connectsData,connectId) => {

			let connects = JSON.parse(connectsData);
			let updatedConnects = connects.filter(connection => connection.connectId !== parseInt(connectId));
			updateConnectList = {
				connects   : JSON.stringify(updatedConnects),
			 };
			await User.update(updateConnectList, { where: { id: parseInt(loginUser) } });
};

/**
 * update Connect Staus
 */
const updateConnectStaus = async (userId,next) => {
	try {
		//const userId = req.user_id;
		let result = await User.findOne({
			attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image', 'connects', 'mobile'],
			where: { id: userId, is_deleted: false },
			// logging: console.log
		});
		return result;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};



module.exports = {	// add_user,
	signup,
	get_users,
	save_user,
	delete_users,
	get_profile,
	update_profile,
	update_password,
	update_profile_image,
	send_otp,
	get_user_details,
	get_user_profile,
	update_user_profile,
	update_user_password,
	forgot_password,
	reset_password,
	check_password_hash,
	connectNewUser,
	connectApproved,
	connectDenied,
	connectRequest,
	getAllUsers,
	userConnectList,
	disconnectUser,
	requestedUser,
};
