'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const ExamMemories = sequelize.define('exam_memories', {
	id			: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	title		: { type: Sequelize.STRING, allowNull: false },
	description	: { type: Sequelize.STRING },
	language_id : { type: Sequelize.INTEGER, allowNull: false },
	session		: { type: Sequelize.STRING, allowNull: true },
	start_audio  	: { type: Sequelize.STRING, allowNull: false },
	end_audio  	: { type: Sequelize.STRING, allowNull: false },
	start_transcript  	: { type: Sequelize.STRING, allowNull: false },
	end_transcript  	: { type: Sequelize.STRING, allowNull: false },
	is_deleted	: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, comment: "'0' for NOT DELETED and '1' for DELETED" },
}, {
	timestamps: true
});

module.exports = ExamMemories;