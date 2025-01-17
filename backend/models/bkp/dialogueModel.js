'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Dialogues = sequelize.define('dialogues', {
	id				: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	title			: { type: Sequelize.STRING, allowNull: false },
	description		: { type: Sequelize.STRING },
	language_id 	: { type: Sequelize.INTEGER, allowNull: false },
	plan_type_id	: { type: Sequelize.INTEGER, allowNull: false },
	start_audio 	: { type: Sequelize.STRING, allowNull: false },
	end_audio  		: { type: Sequelize.STRING, allowNull: false },
	start_transcript: { type: Sequelize.STRING, allowNull: false },
	end_transcript  : { type: Sequelize.STRING, allowNull: false },
	is_deleted		: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, comment: "'0' for NOT DELETED and '1' for DELETED" },
}, {
	timestamps: true
});

module.exports = Dialogues;