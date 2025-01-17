'user strict';

const { Op, fn, col, where }= require('sequelize');
const moment				= require('moment');
const IncomingForm			= require('formidable').IncomingForm;
const fs					= require('fs');

const config 				= require('../config');
const { ErrorHandler } 		= require('../helpers/errorhandler');
const MockTests 			= require('../models/mockTestModel');
const MockTestDialogues 	= require('../models/mockTestDialogueModel');
const MockDialogueSegments	= require('../models/mockTestSegmentsModel');
const Languages 			= require('../models/languageModel');
const UserPaidPlan			= require('../models/userPaidPlanModel');

const uploadDir				= 'assets/mock_test_audio_files/';


/**
 * Fetch mock test dashboard
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_mock_test_languages = async (req, res, next) => {
	try {
		let result = await Languages.findAll({
			attributes: ['id', 'name', 'label', [fn('COUNT', col('mock_tests.id')), 'dialogue_count'] ],
			group: ['id'],
			include: {
				model: MockTests,
				attributes: [],
				on: {
					col1: where(col("mock_tests.language_id"), "=", col("languages.id")),
					col2: where(col("mock_tests.is_deleted"), "=", false)
				},
			},
			// logging: console.log
		});
		return res.json({ success: true, message: 'Fetched mock test languages successfully!', data: { dialogue_languages: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch mock test listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_mock_tests = async (req, res, next) => {
	// const request = req.body;
	if (!req.body.languageId) { next(new ErrorHandler(400, 'Missing language ID!')); }

	let request = {};
	request.orderBy    = (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'id';
	request.order   	= (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC';
	request.pageSize 	= (req.body.pageSize !== undefined) ? req.body.pageSize : 10;
	request.pageOffset 	= (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0;
	request.searchText 	= (req.body.searchText !== undefined) ? req.body.searchText : '';
	request.languageId 	= req.body.languageId;

	/* let order = [request.orderBy, request.order];
	if (request.orderBy === 'vocab_category.name') {
		order = ['vocabulary_category', 'name', request.order];
	} */

	const searchColumns = ['title'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	try {
		let result = await MockTests.findAndCountAll({
			where: { ...likeSearch, language_id: request.languageId, is_deleted: false },
			order: [[request.orderBy, request.order]],
			offset: request.pageOffset,
			limit: request.pageSize,
		});
		return res.json({ success: true, message: 'Fetched mock tests successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update mock test
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const save_mock_test = async (req, res, next) => {

	let form = new IncomingForm();
	
	form.uploadDir = uploadDir;		//set upload directory
	form.keepExtensions = true;		//keep file extension
	
	form.parse(req, async (err, fields, files) => {
		if (err) { return next(new ErrorHandler(500, config.common_err_msg, err)); }
		const fieldsData = JSON.parse(fields.data);

		if ((!fieldsData.title && !fieldsData.dialogue_only) || !fields.audio_segments) {
			delete_uploaded_files(files);
			return next(new ErrorHandler(400, config.missing_fields));
		}
		const audioSegments = JSON.parse(fields.audio_segments);
		// delete_uploaded_files(files); return res.json({ success: false, message: 'test!', fieldsData, files, audioSegments });
		try {
			let { dialogue_only, dialogue_title, dialogue_description, language_id, mockTestId, start_transcript, end_transcript } = fieldsData;
			if (!dialogue_only) {
				mockTestId = await insert_mock_test(fieldsData, language_id, next);
				if (mockTestId === 'mock_test_exists') {
					delete_uploaded_files(files);
					return res.json({ success: false, message: 'Mock test title should be unique!' });
				}
			}	

			const mockTestDialogue = {
				title: dialogue_title,
				description: dialogue_description,
				mock_test_id: mockTestId,
				start_audio: files.start_audio.path.replace(uploadDir,''),
				end_audio: files.end_audio.path.replace(uploadDir,''),
				start_transcript,
				end_transcript
			};
			const diaResult = await MockTestDialogues.create(mockTestDialogue);
			mockTestDialogueId = diaResult.id;
			const insertResult = await insert_audio_segments(mockTestDialogueId, audioSegments, files, next);
			const message = dialogue_only ? 'Dialogue added successfully!' : 'Mock Test added successfully!';
			return res.json({ success: true, message });
		} catch (error) {
			delete_uploaded_files(files);
			next(new ErrorHandler(200, config.common_err_msg, error));
		}
	});	
	form.on('error', (err) => {
		return next(new ErrorHandler(500, config.common_err_msg, err));
	});
};

/**
 * Insert Mock test
 * @param {*} fieldsData 
 * @param {*} language_id 
 * @param {*} next 
 */
const insert_mock_test = async (fieldsData, language_id, next) => {
	try {		
		let { title, type, mockTestId, test_duration } = fieldsData;
		title = title.trim();
		test_duration = parseInt(test_duration);
		mockTestId = (type == 'edit' && mockTestId !== undefined) ? mockTestId : false;
		let ifExist = await check_if_mock_exist(title, language_id, mockTestId, next);
		if (ifExist) { return 'mock_test_exists'; }

		const mockTest = { title, test_duration, language_id };
		const result = await MockTests.create(mockTest);
		return result.id;
	} catch (error) {
		return next(new ErrorHandler(500, config.common_err_msg, error));
	}
};

/**
 * Insert audio segments after filtering
 * 
 * @param {Number} dialogueId 
 * @param {Array} audioSegments 
 * @param {Object} files 
 * @param {*} next
 * 
 * @returns Seqalize Object
 */
const insert_audio_segments = async (dialogueId, audioSegments, files, next) => {
	try {
		const segments = audioSegments.map((segment, index) => {
			const keyIndex = (segment.sort_index !== undefined) ? segment.sort_index : index;
			let audioSegment = {
				dialogue_id: dialogueId,
				name: segment.name ? segment.name : null,
				transcript: segment.transcript,
				sample_transcript: segment.sample_transcript,
				sort_index: keyIndex,
			};
			for (const fileKey in files) {
				if (files.hasOwnProperty(fileKey)) {
					const singleFile = files[fileKey];
					const fileSplit = fileKey.split('_');
					if (fileSplit[1] !== undefined && parseInt(fileSplit[1]) == keyIndex ) {
						const filename = singleFile.path.replace(uploadDir, '');
						if (fileSplit[0] == 'audioFile' && segment.audio_name == singleFile.name) {
							audioSegment.audio_path = filename;
						} else if (fileSplit[0] == 'responseFile' && segment.response_name == singleFile.name) {
							audioSegment.sample_response = filename;
						}
					}
				}
			}
			return audioSegment;
		});
		return await MockDialogueSegments.bulkCreate(segments);
	} catch (error) {
		return next(new ErrorHandler(500, config.common_err_msg, error));
	}
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

const check_if_mock_exist = async (title, languageId, mockTestId, next) => {
	try {
		let where = { title, language_id: languageId, is_deleted: false };
		if (mockTestId) {
			where = { ...where, id: { [Op.not]: mockTestId } }
		}
		let result = await MockTests.findOne({ where }); // , logging: console.log
		// console.log(result);
		return (result) ? true : false;
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
const get_mock_test_details = async (req, res, next) => {
	const mockTestId = parseInt(req.params.id);	
	try {
		let result = await MockTests.findOne({
			// attributes: ['id', 'title', 'test_duration', [fn('COUNT', col('mock_dialogue_segments.id')), 'segment_count']],
			where: { id: mockTestId, is_deleted: false },
			include: {
				model: MockTestDialogues,
				where: { is_deleted: false },
				include: {
					model: MockDialogueSegments,
					where: { is_deleted: false },
				}
			},
			order: [[col('mock_test_dialogues->mock_dialogue_segments.sort_index'), 'ASC']],
			// logging: console.log
		});
		return res.json({ success: true, message: 'Fetched mock test successfully!', data: { mock_details: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch mock tests (APP)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_all_mock_tests = async (req, res, next) => {
	try {
		const languageId = req.params.langId , userId = req.user_id;
		const userPaidPlan = await check_user_plan(userId, next);
		if (!userPaidPlan) {
			return res.json({ success: true, message: 'Mock test are not included not your plan.', data: { have_access: false } });
		}
		const result = await MockTests.findAll({
			where: { language_id: languageId, is_deleted: false },
			include: {
				model: MockTestDialogues,
				where: { is_deleted: false }
			}
		});
		return res.json({ success: true, message: 'Fetched mock tests successfully!', data: { mock_tests: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Check user plan
 * 
 * @param {*} userId 
 * @param {*} next 
 */
const check_user_plan = async (userId, next) => {
	try {
		const currentDateTime = moment().toDate();
		let result = await UserPaidPlan.findOne({
			where: {
				user_id: userId,
				end_date: { [Op.gte]: currentDateTime },
				is_active: true,
				include_mock_tests: true,
			},
		});
		return result;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));		
	}
};

const get_mock_test_questions = async (req, res, next) => {
	const mockTestId = parseInt(req.params.id);	
	try {
		let result = await MockTestDialogues.findAll({
			attributes: ['id', 'title', 'description', 'mock_test_id', 'start_audio', 'end_audio', 'start_transcript', 'end_transcript'],
			where: { is_deleted: false, mock_test_id: mockTestId },
			include: {
				attributes: ['id', 'name', 'audio_path', 'sort_index'],
				model: MockDialogueSegments,
				where: { is_deleted: false },
			},
			order: [['createdAt', 'ASC'], ['mock_dialogue_segments', 'sort_index', 'ASC']],
			// order: [[col('mock_test_dialogues->mock_dialogue_segments.sort_index'), 'ASC']],
			// logging: console.log
		});
		const mockDialogues = result.map(dialogue => {
			const descriptionAudios = {
				start: {
					audio_path: dialogue.start_audio ? dialogue.start_audio : null,
					transcript: dialogue.start_transcript ? dialogue.start_transcript : null
				},
				end: {
					audio_path: dialogue.end_audio ? dialogue.end_audio : null,
					transcript: dialogue.end_transcript ? dialogue.end_transcript : null
				}
			};
			return {
				id: dialogue.id,
				title: dialogue.title,
				description: dialogue.description,
				mock_dialogue_segments: dialogue.mock_dialogue_segments,
				description_audios: descriptionAudios
			};
		});
		return res.json({ success: true, message: 'Fetched mock test successfully!', data: { mock_dialogues: mockDialogues } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};


const update_mock_details = async (req, res, next) => {
	try {
		let form = new IncomingForm();
		
		form.uploadDir = uploadDir;		//set upload directory
		form.keepExtensions = true;		//keep file extension
		form.parse(req, async (err, fields, files) => {
			const mockTestId = req.params.id;
			const fieldsData = fields,
			 request = fields;
			console.log(fieldsData)
			if (!mockTestId || !fieldsData.languageId || !fieldsData.title) { return next(new ErrorHandler(400, config.missing_fields)); }
			const title = fieldsData.title.trim();
			//let ifExist = await check_if_mock_exist(title, fieldsData.languageId, mockTestId, next);
			//if (ifExist) {
			//	return res.json({ success: false, message: 'Mock test title should be unique!' });
			//}
			let mockTest = {
					title: title,
					start_transcript: fieldsData.start_transcript, 
					end_transcript: fieldsData.end_transcript,
					test_duration: fieldsData.test_duration ? parseInt(fieldsData.test_duration) : undefined
				}
			let start_audio = "", end_audio = "";
			if (files.hasOwnProperty('start_audio')) {
				if (request.original_start_audio && fs.existsSync(uploadDir + request.original_start_audio)) { delete_file(uploadDir + request.original_start_audio); }
				start_audio = files.start_audio.path.replace(uploadDir,'');
			}
			if (files.hasOwnProperty('end_audio')) {
				if (request.original_end_audio && fs.existsSync(uploadDir + request.original_end_audio)) { delete_file(uploadDir + request.original_end_audio); }
				end_audio = files.end_audio.path.replace(uploadDir,'');
			}



			if (start_audio) { mockTest = { ...mockTest, start_audio }; }
			if (end_audio) { mockTest = { ...mockTest, end_audio }; }
			const result = await MockTests.update(mockTest, { where: { id: mockTestId } });
			return res.json({ success: true, message: 'Mock Test updated successfully!', result });
		});	
		form.on('error', (err) => {
			return next(new ErrorHandler(500, config.common_err_msg, err));
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));		
	}
};

/**
 * Update dialogue details
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const update_dialogue = async (req, res, next) => {
	let form = new IncomingForm();
	
	form.uploadDir = uploadDir;		//set upload directory
	form.keepExtensions = true;		//keep file extension
	
	form.parse(req, async (err, fields, files) => {
		if (err) { return next(new ErrorHandler(500, config.common_err_msg, err)); }
		const fieldsData = JSON.parse(fields.data);
		// delete_uploaded_files(files);
		// return res.json({ success: false, message: 'test!', fieldsData, files, fields });
		/* const validExtensions = ['csv', 'xls', 'xlsx'];
		if (!validExtensions.includes(ext)) {
			delete_file(filePath);
			return res.json({ success: false, message: 'Invalid File Format' });
		} */
		if (!fieldsData.title || !fieldsData.mockTestId) {
			delete_uploaded_files(files);
			next(new ErrorHandler(400, config.missing_fields));
		}
		let { title, mockTestId } = fieldsData;
		const { description, id, audioSegments, newSegments } = fieldsData;
		title = title.trim();
		mockTestId = parseInt(mockTestId);
		// delete_uploaded_files(files); return res.json({ success: false, message: 'test!', fieldsData, files });
		if (fields.start_transcript) dialogueData.start_transcript = fields.start_transcript;
		if (fields.end_transcript) dialogueData.end_transcript = fields.end_transcript;

		let descriptionObj = {
			start_transcript: fieldsData.start_transcript,
			end_transcript: fieldsData.end_transcript,
		};
		if (files.hasOwnProperty('start_audio')) {
			if (fieldsData.original_start_audio && fs.existsSync(uploadDir + fieldsData.original_start_audio)) { delete_file(uploadDir + fieldsData.original_start_audio); }
			descriptionObj.start_audio = files.start_audio.path.replace(uploadDir,'');
		}
		if (files.hasOwnProperty('end_audio')) {
			if (fieldsData.original_end_audio && fs.existsSync(uploadDir + fieldsData.original_end_audio)) { delete_file(uploadDir + fieldsData.original_end_audio); }
			descriptionObj.end_audio = files.end_audio.path.replace(uploadDir,'');
		}

		try {
			const dialogue = { title, description, ...descriptionObj };
			const result = await MockTestDialogues.update(dialogue, { where: { mock_test_id: mockTestId, id } });
			await update_audio_segments(audioSegments, next);
			if (newSegments && newSegments.length) {
				await insert_audio_segments(id, newSegments, files, next);
			}
			return res.json({ success: true, message: 'Dialogue updated successfully!', result });
		} catch (error) {
			delete_uploaded_files(files);
			next(new ErrorHandler(200, config.common_err_msg, error));
		}
	});	
	form.on('error', (err) => {
		return next(new ErrorHandler(500, config.common_err_msg, err));
	});
};

const update_audio_segments = async (audioSegments, next) => {
	try {
		for (const segment of audioSegments) {
			if (segment.id) {
				const segmentId = segment.id;
				delete segment.id;
				await MockDialogueSegments.update(segment, { where: { id: segmentId, is_deleted: false } });
			}
		}
		return true;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Upload audio
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const upload_audio = async (req, res, next) => {
	// return res.json({ success: false, message: 'asdasd!', body: req.body });
	let form = new IncomingForm();
	
	form.uploadDir = uploadDir;      //set upload directory
	form.keepExtensions = true;     		 //keep file extension
	
	form.parse(req, async (err, fields, files) => {
		if (err) { return next(new ErrorHandler(500, config.common_err_msg, err)); }
		const filePath = files.file.path;
		// delete_file(filePath);
		// return res.json({ success: false, message: 'test!', fields, files });
		try {
			if (!fields.data) {
				delete_file(filePath);
				return next(new ErrorHandler(400, config.missing_fields));
			}
			const data = JSON.parse(fields.data), filename = filePath.replace(uploadDir, '');
			// delete_file(filePath);
			let oldAudio = '', field = '';
			if (data.audioType == 'audio') {
				field = 'audio_path';
				oldAudio = data.old_audio_path;
			} else {
				field = 'sample_response';
				oldAudio = data.old_sample_response;
			}			
			if (oldAudio && fs.existsSync(uploadDir + oldAudio)) { delete_file(uploadDir + oldAudio); }
			// return res.json({ success: false, message: 'asdasd!', files, fields, ifExist, uploadDir, filePath, dialogue });
			const result = await MockDialogueSegments.update({ [field]: filename }, { where: { id: data.segmentId, is_deleted: false } });
			return res.json({ success: true, message: 'Uploaded dialogue audio successfully!', data: { filename } });
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
 * Delete single audio segment from mock test dialogue
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_audio_segment = async (req, res, next) => {
	const segmentId = req.params.id;
	if (!segmentId) { next(new ErrorHandler(400, 'Missing audio segment IDs')); }
	
	try {
		const segment = await MockDialogueSegments.findOne({ where: { id: segmentId, is_deleted: false } });
		// return res.json({ success: false, message: 'Dialogue deleted successfully!', segment });
		if (fs.existsSync(uploadDir + segment.audio_path)) { delete_file(uploadDir + segment.audio_path); }
		if (fs.existsSync(uploadDir + segment.sample_response)) { delete_file(uploadDir + segment.sample_response); }

		const result = await MockDialogueSegments.update({ is_deleted: true }, { where: { id: segmentId } });
		return res.json({ success: true, message: 'Dialogue segment deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Delete dialogue
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_dialogue = async (req, res, next) => {
	const dialogueId = req.params.id;
	if (!dialogueId) { next(new ErrorHandler(400, 'Missing delete IDs')); }
	
	try {
		const mockDialogue = await MockTestDialogues.findOne({
			attributes: [ 'id', 'start_audio', 'end_audio', 'is_deleted' ],
			where: { id: dialogueId, is_deleted: false },
			include: {
				model: MockDialogueSegments,
				where: { is_deleted: false },
			}
		});
		if (mockDialogue.start_audio && fs.existsSync(uploadDir + mockDialogue.start_audio)) { delete_file(uploadDir + mockDialogue.start_audio); }
		if (mockDialogue.end_audio && fs.existsSync(uploadDir + mockDialogue.end_audio)) { delete_file(uploadDir + mockDialogue.end_audio); }

		mockDialogue.mock_dialogue_segments.forEach(segment => {
			if (fs.existsSync(uploadDir + segment.audio_path)) { delete_file(uploadDir + segment.audio_path); }
			if (fs.existsSync(uploadDir + segment.sample_response)) { delete_file(uploadDir + segment.sample_response); }
		});
		const result = await MockTestDialogues.update({ is_deleted: true }, { where: { id: dialogueId } });
		await MockDialogueSegments.update({ is_deleted: true }, { where: { dialogue_id: dialogueId } });
		return res.json({ success: true, message: 'Dialogue deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};


/**
 * Delete mock test
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_mock_tests = async (req, res, next) => {
	const request = req.body;
	if (!request.deleteIds) { next(new ErrorHandler(400, 'Missing delete IDs')); }

	try {
		const dialogues = await MockTestDialogues.findAll({
			where: { mock_test_id: { [Op.in]: request.deleteIds } },
		});

		const deleteDialogueIds = dialogues.map(dialogue =>  dialogue.id);
		const audioSegments = await MockDialogueSegments.findAll({
			where: { dialogue_id: { [Op.in]: deleteDialogueIds }, is_deleted: false },
			// logging: console.log
		});
		dialogues.forEach(dialogue => {
			if (dialogue.start_audio && fs.existsSync(uploadDir + dialogue.start_audio)) { delete_file(uploadDir + dialogue.start_audio); }
			if (dialogue.end_audio && fs.existsSync(uploadDir + dialogue.end_audio)) { delete_file(uploadDir + dialogue.end_audio); }
		});

		audioSegments.forEach(segment => {
			if (fs.existsSync(uploadDir + segment.audio_path)) { delete_file(uploadDir + segment.audio_path); }
			if (fs.existsSync(uploadDir + segment.sample_response)) { delete_file(uploadDir + segment.sample_response); }
		});
		const result = await MockTests.update({ is_deleted: true },{ where: { id: { [Op.in]: request.deleteIds } } });
		await MockTestDialogues.update({ is_deleted: true },{ where: { id: { [Op.in]: deleteDialogueIds } } });
		await MockDialogueSegments.update({ is_deleted: true }, { where: { dialogue_id: { [Op.in]: deleteDialogueIds } } });

		return res.json({ success: true, message: 'Mock test deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};



module.exports = {
	get_mock_test_languages,
	get_mock_tests,
	save_mock_test,
	get_mock_test_details,
	delete_mock_tests,
	get_all_mock_tests,
	get_mock_test_questions,
	update_mock_details,
	update_dialogue,
	upload_audio,
	delete_audio_segment,
	delete_dialogue
};