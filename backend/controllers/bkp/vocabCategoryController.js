'user strict';

const config = require('../config');
const { ErrorHandler } = require('../helpers/errorhandler');
const VocabCategory = require('../models/vocabCategoryModel');
const { Op } = require('sequelize');

/**
 * Fetch vocabulary categories
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_categories = async (req, res, next) => {
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
		let result = await VocabCategory.findAndCountAll({
			where: { ...likeSearch, is_deleted: false },
			order: [[request.orderBy, request.order]],
			offset: request.pageOffset,
			limit: request.pageSize
		});
		return res.json({ success: true, message: 'Fetched vocabulary categories successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update vocabulary categories
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const save_category = async (req, res, next) => {
	const request = req.body;
	if (!request.name) { next(new ErrorHandler(400, 'Missing required name or label fields')); }
	// return res.json({ success: false, message: 'Fetched categories successfully!', request });
	request.name = request.name.trim();

	try {
		const catId = (request.type == 'edit' && request.id !== undefined) ? request.id : false;
		let ifExist = await check_if_category_exist(request.name, catId, next);
		if (ifExist) {
			return res.json({ success: false, message: 'Vocabulary Category already exists!' });
		}
		const vocabularyCategory = { name: request.name };
		if (request.type == 'add') {
			const result = await VocabCategory.create(vocabularyCategory);
			return res.json({ success: true, message: 'Vocabulary Category created successfully!', result });
		} else {
			const result = await VocabCategory.update(vocabularyCategory, { where: { id: request.id } });
			return res.json({ success: true, message: 'Vocabulary Category updated successfully!', result });
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const check_if_category_exist = async (name, catId, next) => {
	try {
		let where = { name, is_deleted: false };
		if (catId) {
			where = { ...where, id: { [Op.not]: catId } }
		}
		let result = await VocabCategory.findOne({ where }); // , logging: console.log
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

/**
 * Add delete categories
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_categories = async (req, res, next) => {
	const request = req.body;
	if (!request.deleteIds) { next(new ErrorHandler(400, 'Missing delete IDs')); }
	// return res.json({ success: true, message: 'Fetched categories successfully!', request });

	try {
        const result = await VocabCategory.update({ is_deleted: true }, { where: { id: { [Op.in]: request.deleteIds } } });
		return res.json({ success: true, message: 'Vocabulary Categories deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Get all categories (APP)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_all_categories = async (req, res, next) => {
	try {
		const result = await VocabCategory.findAll({
			attributes: ['id', 'name'],
			where: { is_deleted: false }
		})
		res.json({ success: true, message: 'Fetch vocabulary categories successfully!', data: { vocabulary_categories: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));		
	}
};

module.exports = {
	get_categories,
	save_category,
	delete_categories,
	get_all_categories
};