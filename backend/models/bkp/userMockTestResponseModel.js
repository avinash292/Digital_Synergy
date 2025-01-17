'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const UserMockTestResponses = sequelize.define('user_mock_test_responses', {
	id				  : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	user_mock_test_id : { type: Sequelize.INTEGER, allowNull: false },
	dialogue_id		  : { type: Sequelize.INTEGER, allowNull: false },
	segment_id		  : { type: Sequelize.INTEGER, allowNull: false },
	response		  : { type: Sequelize.STRING, allowNull: true },
}, {
	timestamps: true
});

module.exports = UserMockTestResponses;