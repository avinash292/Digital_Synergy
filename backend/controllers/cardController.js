"user strict";

const config = require("../config");
const { ErrorHandler } = require("../helpers/errorhandler");
const { Op } = require("sequelize");
const path = require("path");
const Card = require("../models/cardModels");
const multer = require("multer");
const fs = require("fs");

// Multer storage configuration
const storage = multer.diskStorage({
	// destination: (req, file, cb) => {
	// 	cb(null, path.join(__dirname, "../assets/layouts/images"));
	// },
	// filename: (req, file, cb) => {
	// 	cb(null, Date.now() + "-" + file.originalname);
	// },
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
	// if (file.mimetype.startsWith("image/")) {
	// 	cb(null, true);
	// } else {
	// 	cb(new Error("Only image files are allowed."), false);
	// }
};

// Multer upload instance
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
});

/**
 * Add or update card
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const save_Card = async (req, res, next) => {
	try {
		const requestData = req.body;
		console.log(requestData);
		if (!requestData.cardName) {
			return res.json({
				success: false,
				message: "Card name Missing!",
			});
		}

		// Trim the card name
		requestData.cardName = requestData.cardName.trim();

		// Prepare card data object to be inserted or updated in the database
		const cardData = {
			user_id: requestData.user_id,
			cardName: requestData.cardName,
			changeLayout: requestData.changeLayout,
			coverImage: requestData.coverImageFile || null,
			logoImage: requestData.logoImageFile || null,
			profileImage: requestData.profileImageFile || null,
			cardImage: requestData.cardImage || null,
			listData: requestData.listData,
			selectedThemeColor: requestData.selectedThemeColor || null,
		};

		let result;
		if (requestData.type === "edit") {
			// If type is "edit", update existing data
			if (!requestData.cardId) {
				return res.json({
					success: false,
					message: "Card ID Missing for edit operation!",
				});
			}
			// Update the card in the database based on cardId
			result = await Card.update(cardData, {
				where: { id: requestData.cardId },
			});
			if (!result[0]) {
				return res.json({
					success: false,
					message: "Card not found for edit operation!",
				});
			}
		} else if (requestData.type === "add") {
			// If type is "add", create new data
			result = await Card.create(cardData);
		} else {
			return res.json({
				success: false,
				message: "Invalid operation type!",
			});
		}

		return res.json({
			success: true,
			message:
				requestData.type === "add"
					? "Card created successfully!"
					: "Card updated successfully!",
			result,
		});
	} catch (error) {
		next(new ErrorHandler(500, "Error saving card", error));
	}
};

/**
 * Check if name exists
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkCardExist = async (req, res, next) => {
	try {
		// Check if card name already exists
		const requestData = req.body;
		const cardName = requestData.cardName;
		let where = { cardName };
		const result = await Card.findOne({ where });
		if (result) {
			return res.json({
				success: true,
				message: "Card name already exists!",
			});
		} else {
			// Card name doesn't exist
			return res.json({
				success: false,
				message: "Card name available!",
			});
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add or update card
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllUserBusinessCardList = async (req, res, next) => {
	const request = req.body;
	const userId = request.loginUser;
	try {
		let result = await Card.findAll({
			where: { user_Id: userId }, // Assuming userId is the column name in the Businesscard table
			raw: true,
		});
		return res.json({
			success: true,
			message: "Business cards retrieved successfully!",
			result,
		});
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add or update card
 *
 * @param {*} req
 * @param {*} res
 */
// Controller function to get a business card by ID
const getBusinessCardById = async (req, res) => {
	try {
		const { id } = req.params;
		// Find the card by ID in the database
		const card = await Card.findByPk(id);
		if (!card) {
			return res
				.status(404)
				.json({ success: false, message: "Card not found" });
		}
		// Return the card data if found
		res.status(200).json({ success: true, result: card });
	} catch (error) {
		console.error("Error fetching business card:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
/**
 * Edit a business card
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const editBusinessCard = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedData = req.body; // Data to update

		// Check if the card exists
		const card = await Card.findByPk(id);
		if (!card) {
			return res.status(404).json({
				success: false,
				message: "Card not found",
			});
		}

		// Update the card data
		await card.update(updatedData);

		return res.json({
			success: true,
			message: "Card updated successfully",
			result: card,
		});
	} catch (error) {
		next(new ErrorHandler(500, "Error updating card", error));
	}
};

/**
 * Delete a business card
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteBusinessCard = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Check if the card exists
		const card = await Card.findByPk(id);
		if (!card) {
			return res.status(404).json({
				success: false,
				message: "Card not found",
			});
		}

		// Retrieve image file paths from the card object
		const { coverImage, logoImage, profileImage } = card;

		// Delete the card
		await card.destroy();

		// Delete the associated image files from the server's file system
		if (
			coverImage &&
			fs.existsSync(
				path.join(
					__dirname,
					"..",
					"assets",
					"layouts",
					"images",
					coverImage
				)
			)
		) {
			fs.unlinkSync(
				path.join(
					__dirname,
					"..",
					"assets",
					"layouts",
					"images",
					coverImage
				)
			);
		}
		if (
			logoImage &&
			fs.existsSync(
				path.join(
					__dirname,
					"..",
					"assets",
					"layouts",
					"images",
					logoImage
				)
			)
		) {
			fs.unlinkSync(
				path.join(
					__dirname,
					"..",
					"assets",
					"layouts",
					"images",
					logoImage
				)
			);
		}
		if (
			profileImage &&
			fs.existsSync(
				path.join(
					__dirname,
					"..",
					"assets",
					"layouts",
					"images",
					profileImage
				)
			)
		) {
			fs.unlinkSync(
				path.join(
					__dirname,
					"..",
					"assets",
					"layouts",
					"images",
					profileImage
				)
			);
		}

		return res.json({
			success: true,
			message: "Card deleted successfully",
		});
	} catch (error) {
		next(new ErrorHandler(500, "Error deleting card", error));
	}
};

module.exports = {
	save_Card,
	getAllUserBusinessCardList,
	checkCardExist,
	editBusinessCard,
	deleteBusinessCard,
	getBusinessCardById,
	upload, // Export Multer upload middleware for use in routes
};
