'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Videos = sequelize.define('videos', {
	id          : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	title       : { type: Sequelize.STRING, allowNull: false },
	description : { type: Sequelize.TEXT, allowNull: true },
	link        : { type: Sequelize.STRING, allowNull: false },
	is_active	: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true, comment: "'0' for NOT ACTIVE and '1' for ACTIVE" },
	type	: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0, comment: "'0' for tutorial video and '1' for dashboard" },
	is_deleted	: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false, comment: "'0' for NOT DELETED and '1' for DELETED" },
}, {
	timestamps: true
});

module.exports = Videos;