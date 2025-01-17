'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const OrderProducts = sequelize.define('order_products', {
	id						: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	order_id			: { type: Sequelize.INTEGER, allowNull: false },
	product_id		: { type: Sequelize.INTEGER, allowNull: false },
	purchaseType	: { type: Sequelize.STRING(20), allowNull: false },
	quantity			: { type: Sequelize.INTEGER, allowNull: false },
	price 				: { type: Sequelize.FLOAT, allowNull: false },
	product_data	: { type: Sequelize.TEXT, allowNull: false },
	image_path		: { type: Sequelize.STRING(100), allowNull: true },
	pdf_path			: { type: Sequelize.STRING(100), allowNull: true },
}, {
	timestamps: true
});

module.exports = OrderProducts;