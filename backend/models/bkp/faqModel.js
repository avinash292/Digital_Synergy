'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Faqs = sequelize.define('faqs', {
	id          : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	question    : { type: Sequelize.TEXT, allowNull: false },
	answer      : { type: Sequelize.TEXT, allowNull: false },
	is_deleted	: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false, comment: "'0' for NOT DELETED and '1' for DELETED" },
}, {
	timestamps: true
});

module.exports = Faqs;