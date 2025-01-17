'user strict';

const config = require('../config');
const { Op } = require('sequelize');
const moment = require('moment');
const AccessCodes = require('../models/accessCodeModel');
const Users = require('../models/userModel');
const Plans = require('../models/planModel');
const { ErrorHandler } = require('../helpers/errorhandler');
const Mailer = require('../helpers/mailer');

/**
 * Fetch language listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_access_codes = async (req, res, next) => {
	let request = {
		orderBy		: (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'createdAt',
		order   	: (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC',
		pageSize 	: (req.body.pageSize !== undefined) ? req.body.pageSize : 10,
		pageOffset 	: (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0,
		searchText 	: (req.body.searchText !== undefined) ? req.body.searchText : '',
	};

	const searchColumns = ['id', 'code', 'valid_till', 'createdAt'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	let order = [request.orderBy, request.order];
	if (request.orderBy === "user_id") { 
		order = ['user', 'first_name', request.order];
	} else if (request.orderBy === "plan_id") {
		order = ['plan', 'name', request.order];
	} else if (request.orderBy === "email") {
		order = ['user', 'email', request.order];
	}
	try {
		let result = await AccessCodes.findAndCountAll({
			where: { ...likeSearch },
			include: [
				{
					model: Users,
					required: true,
					attributes: ['id', 'first_name', 'last_name', 'email'],
					where: { is_deleted: false }
				},
				{
					model: Plans,
					required: true,
					attributes: ['id', 'name', 'price', 'plan_type_id'],
					where: { is_active: true, is_deleted: false }
				}
			],
			order: [order],
			offset: request.pageOffset,
			limit: request.pageSize,
			// logging: console.log
		});
		return res.json({ success: true, message: 'Fetched access codes successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Generate a random code of specified length and check in db for its uniqueness
 * 
 * @param {Integer} length 
 */
const generate_unique_code = async (length) => {
	length = length || 15;
	let uniqueCode = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		uniqueCode += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	let ifExist = await check_if_code_exist(uniqueCode);
	if (ifExist) { generate_unique_code(length); }
	return uniqueCode;
}

/**
 * Generate access code
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const generate_access_code = async (req, res, next) => {
	const request = req.body;
	// return res.json({ success: false, message: 'Fetched language successfully!', request });
	if (!request.selectedUser || !request.selectedPlan) { return next(new ErrorHandler(400, config.missing_fields)); }
	try {
		const code = await generate_unique_code(15);
		// let currentDate = moment().format('YYYY-MM-DD 00:00:00');
		// const valid_till = moment(currentDate).add(14, 'days').format("YYYY-MM-DD HH:mm:ss");
		const valid_till = moment().add(14, 'days').startOf('day').toDate();
		// console.log("valid_till : ",valid_till);
		let accessCode = {
			code,
			user_id: request.selectedUser.id,
			plan_id: request.selectedPlan.id,
			valid_till,
		};
		const result = await AccessCodes.create(accessCode);

		const mailData = {
			email: request.selectedUser.email,
			full_name: request.selectedUser.first_name + ' ' + request.selectedUser.last_name,
			plan_name: request.selectedPlan.name,
			access_code: code,
			valid_till: moment(valid_till).format('MMMM Do YYYY'),
		};
		sendAccessCodeEmail(mailData);
		return res.json({ success: true, message: 'Generated a unique access code!', result });		
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const check_if_code_exist = async (code, langId, next) => {
	try {
		let result = await AccessCodes.findOne({ where: { code } }); // , logging: console.log
		// console.log(result);
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

const get_access_code_details = async (req, res, next) => {
	const videoId = parseInt(req.params.id);	
	try {
		let result = await AccessCodes.findOne({ where: { id: videoId, is_deleted: false } }); // , logging: console.log
		return res.json({ success: true, message: 'Video updated successfully!', data: { video_details: result, videoId } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

/**
 * Activate / deactivate code status
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const toggle_code_status = async (req, res, next) => {
	const request = req.body;
	if (!request.id || request.status == undefined || request.status == null) {
		next(new ErrorHandler(400, 'Missing required fields!'));
	}
	// return res.json({ success: false, message: 'Fetched Video successfully!', request });

	try {
		const result = await AccessCodes.update({ is_active: request.status }, { where: { id: request.id } });
		return res.json({ success: true, message: 'Updated code status successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const sendAccessCodeEmail = async (mailData) => {
	try {
		const mailer = new Mailer();
		let mailText = "Hello " + mailData.full_name  + "\n\nBelow here is access code for " + mailData.plan_name + " plan valid till " + mailData.valid_till + " : \n" + mailData.access_code;
		mailText += "\n\n\nThanks and Regards\n" + config.smtp.fromAlias;

		let mailHtml = "<b>Hello " + mailData.full_name  + "</b><br/><br/>Below here is access code for " + mailData.plan_name + " plan valid till " + mailData.valid_till + " : <br/><b>" + mailData.access_code + "</b>";
		mailHtml += "<br/><br/><br/><b>Thanks and Regards<br/>" + config.smtp.fromAlias + "</b>";

		const mailDetails = {
			to: mailData.email,
			// to: 'kanishkgupta55@gmail.com',
			subject: 'Naati App Access Code', // Subject line
			text: mailText, // plain text body
			html: mailHtml, // html body
		};
		mailer.sendMail(mailDetails);
	} catch (error) {
		console.log("ERROR in sendAccessCodeEmail : ", error);
	}
};

module.exports = {
	get_access_codes,
	generate_access_code,
	toggle_code_status,
};