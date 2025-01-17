'user strict';

const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');

const config 			= require('../config');
const { ErrorHandler } 	= require('../helpers/errorhandler');
const { Op, fn, col, where } = require('sequelize');
const Dialogues			= require('../models/dialogueModel');
const DialogueSegments	= require('../models/dialogueSegmentsModel');
const Languages 		= require('../models/languageModel');
const PlanTypes			= require('../models/planTypeModel');
const UserPaidPlan		= require('../models/userPaidPlanModel');
const moment			= require('moment');
const uploadDir			= 'assets/audio_files/';

/**
 * Fetch language listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_dialogue_languages = async (req, res, next) => {
	try {
		let result = await Languages.findAll({
			attributes: ['id', 'name', 'label', [fn('COUNT', col('dialogues.id')), 'dialogue_count'] ],
			group: ['id'],
			include: {
				model: Dialogues,
				attributes: [],
				on: {
					col1: where(col("dialogues.language_id"), "=", col("languages.id")),
					col2: where(col("dialogues.is_deleted"), "=", false)
				},
			},
			// logging: console.log
		});
		return res.json({ success: true, message: 'Fetched dialogue languages successfully!', data: { dialogue_languages: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch language listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_dialogues = async (req, res, next) => {
	// const request = req.body;
	if (!req.body.languageId) { next(new ErrorHandler(400, 'Missing language ID!')); }

	let request = {};
	request.orderBy    = (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'id';
	request.order   	= (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC';
	request.pageSize 	= (req.body.pageSize !== undefined) ? req.body.pageSize : 10;
	request.pageOffset 	= (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0;
	request.searchText 	= (req.body.searchText !== undefined) ? req.body.searchText : '';
	request.languageId 	= req.body.languageId;

	let order = [request.orderBy, request.order];
	if (request.orderBy === 'name') { 
		order = ['plan_type', request.orderBy, request.order];
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
		let result = await Dialogues.findAndCountAll({
			where: { ...likeSearch, language_id: request.languageId, is_deleted: false },
			include: {
				model: PlanTypes,
				required: true,
				attributes: [ 'id', 'name' ],
				// as: 'plan',
			},
			order: [order],
			offset: request.pageOffset,
			limit: request.pageSize,
			// logging: console.log,
		});
		return res.json({ success: true, message: 'Fetched video library successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add dialogue
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const save_dialogue = async (req, res, next) => {
	let form = new IncomingForm();
	
	form.uploadDir = uploadDir;		//set upload directory
	form.keepExtensions = true;		//keep file extension
	
	form.parse(req, async (err, fields, files) => {
		if (err) { return next(new ErrorHandler(500, config.common_err_msg, err)); }
		if (!fields.title || !fields.audio_segments) {
			delete_uploaded_files(files);
			return next(new ErrorHandler(400, config.missing_fields));
		}
		const audioSegments = JSON.parse(fields.audio_segments);
		/* const validExtensions = ['csv', 'xls', 'xlsx'];
		if (!validExtensions.includes(ext)) {
			delete_file(filePath);
			return res.json({ success: false, message: 'Invalid File Format' });
		} */
		try {
			let { title, plan_type_id, language_id, type, description, id,start_transcript, end_transcript } = fields;
			title = title.trim();
			let dialogueId = (type == 'edit' && id !== undefined) ? id : false;
			let ifExist = await check_if_dialogue_exist(title, language_id, dialogueId, next);
			// return res.json({ success: false, message: 'asdasd!', files, fields, ifExist });
			if (ifExist) {
				delete_uploaded_files(files);
				return res.json({ success: false, message: 'Dialogue title already exists!' });
			}
			const dialogue = { title, plan_type_id, description, language_id, start_audio: files.start_audio.path.replace(uploadDir,''), end_audio: files.end_audio.path.replace(uploadDir,''), start_transcript, end_transcript };
			// return res.json({ success: false, message: 'asdasd!', files, fields, ifExist, uploadDir, dialogue, audioSegments });
			const result = await Dialogues.create(dialogue);
			dialogueId = result.id;
			// dialogueId = 1;
			const insertResult = await insert_audio_segments(dialogueId, audioSegments, files, next);
			return res.json({ success: true, message: 'Dialogue added successfully!' });
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
		return await DialogueSegments.bulkCreate(segments);
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

const check_if_dialogue_exist = async (title, languageId, dialogueId, next) => {
	try {
		let where = { title, language_id: languageId, is_deleted: false };
		if (dialogueId) {
			where = { ...where, id: { [Op.not]: dialogueId } }
		}
		let result = await Dialogues.findOne({ where }); // , logging: console.log
		// console.log(result);
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const get_dialogue_details = async (req, res, next) => {
	const dialogueId = parseInt(req.params.id);
	try {
		let result = await Dialogues.findOne({
			where: { id: dialogueId, is_deleted: false },
			include: {
				model: DialogueSegments,
				required: true,
			},
			order: [['dialogue_segments', 'sort_index', 'ASC']],
			// logging: console.log
		});
		return res.json({ success: true, message: 'Fetched dialogue details successfully!', data: { dialogue_details: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update dialogue
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

		try {
			if (!fields.data) { delete_file(filePath); return next(new ErrorHandler(400, config.missing_fields)); }
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
			const result = await DialogueSegments.update({ [field]: filename }, { where: { id: data.segmentId } });
			return res.json({ success: true, message: 'Uploaded dialogue audio successfully!', result, files, data, field, filename });
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
		const request = JSON.parse(fields.data);
		/* const validExtensions = ['csv', 'xls', 'xlsx'];
		if (!validExtensions.includes(ext)) {
			delete_file(filePath);
			return res.json({ success: false, message: 'Invalid File Format' });
		} */
		if (!request.title || !request.id || !request.language_id) {
			delete_uploaded_files(files);
			next(new ErrorHandler(400, config.missing_fields));
		}
		request.title = request.title.trim();

		try {		
			let ifExist = await check_if_dialogue_exist(request.title, request.language_id, request.id, next);
			if (ifExist) {
				delete_uploaded_files(files);
				return res.json({ success: false, message: 'Dialogue title shoukd be unique!' });
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
			// delete_uploaded_files(files);
			// return res.json({ success: false, message: 'Fetched Video successfully!', request, ifExist, fields, files });
			let dialogue = { title: request.title, plan_type_id: request.plan_type_id, description: request.description, start_transcript: request.start_transcript, end_transcript: request.end_transcript };
			if (start_audio) { dialogue = { ...dialogue, start_audio }; }
			if (end_audio) { dialogue = { ...dialogue, end_audio }; }
			const result = await Dialogues.update(dialogue, { where: { id: request.id } });
			await update_audio_segments(request.audioSegments, next);
			const insertResult = await insert_audio_segments(request.id, request.newSegments, files, next);
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
				await DialogueSegments.update(segment, { where: { id: segmentId } });
			}
		}
		return true;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Delete mutiple dialogue
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_dialogue = async (req, res, next) => {
	const request = req.body;
	if (!request.deleteIds) { next(new ErrorHandler(400, 'Missing delete IDs')); }
	
	try {
		let audioSegments = await DialogueSegments.findAll({
			where: { dialogue_id: { [Op.in]: request.deleteIds } },
			// logging: console.log
		});
		audioSegments.forEach(segment => {
			if (fs.existsSync(uploadDir + segment.audio_path)) { delete_file(uploadDir + segment.audio_path); }
			if (fs.existsSync(uploadDir + segment.sample_response)) { delete_file(uploadDir + segment.sample_response); }
		});
		const result = await Dialogues.update({ is_deleted: true },{ where: { id: { [Op.in]: request.deleteIds } } });
		await DialogueSegments.destroy({ where: { dialogue_id: { [Op.in]: request.deleteIds } } });
		return res.json({ success: true, message: 'Dialogue deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch audio dialogues according to selected languages and user plan [APP]
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_audio_dialogues = async (req, res, next) => {
	try {
		const userId = req.user_id;
		if (!req.body.type) { next(new ErrorHandler(400, 'Dialogue Type is missing!')); }
		const request = {
			pageSize 	: (req.body.pageSize !== undefined) ? req.body.pageSize : 10,
			pageOffset 	: (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0,
			language_id : req.body.language_id,
			type		: req.body.type.toLowerCase(),
		};
		if (request.type == 'comprehensivematerial') {
			const userPaidPlan = await check_user_paid_plan(userId, next);
			if (!userPaidPlan) {
				return res.json({ success: true, message: 'Need paid plan to access comprehensive practice material', data: { paid_plan_required: true } });
			}
		}
		const result = await Dialogues.findAndCountAll({
			attributes: [ 'id', 'title', 'description', 'language_id','start_audio','end_audio', 'start_transcript', 'end_transcript' ],
			where: { language_id: request.language_id, is_deleted: false },
			include: {
				model: PlanTypes,
				attributes: [ 'id', 'name' ],
				required: true,
				where: { name: request.type == 'comprehensivematerial' ? 'paid' : 'free' },
			},
			order: [['title', 'ASC']],
			offset: request.pageOffset,
			limit: request.pageSize,
			// limit: (userPaidPlanId) ? null : config.free_vocab_limit,
			// raw: true,
			// logging: console.log
		});
		return res.json({ success: true, message: 'Fetched dialgues successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const check_user_paid_plan = async (userId, next) => {
	try {
		const currentDateTime = moment().toDate();
		let result = await UserPaidPlan.findOne({
			where: { user_id: userId, end_date: { [Op.gte]: currentDateTime }, is_active: true }
		});
		return result;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));		
	}
};


/**
 * Fetch dialogue and audio segments (APP)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_dialogue = async (req, res, next) => {
	const dialogueId = parseInt(req.params.id), userId = req.user_id, request = req.body;
	if(!request.pageFrom) { return next(new ErrorHandler(400, config.missing_fields)); }
	try {
		if (request.pageFrom.toLowerCase() == 'comprehensivematerial') {
			const userPaidPlan = await check_user_paid_plan(userId, next);
			if (!userPaidPlan) {
				return res.json({ success: true, message: 'Need paid plan to access comprehensive practice material', data: { paid_plan_required: true } });
			}
		}
		const result = await Dialogues.findOne({
			where: { id: dialogueId, language_id: request.language_id },
			include: [{
				model: PlanTypes,
				attributes: [ 'id', 'name' ],
				required: true,
				where: { name: request.pageFrom.toLowerCase() == 'comprehensivematerial' ? 'paid' : 'free' },
			}, {
				model: DialogueSegments,
				required: true,
			}],
			order: [['dialogue_segments', 'sort_index', 'ASC']],
		});
		const descriptionAudios = {
			start: {
				audio_path: result.start_audio ? result.start_audio : null,
				transcript: result.start_transcript ? result.start_transcript : null
			},
			end: {
				audio_path: result.end_audio ? result.end_audio : null,
				transcript: result.end_transcript ? result.end_transcript : null
			}
		};
		result.setDataValue('description_audios', descriptionAudios);
		res.json({ success: true, message: 'Fetched dialogue successfully!', data: { dialogue: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};



const delete_audio_segment = async (req, res, next) => {
	const segmentId = req.params.id;
	if (!segmentId) { next(new ErrorHandler(400, 'Missing audio segment IDs')); }
	
	try {
		const segment = await DialogueSegments.findOne({ where: { id: segmentId } });
		// return res.json({ success: false, message: 'Dialogue deleted successfully!', segment });
		if (fs.existsSync(uploadDir + segment.audio_path)) { delete_file(uploadDir + segment.audio_path); }
		if (fs.existsSync(uploadDir + segment.sample_response)) { delete_file(uploadDir + segment.sample_response); }

		const result = await DialogueSegments.destroy({ where: { id: segmentId } });
		return res.json({ success: true, message: 'Dialogue segment deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};


module.exports = {
	get_dialogue_languages,
	get_dialogues,
	save_dialogue,
	get_dialogue_details,
	upload_audio,
	update_dialogue,
	delete_dialogue,
	get_audio_dialogues,
	get_dialogue,
	delete_audio_segment,
};