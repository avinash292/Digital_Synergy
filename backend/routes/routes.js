"use-strict";

const express = require("express");
const router = express.Router();

const loginCtrl = require("../controllers/loginController");
const prodCtrl = require("../controllers/productController");
const usrCtrl = require("../controllers/userController");
const orderCtrl = require("../controllers/orderController");

// Auth
router.post("/login", loginCtrl.login);
router.post("/refresh_token", loginCtrl.refresh_token);
// router.post("/reset_password", usrCtrl.reset_password);

// USERS
router.route("/users").post(usrCtrl.get_users);
router.post("/save_user", usrCtrl.save_user);
router.get("/users/:id", usrCtrl.get_user_details);
router.post("/delete_users", usrCtrl.delete_users);

// PROFILE
router
	.route("/profile")
	.get(usrCtrl.get_profile)
	.post(usrCtrl.update_profile)
	.put(usrCtrl.update_password);
router.post("/profile/image", usrCtrl.update_profile_image);

// PRODUCTS
router.route("/products").post(prodCtrl.get_products);
// 		.get(prodCtrl.get_all_categories);
router.get("/products/:id", prodCtrl.get_product_details);
router.post("/products/save", prodCtrl.save_product);
router.put("/products/shapes", prodCtrl.activate_deactivate_shape);
router.put("/products/layouts", prodCtrl.activate_deactivate_layout);
router
	.route("/products/colors")
	.put(prodCtrl.activate_deactivate_color)
	.post(prodCtrl.save_color);
router.delete("/products/colors/:id/:image", prodCtrl.delete_color);
router.put("/products/sizes", prodCtrl.update_size_price);
// router.post("/delete_vocabulary_categories", prodCtrl.delete_categories);

// PRODUCTS
router.route("/orders").post(orderCtrl.get_all_admin_orders);
router
	.route("/orders/:id")
	.get(orderCtrl.get_admin_order_details)
	.put(orderCtrl.update_order_status)
	.post(orderCtrl.update_shipment_details);

module.exports = router;
