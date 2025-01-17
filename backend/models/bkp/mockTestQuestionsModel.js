'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const MockTestQuestions = sequelize.define('mock_test_questions', {
	id			: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	mock_test_id: { type: Sequelize.INTEGER, allowNull: false },
	// dialogue_id : { type: Sequelize.INTEGER, allowNull: false },
}, {
	timestamps: true
});

module.exports = MockTestQuestions;