'user strict';

// const Users = require('../models/userModel');
const config = require('../config');
const { ErrorHandler } = require('../helpers/errorhandler');
const { Op } = require('sequelize');
const Enquiry = require('../models/enquiryModel');
const Users = require('../models/userModel');


/**
 * Fetch language listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_enquiries = async (req, res, next) => {
	let request = {
	    orderBy     : (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'id',
	    order   	: (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC',
	    pageSize 	: (req.body.pageSize !== undefined) ? req.body.pageSize : 10,
	    pageOffset 	: (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0,
        searchText 	: (req.body.searchText !== undefined) ? req.body.searchText : '',
    };

    let order = [request.orderBy, request.order];
	if (request.orderBy === 'user.first_name') { 
		order = ['user', 'first_name', request.order];
	}

	const searchColumns = ['enquiry'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	try {
		let result = await Enquiry.findAndCountAll({
            where: { ...likeSearch },
            include: {
                model: Users,
                required: true,
                attributes: [ 'id', 'first_name', 'last_name', 'email', 'mobile' ],
				where: { is_deleted: false }
            },
			order: [order],
			offset: request.pageOffset,
            limit: request.pageSize,
            // logging: console.log
		});
		return res.json({ success: true, message: 'Fetched enquiries successfully!', data: result });
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
const save_enquiry = async (req, res, next) => {
	const request = req.body, userId = req.user_id;
	if (!request.enquiry) { return next(new ErrorHandler(400, 'Missing required enquiry field!')); }
	request.enquiry = request.enquiry.trim();
	// return res.json({ success: false, message: 'Fetched language successfully!', request, userId });

	try {
		const enquiry = { user_id: userId, enquiry: request.enquiry };		
        const result = await Enquiry.create(enquiry);
        return res.json({ success: true, message: 'Enquiry submitted successfully!', result });
		
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const get_enquiry_details = async (req, res, next) => {
	const faqId = parseInt(req.params.id);	
	try {
		let result = await Enquiry.findOne({ where: { id: faqId, is_deleted: false } }); // , logging: console.log
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
		const result = await Enquiry.update({ is_deleted: true }, { where: { id: { [Op.in]: request.deleteIds } } });
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
		let result = await Enquiry.findAll({
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
    get_enquiries,
	save_enquiry,
	get_enquiry_details,
	delete_faq,
	get_all_faqs,
};