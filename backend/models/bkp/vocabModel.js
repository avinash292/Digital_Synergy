'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Vocab = sequelize.define('vocab', {
	id          : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	word        : { type: Sequelize.STRING, allowNull: false },
	translation : { type: Sequelize.STRING(500), allowNull: false },
	language_id : { type: Sequelize.INTEGER, allowNull: false },
	vocabulary_category_id: { type: Sequelize.INTEGER, allowNull: false },
}, {
	timestamps: true
});

module.exports = Vocab;