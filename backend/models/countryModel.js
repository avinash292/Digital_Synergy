'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Countries = sequelize.define('countries', {
	id			: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	country	: { type: Sequelize.STRING(70), allowNull: false },
	iso2	: { type: Sequelize.STRING(2), allowNull: true },
	iso3	: { type: Sequelize.STRING(3), allowNull: true },
}, {
	timestamps: false
});

module.exports = Countries;