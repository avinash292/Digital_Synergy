'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const MockDialogueSegments = sequelize.define('mock_dialogue_segments', {
	id				: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	dialogue_id		: { type: Sequelize.INTEGER, allowNull: false },
	name			: { type: Sequelize.STRING },
	audio_path  	: { type: Sequelize.STRING, allowNull: false },
	transcript  	: { type: Sequelize.TEXT, allowNull: false },
	sample_response	: { type: Sequelize.STRING },
	sample_transcript: { type: Sequelize.TEXT },
	sort_index		: { type: Sequelize.INTEGER },
	is_deleted		: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false, comment: "'0' for NOT DELETED and '1' for DELETED" },
}, {
	timestamps: true
});

module.exports = MockDialogueSegments;