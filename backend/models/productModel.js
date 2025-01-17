"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../db");

const Products = sequelize.define(
	"products",
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		name: { type: Sequelize.STRING, allowNull: false },
		label: { type: Sequelize.STRING, allowNull: false },
		is_active: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
			defaultValue: true,
			comment: "'0' for NOT ACTIVE and '1' for ACTIVE",
		},
		is_deleted: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
			defaultValue: false,
			comment: "'0' for NOT DELETED and '1' for DELETED",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = Products;
