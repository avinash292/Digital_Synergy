'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Enquiries = sequelize.define('enquiries', {
	id      : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	user_id : { type: Sequelize.INTEGER, allowNull: false },
	enquiry : { type: Sequelize.TEXT, allowNull: false },
}, {
	timestamps: true
});

module.exports = Enquiries;