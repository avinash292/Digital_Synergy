'user strict';

// const Users = require('../models/userModel');
const config = require('../config');
const { ErrorHandler } = require('../helpers/errorhandler');
const Video = require('../models/videoModel');
const { Op } = require('sequelize');

/**
 * Fetch language listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_videos = async (req, res, next) => {
	// const request = req.body;
	// if (!request.email || !request.password) { next(new ErrorHandler(400, 'Missing required email and password fields')); }

	let request = {};
	request.orderBy    = (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'id';
	request.order   	= (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC';
	request.pageSize 	= (req.body.pageSize !== undefined) ? req.body.pageSize : 10;
	request.pageOffset 	= (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0;
	request.searchText 	= (req.body.searchText !== undefined) ? req.body.searchText : '';

	const searchColumns = ['id', 'title', 'description', 'link'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	try {
		let result = await Video.findAndCountAll({
			where: { ...likeSearch, is_deleted: false },
			order: [[request.orderBy, request.order]],
			offset: request.pageOffset,
			limit: request.pageSize,
		});
		return res.json({ success: true, message: 'Fetched video library successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update Video
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const save_video = async (req, res, next) => {
	const request = req.body;
	if (!request.title || !request.link) { return next(new ErrorHandler(400, 'Missing required title or link fields')); }
	request.title = request.title.trim();
	request.link = request.link.trim();

	try {
		const langId = (request.type == 'edit' && request.id !== undefined) ? request.id : false;
		// console.log("langId : ",langId);
		let ifExist = await check_if_video_title_exist(request.title, langId, next);
		if (ifExist) {
			return res.json({ success: false, message: 'Video already exists!' });
		}
		// return res.json({ success: true, message: 'Fetched language successfully!', request, ifExist });
		const video = { title: request.title, link: request.link, is_active: request.is_active,type: request.type, description: request.description, type: request.category };
		if (request.type == 'add') {
			const result = await Video.create(video);
			return res.json({ success: true, message: 'Video created successfully!', result });
		} else {
			const result = await Video.update(video, { where: { id: request.id } });
			return res.json({ success: true, message: 'Video updated successfully!', result });
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const check_if_video_title_exist = async (title, langId, next) => {
	try {
		let where = { title, is_deleted: false };
		if (langId) {
			where = { ...where, id: { [Op.not]: langId } }
		}
		let result = await Video.findOne({ where }); // , logging: console.log
		// console.log(result);
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

const get_video_details = async (req, res, next) => {
	const videoId = parseInt(req.params.id);	
	try {
		let result = await Video.findOne({ where: { id: videoId, is_deleted: false } }); // , logging: console.log
		return res.json({ success: true, message: 'Video updated successfully!', data: { video_details: result, videoId } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

/**
 * Add delete Video
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_videos = async (req, res, next) => {
	const request = req.body;
	if (!request.deleteIds) { next(new ErrorHandler(400, 'Missing delete IDs')); }
	// return res.json({ success: true, message: 'Fetched Video successfully!', request });

	try {
		const result = await Video.update({ is_deleted: true }, { where: { id: { [Op.in]: request.deleteIds } } });
		return res.json({ success: true, message: 'Video deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch video from APP
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_all_videos = async (req, res, next) => {
	let request = {};
	request.pageSize 	= (req.body.pageSize !== undefined) ? req.body.pageSize : 10;
	request.pageOffset 	= (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0;
	try {
		let result = await Video.findAndCountAll({
			where: { is_deleted: false, is_active: true, type:req.body.type },
			offset: request.pageOffset,
			limit: request.pageSize,
		});
		return res.json({ success: true, message: 'Fetched video library successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

module.exports = {
  get_videos,
	save_video,
	get_video_details,
	delete_videos,
	get_all_videos,
};