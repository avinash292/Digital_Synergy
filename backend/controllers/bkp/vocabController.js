'user strict';

const { Op, fn, col, literal } 	= require('sequelize');
const config 			= require('../config');
const moment			= require('moment');
const { ErrorHandler } 	= require('../helpers/errorhandler');
const Vocab 			= require('../models/vocabModel');
const Languages 		= require('../models/languageModel');
const VocabCategory 	= require('../models/vocabCategoryModel');
const UserPaidPlan		= require('../models/userPaidPlanModel');

/**
 * Fetch language listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_vocab_languages = async (req, res, next) => {
	try {
		let result = await Languages.findAll({
			attributes: ['id', 'name', 'label', [fn('COUNT', col('vocabs.id')), 'vocab_count'] ],
			group: ['id'],
			include: { model: Vocab, attributes: [] },
			// logging: console.log
		});
		return res.json({ success: true, message: 'Fetched vocabulary languages successfully!', data: { vocab_languages: result } });
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
const get_vocabulary = async (req, res, next) => {
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
	if (request.orderBy === 'vocab_category.name') {
		order = ['vocabulary_category', 'name', request.order];
	}

	const searchColumns = ['word', 'translation'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	try {
		let result = await Vocab.findAndCountAll({
			where: { ...likeSearch, language_id: request.languageId },
			include: {
				model: VocabCategory,
				required: true,
				attributes: [ 'id', 'name' ],
				where: { is_deleted: false }
			},
			order: [order],
			offset: request.pageOffset,
			limit: request.pageSize,
		});
		return res.json({ success: true, message: 'Fetched vocabulary successfully!', data: result });
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
const save_vocab = async (req, res, next) => {
	const request = req.body;
	if (!request.word || !request.translation || !request.vocabulary_category_id) { return next(new ErrorHandler(400, 'Missing required word or translation fields')); }
	
	try {
		request.word = request.word.trim();
		request.translation = request.translation.trim();
		const vocabId = (request.type == 'edit' && request.id !== undefined) ? request.id : false;
		// console.log("vocabId : ",vocabId);
		let ifExist = await check_if_vocab_exist(request.word, request.languageId, vocabId, next);
		if (ifExist) {
			return res.json({ success: false, message: 'Word already already exists in vocabulary!' });
		}
		const vocab = {
			word: request.word,
			translation: request.translation,
			language_id: request.languageId,
			vocabulary_category_id: request.vocabulary_category_id
		};
		// return res.json({ success: false, message: 'Fetched language successfully!', request, ifExist, vocab});
		if (request.type == 'add') {
			const result = await Vocab.create(vocab);
			return res.json({ success: true, message: 'Word added to vocabulary successfully!', result });
		} else {
			const result = await Vocab.update(vocab, { where: { id: request.id } });
			return res.json({ success: true, message: 'Word updated in vocabulary successfully!', result });
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const check_if_vocab_exist = async (word, languageId, vocabId, next) => {
	try {
		let where = { word, language_id: languageId };
		if (vocabId) {
			where = { ...where, id: { [Op.not]: vocabId } }
		}
		let result = await Vocab.findOne({ where }); // , logging: console.log
		// console.log(result);
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

const get_video_details = async (req, res, next) => {
	const videoId = parseInt(req.params.id);	
	try {
		let result = await Vocab.findOne({ where: { id: videoId, is_deleted: false } }); // , logging: console.log
		return res.json({ success: true, message: 'Vocabulary updated successfully!', data: { video_details: result, videoId } });
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
const delete_vocab = async (req, res, next) => {
	const request = req.body;
	if (!request.deleteIds) { next(new ErrorHandler(400, 'Missing delete IDs')); }
	// return res.json({ success: true, message: 'Fetched Video successfully!', request });

	try {
		const result = await Vocab.destroy({ where: { id: { [Op.in]: request.deleteIds } } });
		return res.json({ success: true, message: 'Word deleted from vocabulary successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Fetch vocabulary (APP)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_vocabulary_by_language = async (req, res, next) => {
	try {
		const userId = req.user_id;
		if (!req.body.selectedCategory) { next(new ErrorHandler(400, 'Vocabulary category is missing!')); }
		const request = {
			pageSize 	: (req.body.pageSize !== undefined) ? req.body.pageSize : 100,
			pageOffset 	: (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0,
			languageId	: req.body.languageId,
			vocabCategory: req.body.selectedCategory,
			requestedAlphabet: req.body.requestedAlphabet,
			fetchAlphabets: req.body.fetch_alphabets,
		};
		// console.log(request);
		let where = { language_id: request.languageId };
		if (request.vocabCategory !== 'all') {
			where = { ...where, vocabulary_category_id: request.vocabCategory.id }
		}
		let userPaidPlan = true, alphabets = [];
		let selectedAlphabet = request.requestedAlphabet;
		if (request.fetchAlphabets) {
			userPaidPlan = await check_user_paid_plan(userId, next);
			if (!userPaidPlan) {
				const freePlanResponse = await fetch_free_vocab(where, selectedAlphabet, next);
				// console.log(freePlanResponse);
				return res.json({ success: true, message: 'Fetched vocabulary successfully!', data: freePlanResponse });
			}

			alphabets = await get_vocab_alphabets(where, next);
			if (!alphabets || !alphabets.length) {
				return res.json({ success: true, message: 'Empty vocabulary!', data: { vocab: { rows: [], count: 0 }, alphabets: [], selected_alphabet: '' } });
			}
			if (!userPaidPlan) { alphabets = ['A']; }
			selectedAlphabet = (alphabets.includes(selectedAlphabet)) ? selectedAlphabet : alphabets[0];
		}
		where = {
			...where,
			word: (request.requestedAlphabet == '#') ? { [Op.regexp]: '^[^A-z]' } : { [Op.like]: selectedAlphabet + '%' }
		};

		let filters = {
			attributes: [ 'id', 'word', 'translation', 'vocabulary_category_id' ],
			where,
			order: [['word', 'ASC']],
			offset: request.pageOffset,
			limit: request.pageSize,
			// logging: console.log
		};
		if (!userPaidPlan) {
			filters = { ...filters, offset: 0, limit: config.free_vocab_limit }
		}
		let result = await Vocab.findAndCountAll(filters);
		if (!userPaidPlan) {
			result.count = (result.rows.length >= config.free_vocab_limit) ? config.free_vocab_limit : result.rows.length;
		}
		return res.json({ success: true, message: 'Fetched vocabulary successfully!', data: { vocab: result, alphabets, selected_alphabet: selectedAlphabet } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const fetch_free_vocab = async (where, selectedAlphabet, next) => {
	try {
		let filters = {
			attributes: [ 'id', 'word', 'translation', 'vocabulary_category_id' ],
			where,
			order: [['word', 'ASC']],
			offset: 0,
			limit: config.free_vocab_limit,
			raw: true,
			// logging: console.log
		};
		let result = await Vocab.findAll(filters);
		if (!result || !result.length) {
			return { vocab: { rows: [], count: 0 }, alphabets: [], selected_alphabet: '' };
		}
		const groupedVocabulary = await group_vocabulary(result);
		const alphabets = Object.keys(groupedVocabulary);
		selectedAlphabet = (alphabets.includes(selectedAlphabet)) ? selectedAlphabet : alphabets[0];
		return {
			vocab: { count: groupedVocabulary[selectedAlphabet].length, rows: groupedVocabulary[selectedAlphabet] },
			alphabets : alphabets,
			selected_alphabet: selectedAlphabet
		};
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));		
	}
};

const check_user_paid_plan = async (userId, next) => {
	try {
		const currentDateTime = moment().toDate();
		let result = await UserPaidPlan.findOne({
			attributes: ['id', 'name'],
			where: { user_id: userId, end_date: { [Op.gte]: currentDateTime }, is_active: true }
		});
		return result;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));		
	}
};

const get_vocab_alphabets = async (where, next) => {
	try {
		/*const result = await Vocab.findAll({
			attributes: [literal('SUBSTRING(word, 1, 1) as first_character')],
			where,
			raw: true,
			limit:5,
		});*/
		//const unique = [...new Set(result.map(item => item.first_character))]
		const result = await Vocab.findAll({
			attributes: [[fn('DISTINCT', literal('SUBSTRING(word FROM 1 FOR 1)')), 'first_character']],
			where,
			order: [[literal('first_character') , 'ASC']],
			raw: true,
		});
		
		return await group_charachters(result);
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));		
	}
};

/**
 * Group non alphabetical charracters if any
 * 
 * @param {*} data 
 */
const group_charachters = async (alphabets) => {
	let grouped = [], haveNonAlphabeticalChars = false;
	alphabets.forEach(item => {
		const letters = /^[A-Za-z]+$/;
		const firstChar = item.first_character.charAt(0);
		if (firstChar.match(letters) && !grouped.includes(firstChar.toUpperCase())) {
			grouped.push(firstChar.toUpperCase());
		} else {
			haveNonAlphabeticalChars = true;
		}
	});
	if (haveNonAlphabeticalChars) { grouped.push('#'); }
	return grouped;
};

/**
 * Groub vocabulary by 1st character
 * 
 * @param {*} data 
 */
const group_vocabulary = async (data) => {
	let groupedVocab = {};
	data.forEach(vocab => {
		const letters = /^[A-Za-z]+$/;
		const firstChar = vocab.word.charAt(0);
		if (firstChar.match(letters)) {
			if (groupedVocab[firstChar.toUpperCase()] === undefined) { groupedVocab[firstChar.toUpperCase()] = [] }
			groupedVocab[firstChar.toUpperCase()].push(vocab);
		} else {
			if (groupedVocab['#'] === undefined) { groupedVocab['#'] = [] }
			groupedVocab['#'].push(vocab);
		}
	});
	return groupedVocab;
};

module.exports = {
	get_vocab_languages,
	get_vocabulary,
	save_vocab,
	get_video_details,
	delete_vocab,
	get_vocabulary_by_language,
};