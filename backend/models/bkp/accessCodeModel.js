'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Videos = sequelize.define('access_codes', {
	id  		: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	code		: { type: Sequelize.STRING, allowNull: false },
	user_id		: { type: Sequelize.INTEGER, allowNull: false },
	plan_id		: { type: Sequelize.INTEGER, allowNull: false },
	valid_till	: { type: Sequelize.DATE, allowNull: false },
	is_used		: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false, comment: "'0' for NOT USED and '1' for USED" },
	is_active	: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true, comment: "'0' for NOT ACTIVE and '1' for ACTIVE" },
}, {
	timestamps: true
});

module.exports = Videos;