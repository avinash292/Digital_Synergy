'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db');

const Plans = sequelize.define('plans', {
	id          : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name		: { type: Sequelize.STRING, allowNull: false },
	price       : { type: Sequelize.DECIMAL, allowNull: false },
	validity    : { type: Sequelize.INTEGER, allowNull: true, comment: "In days" },
	plan_type_id: { type: Sequelize.INTEGER, allowNull: false },
	description	: { type: Sequelize.TEXT, allowNull: false },
	// is_default  : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, comment: "'0' for NOT DEFAULT and '1' for DEFAULT" },
	include_mock_tests : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, comment: "'0' for NOT INCLUDED and '1' for INCLUDED" },
	include_in_app : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, comment: "'0' for NOT INCLUDED and '1' for INCLUDED" },
	is_active	: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, comment: "'0' for NOT ACTIVE and '1' for ACTIVE" },
	is_deleted	: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, comment: "'0' for NOT DELETED and '1' for DELETED" },
}, {
	timestamps: true
});

module.exports = Plans;