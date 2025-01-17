'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Sizes = sequelize.define('sizes', {
	id					: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name				: { type: Sequelize.STRING(100), allowNull: false },
	label				: { type: Sequelize.STRING(100), allowNull: false },
	price				: { type: Sequelize.INTEGER, allowNull: false },
	pdf_price		: { type: Sequelize.INTEGER, allowNull: false },
	currency		: { type: Sequelize.STRING(20), allowNull: false },
	class		    : { type: Sequelize.STRING(50), allowNull: false },
	product_id	: { type: Sequelize.INTEGER, allowNull: false },
	is_active	: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true, comment: "'0' for NOT ACTIVE and '1' for ACTIVE" },
}, {
	timestamps: true
});

module.exports = Sizes;