"use-strict";

const express = require("express");
const router = express.Router();

const usrCtrl = require("../controllers/userController");
const loginCtrl = require("../controllers/loginController");
const prodCtrl = require("../controllers/productController");
const cardCtrl = require("../controllers/cardController");
const cartCtrl = require("../controllers/cartController");
const checkCtrl = require("../controllers/checkoutController");
const orderCtrl = require("../controllers/orderController");
const chatCtrl = require("../controllers/conversationController");

// Auth
// router.post("/sendOtp", usrCtrl.send_otp);
router.post("/signup", usrCtrl.signup);
router.post("/social_login", usrCtrl.signup);
router.post("/login", loginCtrl.front_login);
router.post("/refresh_token", loginCtrl.front_refresh_token);
router.post("/forgot_password", usrCtrl.forgot_password);
router.get("/password/:hash", usrCtrl.check_password_hash);
router.post("/password/reset", usrCtrl.reset_password);

// PRODUCTS
router.get("/products", prodCtrl.get_all_products);
router.get("/products/:label", prodCtrl.get_product_details_by_label);

// // Businesscard
router.post(
	"/saveCard",
	cardCtrl.upload.fields([
		{ name: "coverImageFile", maxCount: 1 },
		{ name: "profileImageFile", maxCount: 1 },
		{ name: "logoImageFile", maxCount: 1 },
	]),
	cardCtrl.save_Card
);
router.post("/checkCardExist", cardCtrl.checkCardExist);
router.post("/userBusinessCardList", cardCtrl.getAllUserBusinessCardList);
router.get("/getBusinessCard/:id", cardCtrl.getBusinessCardById);
// Edit Business Card
router.put("/editBusinessCard/:id", cardCtrl.editBusinessCard);

// Delete Business Card
router.delete("/deleteBusinessCard/:id", cardCtrl.deleteBusinessCard);

// CART
router.route("/cart").post(cartCtrl.save_cart).get(cartCtrl.get_cart);
router.delete("/cart/:id/:pdfPath/:imgPath", cartCtrl.delete_cart_product);
router.get("/cart/:type", cartCtrl.get_cart);
// Network Connect List
router.post("/profiles", usrCtrl.getAllUsers);
router.post("/connectRequest", usrCtrl.connectRequest);
router.post("/connectNewUser", usrCtrl.connectNewUser);
router.post("/connectApproved", usrCtrl.connectApproved);
router.post("/connectDenied", usrCtrl.connectDenied);
router.post("/userConnectList", usrCtrl.userConnectList);
router.post("/disconnectUser", usrCtrl.disconnectUser);
router.post("/requestedUser", usrCtrl.requestedUser);

// Conversation (Chat)
router.post("/sendMessage", chatCtrl.saveChat);
router.post("/getConversation", chatCtrl.getChat);
router.post("/getConversationId", chatCtrl.getConversationId);
// CHECKOUT
router
	.route("/checkout")
	.post(checkCtrl.checkout)
	.get(checkCtrl.get_order_summary);
// router.delete("/cart/:id", cartCtrl.delete_cart_product);
// router.get("/cart/count", cartCtrl.get_cart_count);

// ORDERS
router.route("/orders").post(orderCtrl.get_all_orders);
router.route("/orders/:id").get(orderCtrl.get_order_details);

// COUNTRIES
router.get("/countries", checkCtrl.get_countries);

// PROFILE
router
	.route("/profile")
	.get(usrCtrl.get_user_profile)
	.put(usrCtrl.update_user_profile);
router.put("/profile/update_password", usrCtrl.update_user_password);
// 	.post(usrCtrl.update_user_profile)
// router.post("/profile/image", usrCtrl.update_profile_image);

module.exports = router;
