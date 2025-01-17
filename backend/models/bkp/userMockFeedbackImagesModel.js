'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const userMockFeedbackImages = sequelize.define('user_mock_feedback_images', {
	id					: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	user_mock_test_id	: { type: Sequelize.INTEGER, allowNull: false },
	path				: { type: Sequelize.STRING, allowNull: false },
}, {
	timestamps: true
});

module.exports = userMockFeedbackImages;