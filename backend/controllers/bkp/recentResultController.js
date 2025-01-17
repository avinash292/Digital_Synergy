'user strict';

const { Op, fn, col } 	= require('sequelize');
// const moment			= require('moment');
const IncomingForm		= require('formidable').IncomingForm;
const config 			= require('../config');
const { ErrorHandler } 	= require('../helpers/errorhandler');
const RecentResults 	= require('../models/recentResultModel');
const fs				= require('fs');

const uploadDir = 'assets/recent_results/';

/**
 * Upload result images
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const submit_result_image = async (req, res, next) => {
	let form = new IncomingForm();
	form.uploadDir = uploadDir;		//set upload directory
	form.keepExtensions = true;		//keep file extension
	
	form.parse(req, async (err, fields, files) => {
		if (err) { return next(new ErrorHandler(500, config.common_err_msg, err)); }
		// delete_uploaded_files(files);

		await RecentResults.create({ path: files.image.path.replace(uploadDir, '') });
		return res.json({ success: true, message: 'Recent result image inserted successfully!' });
	});	
	form.on('error', (err) => {
		return next(new ErrorHandler(500, config.common_err_msg, err));
	});
};

const delete_uploaded_files = async (files) => {
	for (const key in files) {
		if (files.hasOwnProperty(key)) {
			delete_file(files[key].path);
		}
	}
};

const delete_file = (filepath) => {
	fs.unlinkSync(filepath);   // remove temp file
};

const get_result_images = async (req, res, next) => {
	try {
		const result = await RecentResults.findAll();
		return res.json({ success: true, message: 'Recent result image inserted successfully!', data: { recent_results: result } });
	} catch (error) {
		return next(new ErrorHandler(500, config.common_err_msg, error));
	}
};


/**
 * Delete feedback image
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_result_image = async (req, res, next) => {
	const recentResultId = parseInt(req.params.id), path = req.params.path;
	try {
		if (path && fs.existsSync(uploadDir + path)) { delete_file(uploadDir + path); }
		await RecentResults.destroy({ where: { id: recentResultId } });		
		return res.json({ success: true, message: 'Deleted recent result image successfully!' });
	} catch (error) {
		return next(new ErrorHandler(500, config.common_err_msg, error));		
	}
};

module.exports = {
	submit_result_image,
	get_result_images,
	delete_result_image,
};