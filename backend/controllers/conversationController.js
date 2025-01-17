"user strict";
const { Op } = require('sequelize');
const IncomingForm = require("formidable").IncomingForm;
const fs = require("fs");
const config = require("../config");
const { ErrorHandler } = require("../helpers/errorhandler");
const { filterOutCart } = require("../helpers/commonHelper");
const Chat = require("../models/chatModel");


/**
 * save Chat
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const saveChat = async (req, res, next) => {
		const request = req.body;
		const userId = request.loginUser;
		try {
				if ( !request.loginUser || !request.id || !request.input ) {
					return next(new ErrorHandler(400, 'Something wrong'));
				}
				conversation = {
					sender 	: request.loginUser,
					receiver  	: request.id,
					text  	: request.input,
					chatid  	: request.conversationId,
				};
				user = await Chat.create(conversation);
		} catch (error) {
				next(new ErrorHandler(200, config.common_err_msg, error));
		}
return res.json({ success: true, message: 'User connect request sent successfully!', data: { user_details: user } });
};
/**
 * get Chat
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getChat = async (req, res, next) => {
		const request = req.body;

		const chatid = request.conversationId;
		try {
			let result = await Chat.findAndCountAll({
				attributes: ['id', 'sender', 'receiver', 'text', 'chatid', 'createdAt', 'updatedAt'],
				where: { chatid: chatid }
			});
			return res.json({ success: true, message: '', data: result });
		} catch (error) {
				next(new ErrorHandler(200, config.common_err_msg, error));
		}
};
/**
 * get Chat
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getConversationId = async (req, res, next) => {
		const request = req.body;

		const loginUser = request.loginUser;
		const id = request.id;


		try {
			const conversationId=parseInt(loginUser+""+id)
			const conversationId1=parseInt(id+""+loginUser)
			let chatid=""
			let result = await Chat.findOne({
				attributes: ['chatid'],
				where: {
        [Op.or]: [
          { chatid: conversationId }, // Condition 1: loginUser is sender, id is receiver
          { chatid: conversationId1 }  // Condition 2: id is sender, loginUser is receiver
        ]
      }
			});
			if (!result || result.chatid == null || result.chatid === undefined || result.chatid.length === 0) {
					chatid = "notfound";
	    } else {
	      	chatid = result.chatid;
	    }
			return res.json({ success: true, message: '', conversationId: chatid });
		} catch (error) {
				next(new ErrorHandler(200, config.common_err_msg, error));
		}
};
module.exports = {
	saveChat,
	getChat,
	getConversationId,
};
