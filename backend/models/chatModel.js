'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Chat = sequelize.define('chat', {
	id					: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	sender			: { type: Sequelize.TEXT, allowNull: false },
	receiver		: { type: Sequelize.TEXT, allowNull: false },
	text		    : { type: Sequelize.TEXT, allowNull: false },
	chatid		  : { type: Sequelize.INTEGER, allowNull: false },
}, {
	timestamps: true
});

module.exports = Chat;
