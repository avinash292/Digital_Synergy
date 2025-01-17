'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Colors = sequelize.define('colors', {
	id							: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name						: { type: Sequelize.STRING(100), allowNull: false },
	label						: { type: Sequelize.STRING(100), allowNull: false },
	primary_color		: { type: Sequelize.STRING(20), allowNull: true },
	secondary_color	: { type: Sequelize.STRING(20), allowNull: true },
	tertiary_color	: { type: Sequelize.STRING(20), allowNull: true },
	outline_color		: { type: Sequelize.STRING(20), allowNull: true },
	text_color			: { type: Sequelize.STRING(20), allowNull: true },
	color_url				: { type: Sequelize.STRING(100), allowNull: true },
	image						: { type: Sequelize.STRING(100), allowNull: true },
	product_id			: { type: Sequelize.INTEGER, allowNull: false },
	is_active   		: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, comment: "'0' for NOT ACTIVE and '1' for ACTIVE" },
}, {
	timestamps: true
});

module.exports = Colors;