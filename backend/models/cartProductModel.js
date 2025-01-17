'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const CartProducts = sequelize.define('cart_products', {
	id						: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	cart_id				: { type: Sequelize.INTEGER, allowNull: false },
	product_id		: { type: Sequelize.INTEGER, allowNull: false },
	color_id			: { type: Sequelize.INTEGER, allowNull: true },
	layout_id			: { type: Sequelize.INTEGER, allowNull: true },
	shape_id			: { type: Sequelize.INTEGER, allowNull: true },
	size_id				: { type: Sequelize.INTEGER, allowNull: true },
	product_data	: { type: Sequelize.TEXT, allowNull: false },
	image_path		: { type: Sequelize.STRING(100), allowNull: true },
	pdf_path			: { type: Sequelize.STRING(100), allowNull: true },
	purchaseType	: { type: Sequelize.STRING(20), allowNull: false },
}, {
	timestamps: true
});

module.exports = CartProducts;