'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const ConnectUser = sequelize.define('connectUser', {
	id              : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, trim: true },
	login_user_id         : { type: Sequelize.STRING(120), allowNull: false },
	to_connect_user_id    : { type: Sequelize.STRING(120), allowNull: true },
	login_user_firstName  : { type: Sequelize.STRING(120), allowNull: false },
	login_user_LastName   : { type: Sequelize.STRING(120), allowNull: false },
	connect_request_status    : { type: Sequelize.STRING(120), allowNull: true },
}, {
	timestamps: true
});

module.exports = ConnectUser;
