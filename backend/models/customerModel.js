'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Customers = sequelize.define('customers', {
	id					: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	user_id			: { type: Sequelize.INTEGER, allowNull: false, unique: true },
	customer_id	: { type: Sequelize.STRING, allowNull: false },
}, {
	timestamps: true
});

module.exports = Customers;