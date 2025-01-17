"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../db");

// Define the Card model
const Card = sequelize.define(
	"businesscard",
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		user_id: { type: Sequelize.INTEGER, allowNull: false },
		cardName: { type: Sequelize.STRING, allowNull: false },
		changeLayout: { type: Sequelize.STRING, allowNull: true },
		coverImage: { type: Sequelize.STRING, allowNull: true },
		logoImage: { type: Sequelize.STRING, allowNull: true },
		profileImage: { type: Sequelize.STRING, allowNull: true },
		cardImage: { type: Sequelize.STRING, allowNull: true },
		listData: { type: Sequelize.JSON, allowNull: true },
		selectedThemeColor: { type: Sequelize.STRING, allowNull: true },
		createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
		updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	},
	{
		timestamps: false, // Set timestamps to false to disable createdAt and updatedAt fields
	}
);

// Export the Card model
module.exports = Card;
