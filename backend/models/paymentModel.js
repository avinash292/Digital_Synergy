'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Payments = sequelize.define('payments', {
	id						: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	user_id				: { type: Sequelize.INTEGER, allowNull: false },
	order_id			: { type: Sequelize.INTEGER, allowNull: false },
	charge_id			: { type: Sequelize.STRING, allowNull: false },
	currency			: { type: Sequelize.STRING(10) },
	amount				: { type: Sequelize.FLOAT },
	payment_method: { type: Sequelize.STRING, allowNull: true },
}, {
	timestamps: true
});

module.exports = Payments;