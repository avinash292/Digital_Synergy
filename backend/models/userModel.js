'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Users = sequelize.define('users', {
	id              : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, trim: true },
	first_name      : { type: Sequelize.STRING(120), allowNull: false },
	last_name       : { type: Sequelize.STRING(120), allowNull: true },
	password				: { type: Sequelize.STRING, allowNull: true },
	email           : { type: Sequelize.STRING, unique: true, allowNull: false },
	mobile					: { type: Sequelize.STRING(50), allowNull: true },
	source					: { type: Sequelize.STRING(20), allowNull: true, comment: "From where user have registered" },
	role						: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'user' },
	profile_image   : { type: Sequelize.STRING, allowNull: true },
	forgot_pass_hash: { type: Sequelize.STRING, allowNull: true },
	connects				: { type: Sequelize.TEXT, allowNull: true },
	profileVisibility : { type: Sequelize.Sequelize.STRING(120), allowNull: false, defaultValue: 'public' },
	forgot_pass_date: { type: Sequelize.DATE, allowNull: true },
	is_deleted		: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, comment: "'0' for NOT DELETED and '1' for DELETED" },
	profileVisibility: { type: Sequelize.STRING, allowNull: true, defaultValue: 'public' }, // Add this line
}, {
	timestamps: true
});

module.exports = Users;
