'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const UserMockTests = sequelize.define('user_mock_tests', {
	id			: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	user_id		: { type: Sequelize.INTEGER, allowNull: false },
	mock_test_id: { type: Sequelize.INTEGER, allowNull: false },
	title		: { type: Sequelize.STRING, allowNull: false },
	language_id	: { type: Sequelize.INTEGER, allowNull: false },
	time_taken	: { type: Sequelize.TIME, allowNull: false },
	feedback	: { type: Sequelize.TEXT, allowNull: true },
}, {
	timestamps: true
});

module.exports = UserMockTests;