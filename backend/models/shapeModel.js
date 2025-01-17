'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Shapes = sequelize.define('shapes', {
	id					: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name				: { type: Sequelize.STRING(100), allowNull: false },
	label				: { type: Sequelize.STRING(100), allowNull: false },
	image				: { type: Sequelize.STRING, allowNull: false },
	product_id	: { type: Sequelize.INTEGER, allowNull: false },
	is_active	: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true, comment: "'0' for NOT ACTIVE and '1' for ACTIVE" },
}, {
	timestamps: true
});

module.exports = Shapes;