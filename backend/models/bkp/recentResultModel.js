'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const RecentResults = sequelize.define('recent_results', {
	id	    : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	path    : { type: Sequelize.STRING, allowNull: false },
}, {
	timestamps: true
});

module.exports = RecentResults;