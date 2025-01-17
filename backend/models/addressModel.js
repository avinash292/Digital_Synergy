'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Addresses = sequelize.define('addresses', {
	id					: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	user_id			: { type: Sequelize.INTEGER, allowNull: false },
	order_id		: { type: Sequelize.INTEGER, allowNull: false },
	type				: { type: Sequelize.ENUM, values: ['shipping', 'billing', 'user_added'], defaultValue: 'billing', allowNull: false },
	full_name		: { type: Sequelize.STRING, allowNull: false },
	email				: { type: Sequelize.STRING, allowNull: false },
	mobile			: { type: Sequelize.STRING, allowNull: false },
	address			: { type: Sequelize.TEXT, allowNull: false },
	city				: { type: Sequelize.STRING, allowNull: false },
	state				: { type: Sequelize.STRING, allowNull: false },
	country			: { type: Sequelize.STRING, allowNull: false },
	postal_code	: { type: Sequelize.STRING, allowNull: false },
	is_deleted	: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, comment: "'0' for NOT ACTIVE and '1' for ACTIVE" },
}, {
	timestamps: true
});

module.exports = Addresses;