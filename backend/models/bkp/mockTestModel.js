'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const MockTests = sequelize.define('mock_tests', {
	id				: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	title			: { type: Sequelize.STRING, allowNull: false },
	test_duration	: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 20, comment: "In minutes" },
	language_id		: { type: Sequelize.INTEGER, allowNull: false },
	is_deleted		: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false, comment: "'0' for NOT DELETED and '1' for DELETED" },
}, {
	timestamps: true
});

module.exports = MockTests;