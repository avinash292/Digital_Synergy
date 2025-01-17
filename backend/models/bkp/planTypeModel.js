'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const PlanTypes = sequelize.define('plan_types', {
	id  : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: Sequelize.STRING, allowNull: false, unique: true },
	is_default  : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, comment: "'0' for NOT DEFAULT and '1' for DEFAULT" },
}, {
	timestamps: true
});

module.exports = PlanTypes;