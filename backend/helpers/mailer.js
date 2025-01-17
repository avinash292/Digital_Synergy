'user strict';

const nodemailer = require('nodemailer');
const config = require('../config');

class Mailer {

	/**
	 * Constructor
	 */
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: config.smtp.host,
			port: config.smtp.port,
			secure: false, // true for 465, false for other ports
			auth: {
				user: config.smtp.user,
				pass: config.smtp.pass,
			}
		});
	};

	/**
	 * Send mail to users
	 * 
	 * @param {Object} mailDetails 
	 */
	async sendMail(mailDetails) {
		try {
			let info = await this.transporter.sendMail({
				from: '"' + config.smtp.fromAlias + '" <' + config.smtp.fromEmail + '>', // sender address
				to: mailDetails.to, // list of receivers
				subject: mailDetails.subject, // Subject line
				text: mailDetails.text, // plain text body
				html: mailDetails.html, // html body
				attachments: mailDetails.attachments || [], // Attachments if any
			});    
			console.log('Message sent: %s', info.messageId);
			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		} catch (error) {
			console.log("ERROR IN sendMail ==> ",error)
		}
	};

}

module.exports = Mailer;