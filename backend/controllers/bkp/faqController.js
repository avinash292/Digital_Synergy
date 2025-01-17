'user strict';

// const Users = require('../models/userModel');
const config = require('../config');
const { ErrorHandler } = require('../helpers/errorhandler');
const Faq = require('../models/faqModel');
const { Op } = require('sequelize');

/**
 * Fetch language listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_faqs = async (req, res, next) => {
	// const request = req.body;
	// if (!request.email || !request.password) { next(new ErrorHandler(400, 'Missing required email and password fields')); }

	let request = {};
	request.orderBy    = (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'id';
	request.order   	= (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC';
	request.pageSize 	= (req.body.pageSize !== undefined) ? req.body.pageSize : 10;
	request.pageOffset 	= (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0;
	request.searchText 	= (req.body.searchText !== undefined) ? req.body.searchText : '';

	const searchColumns = ['question', 'answer'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	try {
		let result = await Faq.findAndCountAll({
			where: { ...likeSearch, is_deleted: false },
			order: [[request.orderBy, request.order]],
			offset: request.pageOffset,
			limit: request.pageSize,
		});
		return res.json({ success: true, message: 'Fetched FAQs successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update FAQ
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const save_faq = async (req, res, next) => {
	const request = req.body;
	if (!request.question || !request.answer) { return next(new ErrorHandler(400, 'Missing required question or answer fields')); }
	request.question = request.question.trim();
	request.answer = request.answer.trim();
	// return res.json({ success: false, message: 'Fetched language successfully!', request });

	try {
		const faqId = (request.type == 'edit' && request.id !== undefined) ? request.id : false;
		// console.log("faqId : ",faqId);
		let ifExist = await check_if_faq_exist(request.question, faqId, next);
		if (ifExist) {
			return res.json({ success: false, message: 'FAQ already exists!' });
		}
		// return res.json({ success: true, message: 'Fetched language successfully!', request, ifExist });
		const faq = { question: request.question, answer: request.answer };
		if (request.type == 'add') {
			const result = await Faq.create(faq);
			return res.json({ success: true, message: 'FAQ created successfully!', result });
		} else {
			const result = await Faq.update(faq, { where: { id: request.id } });
			return res.json({ success: true, message: 'FAQ updated successfully!', result });
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const check_if_faq_exist = async (question, faqId, next) => {
	try {
		let where = { question, is_deleted: false };
		if (faqId) {
			where = { ...where, id: { [Op.not]: faqId } }
		}
		let result = await Faq.findOne({ where }); // , logging: console.log
		// console.log(result);
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

const get_faq_details = async (req, res, next) => {
	const faqId = parseInt(req.params.id);	
	try {
		let result = await Faq.findOne({ where: { id: faqId, is_deleted: false } }); // , logging: console.log
		return res.json({ success: true, message: 'FAQ fetched successfully!', data: { faq_details: result, faqId } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

/**
 * Add delete faq
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_faq = async (req, res, next) => {
	const request = req.body;
	if (!request.deleteIds) { next(new ErrorHandler(400, 'Missing delete IDs')); }
	// return res.json({ success: true, message: 'Fetched FAQ successfully!', request });

	try {
		const result = await Faq.update({ is_deleted: true }, { where: { id: { [Op.in]: request.deleteIds } } });
		return res.json({ success: true, message: 'FAQ deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch FAQ from APP
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_all_faqs = async (req, res, next) => {
	try {
		let result = await Faq.findAll({
            attributes: [ ['question', 'title'], ['answer', 'content'] ],
            where: { is_deleted: false },
			order: [['question', 'ASC']],
            
		});
		return res.json({ success: true, message: 'Fetched FAQs successfully!', data: { faqs: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

module.exports = {
    get_faqs,
	save_faq,
	get_faq_details,
	delete_faq,
	get_all_faqs,
};