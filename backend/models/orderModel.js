'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Orders = sequelize.define('orders', {
	id						: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	user_id				: { type: Sequelize.INTEGER, allowNull: false },
	order_number	: { type: Sequelize.STRING(50), allowNull: false },
	total_quantity: { type: Sequelize.INTEGER, allowNull: false },
	subtotal			: { type: Sequelize.FLOAT, allowNull: false },
	tax						: { type: Sequelize.FLOAT, allowNull: true },
	discount			: { type: Sequelize.FLOAT, allowNull: true },
	total_price		: { type: Sequelize.FLOAT, allowNull: false },
	order_status	: { type: Sequelize.ENUM, values: ['ordered', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded'], defaultValue: 'ordered', allowNull: false },
	// is_deleted			: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, comment: "'0' for NOT ACTIVE and '1' for ACTIVE" },
}, {
	timestamps: true
});

module.exports = Orders;