'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const VocabularyCategories = sequelize.define('vocabulary_categories', {
	id          : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name        : { type: Sequelize.STRING, allowNull: false },
	is_deleted	: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false, comment: "'0' for NOT DELETED and '1' for DELETED" },
}, {
	timestamps: true
});

module.exports = VocabularyCategories;