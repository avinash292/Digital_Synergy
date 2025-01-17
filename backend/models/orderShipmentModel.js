'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const OrderShipments = sequelize.define('order_shipments', {
	id				  : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	order_id	  : { type: Sequelize.INTEGER, allowNull: false },
	shipping_id : { type: Sequelize.STRING, allowNull: true },
	shipping_url: { type: Sequelize.TEXT, allowNull: true },
	price       : { type: Sequelize.FLOAT, allowNull: true },
	is_active		: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true, comment: "'0' for NOT ACTIVE and '1' for ACTIVE" },
}, {
	timestamps: true
});

module.exports = OrderShipments;