'user strict';

const config = require('../config');
const { ErrorHandler } = require('../helpers/errorhandler');
const Language = require('../models/languageModel');
const { Op } = require('sequelize');

/**
 * Fetch language listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_languages = async (req, res, next) => {
	let request = {
		orderBy		: (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'name',
		order   	: (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC',
		pageSize 	: (req.body.pageSize !== undefined) ? req.body.pageSize : 10,
		pageOffset 	: (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0,
		searchText 	: (req.body.searchText !== undefined) ? req.body.searchText : '',
	};

	const searchColumns = ['name', 'label'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	
	try {
		let result = await Language.findAndCountAll({
			where: likeSearch,
			order: [[request.orderBy, request.order]],
			offset: request.pageOffset,
			limit: request.pageSize
		});
		return res.json({ success: true, message: 'Fetched language successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update language
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const save_language = async (req, res, next) => {
	const request = req.body;
	if (!request.name || !request.label) { next(new ErrorHandler(400, 'Missing required name or label fields')); }
	// return res.json({ success: true, message: 'Fetched language successfully!', request });
	request.name = request.name.trim();

	try {
		const langId = (request.type == 'edit' && request.id !== undefined) ? request.id : false;
		let ifExist = await check_if_language_exist(request.name, langId, next);
		if (ifExist) {
			return res.json({ success: false, message: 'Language already exists!' });
		}
			
		if (request.type == 'add') {
			const result = await Language.create({ name: request.name, label: request.label });
			return res.json({ success: true, message: 'Language created successfully!', result });
		} else {
			const result = await Language.update({ name: request.name, label: request.label }, { where: { id: request.id } });
			return res.json({ success: true, message: 'Language updated successfully!', result });
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const check_if_language_exist = async (name, langId, next) => {
	try {
		let where = { name };
		if (langId) {
			where = { ...where, id: { [Op.not]: langId } }
		}
		let result = await Language.findOne({ where }); // , logging: console.log
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

/**
 * Add delete language
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_languages = async (req, res, next) => {
	const request = req.body;
	if (!request.deleteIds) { next(new ErrorHandler(400, 'Missing delete IDs')); }
	// return res.json({ success: true, message: 'Fetched language successfully!', request });

	try {
		const result = await Language.destroy({ where: { id: { [Op.in]: request.deleteIds } } });
		return res.json({ success: true, message: 'Language deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Get all languages (APP)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_all_languages = async (req, res, next) => {
	try {
		const result = await Language.findAll({
			attributes: ['id', 'name', 'label']
		})
		res.json({ success: true, message: 'Fetch languages successfully!', data: { languages: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));		
	}
};

module.exports = {
	get_languages,
	save_language,
	delete_languages,
	get_all_languages
};