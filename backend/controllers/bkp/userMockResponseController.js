'user strict';

const { Op, fn, col } 	= require('sequelize');
// const moment			= require('moment');
const IncomingForm		= require('formidable').IncomingForm;
const config 			= require('../config');
const { ErrorHandler } 	= require('../helpers/errorhandler');
const UserMockTests 	= require('../models/userMockTestModel');
const MockTests			= require('../models/mockTestModel');
const MockTestDialogues = require('../models/mockTestDialogueModel');
const Users				= require('../models/userModel');
const Languages			= require('../models/languageModel');
const UserMockTestResponses	= require('../models/userMockTestResponseModel');
const MockDialogueSegments	= require('../models/mockTestSegmentsModel');
const UserMockFeedbackImages= require('../models/userMockFeedbackImagesModel');
// const Dialogues			= require('../models/dialogueModel');
const fs				= require('fs');

const uploadDir = 'assets/mock_responses/';
const feedbackUploadDir = 'assets/feedback_images/';

/**
 * Submit mock test
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const submit_mock_test = async (req, res, next) => {
	let form = new IncomingForm();
	const userId = req.user_id;
	form.uploadDir = uploadDir;		//set upload directory
	form.keepExtensions = true;		//keep file extension
	
	form.parse(req, async (err, fields, files) => {
		if (err) { return next(new ErrorHandler(500, config.common_err_msg, err)); }
		let fieldsData = JSON.parse(fields.data);
		if (!fieldsData || !fieldsData.mock_test_id || !fieldsData.responses) {
			delete_uploaded_files(files);
			return next(new ErrorHandler(400, config.missing_fields));
		}
		let attempted = await UserMockTests.findOne({ where: { user_id: userId, language_id: fieldsData.language_id, mock_test_id: fieldsData.mock_test_id } });
		if (attempted) {
			return res.json({ success: false, message: 'You have already submitted mock test', attempted });
		}
		let userMockTest = {
			user_id		: userId,
			mock_test_id: fieldsData.mock_test_id,
			title		: fieldsData.mock_test_title,
			language_id	: fieldsData.language_id,
			time_taken	: '00:' + fieldsData.time_taken
		};
		// delete_uploaded_files(files);
		// return res.json({ success: false, message: 'test!', fieldsData, files, userMockTest });
		const result = await UserMockTests.create(userMockTest);
		// const result =  { id: 1 };
		const userMockId = result.id;
		const insertResult = await insert_responses(userMockId, fieldsData.responses, files, next);
		// return res.json({ success: false, message: 'test!', fieldsData, files, userMockTest, insertResult });
		return res.json({ success: true, message: 'Submitted mock test successfully!', data: { msg_description: 'Please wait for the feedback of your responses' }, insertResult });
		
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

/**
 * Insert audio segments after filtering
 * 
 * @param {Number} userMockId 
 * @param {Array} responses 
 * @param {Object} files 
 * @param {*} next
 * 
 * @returns Seqalize Object
 */
const insert_responses = async (userMockId, responses, files, next) => {
	try {
		const segments = responses.map(segment => {
			let userResponse = {
				user_mock_test_id: userMockId,
				dialogue_id: segment.dialogue_id,
				segment_id: segment.segment_id,
			};

			for (const fileKey in files) {
				if (files.hasOwnProperty(fileKey)) {
					const singleFile = files[fileKey];
					const fileSplit = fileKey.split('_');
					if (fileSplit[0] && fileSplit[1] && parseInt(fileSplit[0]) == segment.dialogue_id && parseInt(fileSplit[1]) == segment.segment_id) {
						userResponse.response = singleFile.path.replace(uploadDir, '');
					}
				}
			}
			return userResponse;
		});
		return await UserMockTestResponses.bulkCreate(segments);
	} catch (error) {
		return next(new ErrorHandler(500, config.common_err_msg, error));
	}
};

const check_user_mock_attempt = async (req, res, next) => {
	try {
		// return res.json({ success: true, message: 'Fetched mock test attempt successfully!', data: { user_attempt: null } });
		const userId = req.user_id, languageId = req.params.langId, mockId = req.params.id;
		const result = await UserMockTests.findOne({
			where: { user_id: userId, language_id: languageId, mock_test_id: mockId },
			include: {
				model: UserMockFeedbackImages,
			}
		});
		return res.json({ success: true, message: 'Fetched mock test attempt successfully!', data: { user_attempt: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch user mock test response listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_mock_test_responses = async (req, res, next) => {
	let request = {};
	request.orderBy    = (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'id';
	request.order   	= (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC';
	request.pageSize 	= (req.body.pageSize !== undefined) ? req.body.pageSize : 10;
	request.pageOffset 	= (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0;
	request.searchText 	= (req.body.searchText !== undefined) ? req.body.searchText : '';

	let order = [request.orderBy, request.order];
	if (request.orderBy === 'language') {
		order = ['language', 'name', request.order];
	} else if (request.orderBy === 'user') {
		order = ['user', 'first_name', request.order];
	}

	const searchColumns = ['title'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	try {
		let result = await UserMockTests.findAndCountAll({
			where: { ...likeSearch },
			include: [
				{
					model: Users,
					require: true,
					attributes: ['id', 'first_name', 'last_name'],
					where: { is_deleted: false }
				},
				{
					model: Languages,
					attributes: ['id', 'name', 'label']
				}
			],
			order: [order],
			offset: request.pageOffset,
			limit: request.pageSize,
		});
		return res.json({ success: true, message: 'Fetched mock tests successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};


/**
 * Fetch mock test details
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_mock_responses_details = async (req, res, next) => {
	const userMockTestId = parseInt(req.params.id);	
	try {
		let result = await UserMockTests.findOne({
			where: { id: userMockTestId },
			include: [{
				model: Users,
				require: true,
				attributes: ['id', 'first_name', 'last_name'],
				where: { is_deleted: false }
			}, {
				model: Languages,
				attributes: ['id', 'name', 'label']
			}, {
				model: UserMockFeedbackImages,
			}, {
				model: MockTests,
				attributes: ['id', 'title', 'test_duration'],
				include: {
					model: MockTestDialogues,
					attributes: ['id', 'title', 'description'],
					where: { is_deleted: false },
					include: {
						model: MockDialogueSegments,
						where: { is_deleted: false },
						include: {
							model: UserMockTestResponses,
							where: { user_mock_test_id: userMockTestId },
						},
					}
				},
			}]
		}); // , logging: console.log
		return res.json({ success: true, message: 'Fetch mock test successfully!', data: { reponse_details: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

/**
 * Save mock test feedback by admin
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const save_feedback = async (req, res, next) => {
	let form = new IncomingForm();
	
	form.uploadDir = feedbackUploadDir;		//set upload directory
	form.keepExtensions = true;		//keep file extension
	
	form.parse(req, async (err, fields, files) => {
		if (err) { return next(new ErrorHandler(500, config.common_err_msg, err)); }
		const request = JSON.parse(fields.data);

		if (!request.feedback || !request.id) {
			delete_uploaded_files(files);
			next(new ErrorHandler(400, config.missing_fields));
		}

		try {
			request.feedback = request.feedback.trim();
			const mockTest = { feedback: request.feedback };
			const result = await UserMockTests.update(mockTest, { where: { id: request.id } });
			await insert_feedback_images(request.id, files, next)
			return res.json({ success: true, message: 'Feedback saved successfully!' });
		} catch (error) {
			delete_uploaded_files(files);
			next(new ErrorHandler(200, config.common_err_msg, error));
		}
	});	
	form.on('error', (err) => {
		return next(new ErrorHandler(500, config.common_err_msg, err));
	});
};

const insert_feedback_images = async (userMockTestId, files, next) => {
	try {
		let feedbackImages = [];
		for (const fileKey in files) {
			if (files.hasOwnProperty(fileKey)) {
				const singleFile = files[fileKey];
				const filename = singleFile.path.replace(feedbackUploadDir, '');
				feedbackImages = [...feedbackImages, { user_mock_test_id: parseInt(userMockTestId), path: filename }];					
			}
		}
		return await UserMockFeedbackImages.bulkCreate(feedbackImages);
	} catch (error) {
		return next(new ErrorHandler(500, config.common_err_msg, error));
	}
};

/**
 * Fetch mock test result (APP)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_mock_test_result = async (req, res, next) => {
	const userMockTestId = parseInt(req.params.id), mockId = parseInt(req.params.mockId);	
	// return res.json({ success: false, message: 'Fetch mock test successfully!', userMockTestId, mockId });
	try {
		let result = await MockTests.findOne({
			attributes: ['id', 'title', 'test_duration'],
			where: { id: mockId, is_deleted: false },
			include: {
				model: MockTestDialogues,
				attributes: ['id', 'title', 'description'],
				where: { is_deleted: false },
				include: {
					model: MockDialogueSegments,
					where: { is_deleted: false },
					include: {
						model: UserMockTestResponses,
						where: { user_mock_test_id: userMockTestId },
					},
				}
			},
		}); // , logging: console.log
		return res.json({ success: true, message: 'Fetch mock test successfully!', data: { reponse_details: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

/**
 * Delete feedback image
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_mock_feedback_image = async (req, res, next) => {
	const feedbackImgId = parseInt(req.params.id), path = req.params.path;
	try {
		if (path && fs.existsSync(feedbackUploadDir + path)) { delete_file(feedbackUploadDir + path); }
		await UserMockFeedbackImages.destroy({ where: { id: feedbackImgId } });		
		return res.json({ success: true, message: 'Deleted feedback image successfully!' });
	} catch (error) {
		
	}
};

module.exports = {
	submit_mock_test,
	check_user_mock_attempt,
	get_mock_test_responses,
	get_mock_responses_details,
	save_feedback,
	get_mock_test_result,
	delete_mock_feedback_image,
};