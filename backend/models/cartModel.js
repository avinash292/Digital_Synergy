'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Cart = sequelize.define('cart', {
	id					: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	user_id			: { type: Sequelize.INTEGER, allowNull: false },
	subtotal		: { type: Sequelize.FLOAT, allowNull: false },
	tax					: { type: Sequelize.FLOAT, allowNull: true },
	discount		: { type: Sequelize.FLOAT, allowNull: true },
	total_price	: { type: Sequelize.FLOAT, allowNull: false },
}, {
	timestamps: true
});

module.exports = Cart;