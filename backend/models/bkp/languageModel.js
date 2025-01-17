'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');


const Languages = sequelize.define('languages', {
	id      : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name    : { type: Sequelize.STRING, unique: true, allowNull: false },
	label   : { type: Sequelize.STRING, allowNull: false },
}, {
	timestamps: true
});

module.exports = Languages;