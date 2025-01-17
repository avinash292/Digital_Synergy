'user strict';

const config 			= require('../config');
const { Op, Transaction } = require('sequelize');
const moment			= require('moment');
const Stripe			= require('stripe');
const { ErrorHandler }	= require('../helpers/errorhandler');
const Plans				= require('../models/planModel');
const PlanTypes			= require('../models/planTypeModel');
const UserPaidPlans		= require('../models/userPaidPlanModel');
const AccessCodes		= require('../models/accessCodeModel');
const Customers			= require('../models/customerModel');
const Payments			= require('../models/paymentModel');
const sequelize = require('../db');

/**
 * Fetch plan listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_plans = async (req, res, next) => {
	let request = {
		orderBy		: (req.body.orderBy !== undefined  && req.body.orderBy !== "") ? req.body.orderBy : 'name',
		order   	: (req.body.order !== undefined && req.body.order !== "") ? req.body.order : 'ASC',
		pageSize 	: (req.body.pageSize !== undefined) ? req.body.pageSize : 10,
		pageOffset 	: (req.body.pageOffset !== undefined && req.body.pageOffset !== null) ? req.body.pageOffset : 0,
		searchText 	: (req.body.searchText !== undefined) ? req.body.searchText : '',
	};
	let order = [request.orderBy, request.order];
	if (request.orderBy === 'plan_type') { 
		order = ['plan_type', 'name', request.order];
	}

	const searchColumns = ['name', 'price', 'validity', 'createdAt'];
	let likeSearch = {};
	if (request.searchText !== '') {
		const likeColumns = searchColumns.map(column => {
			return { [column]: { [Op.like]: '%' + request.searchText + '%' } };
		});
		likeSearch = { [Op.or]: likeColumns };
	}
	
	try {
		let result = await Plans.findAndCountAll({
			where: { ...likeSearch, is_deleted: false },
			include: {
				model: PlanTypes,
				required: true,
				attributes: [ 'id', 'name' ],
			},
			order: [order],
			offset: request.pageOffset,
			limit: request.pageSize
		});
		return res.json({ success: true, message: 'Fetched language successfully!', data: result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Add update plan
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const save_plan = async (req, res, next) => {
	const request = req.body;
	if (!request.name || !request.plan_type_id) { next(new ErrorHandler(400, 'Missing required name or label fields')); }
	request.name = request.name.trim();
	request.description = (request.description) ? request.description.trim() : '';

	try {
		const planId = (request.type == 'edit' && request.id !== undefined) ? parseInt(request.id) : false;
		const ifExist = await check_if_plan_exist(request.name, planId, next);
		if (ifExist) {
			return res.json({ success: false, message: 'Plan name already exists!' });
		}
		if (request.selectedPlanType && request.selectedPlanType.name === 'free') {
			const ifFreeExist = await check_if_free_plan_exist(planId, next);
			if (ifFreeExist) {
				return res.json({ success: false, message: 'You cannot create more than 1 FREE plan' });
			}
		}
		const plan = {
			name			: request.name,
			is_active		: request.is_active,
			plan_type_id 	: request.plan_type_id,
			price			: request.price || 0,
			validity		: request.validity || 0,
			include_mock_tests: request.include_mock_tests,
			include_in_app	: request.include_in_app,
			description		: request.description,
		};
		// return res.json({ success: false, message: 'Test successfully!', request, ifExist, plan });
		if (request.type == 'add') {
			const result = await Plans.create(plan);
			return res.json({ success: true, message: 'Plan created successfully!', result });
		} else {
			const result = await Plans.update(plan, { where: { id: request.id } });
			return res.json({ success: true, message: 'Plan updated successfully!', result });
		}
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Check if plan name already exists
 * 
 * @param {*} name 
 * @param {*} planId 
 * @param {*} next 
 */
const check_if_plan_exist = async (name, planId, next) => {	
	try {
		let where = { name, is_deleted: false };
		if (planId) {
			where = { ...where, id: { [Op.not]: planId } }
		}
		let result = await Plans.findOne({ where }); // , logging: console.log
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

/**
 * Check if free plan exists
 * 
 * @param {*} name 
 * @param {*} planId 
 * @param {*} next 
 */
const check_if_free_plan_exist = async (planId, next) => {
	// console.log("==> ", planId);
	let where = { is_deleted: false };
	if (planId) { where = { ...where, id: { [Op.ne]: planId } }; }
	try {
		let result = await Plans.findOne({
			where,
			include: {
				model: PlanTypes,
				required: true,
				attributes: [ 'id', 'name' ],
				where: { name: 'free' }
			},
		}); // , logging: console.log
		// console.log(result);
		return (result) ? true : false;
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};

const get_plan_details = async (req, res, next) => {
	const planId = parseInt(req.params.id);	
	try {
		let result = await Plans.findOne({ where: { id: planId, is_deleted: false } }); // , logging: console.log
		return res.json({ success: true, message: 'FAQ fetched successfully!', data: { plan_details: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}   
};


/**
 * Delete plans
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const delete_plans = async (req, res, next) => {
	const request = req.body;
	if (!request.deleteIds) { next(new ErrorHandler(400, 'Missing delete IDs')); }
	// return res.json({ success: true, message: 'Fetched language successfully!', request });

	try {
		const result = await Plans.update({ is_deleted: true }, { where: { id: { [Op.in]: request.deleteIds } } });
		return res.json({ success: true, message: 'Plans deleted successfully!', result });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Get all paid plans
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_all_paid_plans = async (req, res, next) => {
	try {
		const result = await Plans.findAll({
			attributes: ['id', 'name', 'price'],
			where: { is_active: true, is_deleted: false },
			include: {
				model: PlanTypes,
				required: true,
				attributes: [ 'id', 'name' ],
				where: { name: 'paid' }
			},
		})
		res.json({ success: true, message: 'Fetched plans successfully!', data: { plans: result } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));		
	}
};

/**
 * Get all plans (APP)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get_all_plans = async (req, res, next) => {
	try {
		const userId = req.user_id, currentDateTime = moment().toDate();
		const result = await Plans.findAll({
			attributes: ['id', 'name', 'price', 'validity', 'plan_type_id', 'description', 'include_in_app'],
			where: { is_active: true, is_deleted: false, include_in_app: true },
			include: {
				model: PlanTypes,
				required: true,
				attributes: [ 'id', 'name' ],
			},
		});
		const userPaidPlan = await UserPaidPlans.findOne({
			where: { user_id: userId, end_date: { [Op.gte]: currentDateTime }, is_active: true }
		});
		const selectedUserPlan = result.filter(plan => {
			if (userPaidPlan) {
				if(plan.id == userPaidPlan.plan_id || plan.price == userPaidPlan.price) {
					return true;
				}
			} else {
				if (plan.plan_type.name == 'free') { return true; }
			}
		}).shift();
		// console.log(selectedUserPlan);
		res.json({ success: true, message: 'Fetched plans successfully!', data: { plans: result, selected_user_plan: selectedUserPlan } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Generate user paid plan by access code
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const generate_plan_by_access_code = async (req, res, next) => {
	try {
		const userId = req.user_id, currentDateTime = moment().toDate(), accessCode = req.params.accessCode;
		const result = await sequelize.transaction(async (t) => {	  
			const codePlanDetails = await AccessCodes.findOne({
				where: { code: accessCode, user_id: userId, valid_till: { [Op.gte]: currentDateTime }, is_active: true, is_used: false },
				include: {
					model: Plans,
					required: true,
				}
			});
			if (!codePlanDetails) {
				return res.json({ success: false, message: 'Invalid access code!' });
			}
			const planDeactivated = await deactivate_old_plan(userId, t);
			const planActivated = await create_new_plan(userId, codePlanDetails.plan, "access_code", t);
			const markCode = await AccessCodes.update(
				{ is_used: true },
				{ where: { code: accessCode, user_id: userId }, transaction: t }
			);

			res.json({ success: true, message: 'Access code successfully redeemed!', data: { new_plan: planActivated, planDeactivated, markCode } });
		});
		// return res.json({ success: false, message: 'Fetched asdsad successfully!',  });
	} catch (error) {
		console.log("******************* TRANSACTION ROLLBACK ACCESS CODE ***************************");
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

/**
 * Deactivate old user paid plan
 * 
 * @param {*} userId 
 * @param {*} next 
 */
const deactivate_old_plan = async (userId, t) => {
	// try {
		return await UserPaidPlans.update(
			{ is_active: false },
			{ where: { user_id: userId, is_active: true }, transaction: t}
		);
	// } catch (error) {
		// next(new ErrorHandler(200, config.common_err_msg, error));
	// }
};

/**
 * Create new user paid plan via access code
 * 
 * @param {*} userId 
 * @param {*} codePlanDetails 
 * @param {*} next 
 */
const create_new_plan = async (userId, plan, source, t) => {
	// try {
		const planStartDate = moment().toDate(), planEndDate = moment().add(plan.validity, 'days').toDate();
		const userPaidPlan = {
			user_id		: userId,
			name		: plan.name,
			price		: plan.price,
			validity	: plan.validity,
			description	: plan.description,
			start_date	: planStartDate,
			end_date	: planEndDate,
			plan_id		: plan.id,
			source,
			is_active	: true,
			include_mock_tests: plan.include_mock_tests,
		};
		return await UserPaidPlans.create(userPaidPlan, { transaction: t });
	// } catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	// }
};

/**
 * Process stripe payment and generate plan
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const generate_plan_by_payment = async (req, res, next) => {
	const request = req.body, userId = req.user_id, email = req.email;
	if (!request.tokenId || !request.planId) { next(new ErrorHandler(400, config.missing_fields)); }
	let planActivated, charge;
	// return res.json({ success: false, message: request.tokenId, data: { payment_details: request } });
	try {
		const result = await sequelize.transaction(async (t) => {
			const stripe = Stripe(config.stripe_secret_key);
			const data = { tokenId: request.tokenId, userId, email };
			const customer = await fetch_or_create_customer(stripe, t, data);

			const planDetails = await Plans.findOne({
				where: { id: request.planId, is_active: true, is_deleted: false },
				include: {
					model: PlanTypes,
					required: true,
					attributes: [ 'id', 'name' ],
				},
			});
			if (!planDetails || planDetails.plan_type.name == 'free') {
				return res.json({ success: false, message: 'Invalid plan!', planDetails });
			}
			const planDeactivated = await deactivate_old_plan(userId, t);
			planActivated = await create_new_plan(userId, planDetails, 'plan_purchase', t);

			if (customer.type === 'old_customer') {
				const customerUpdated = await stripe.customers.update(customer.customerId, {
					source: request.tokenId,
				});
				// console.log(customerUpdated);				
			}
			const { id, user_id, price, name, start_date, end_date, plan_id, include_mock_tests, description, validity } = planActivated;
			const chargeMetadata = { user_paid_plan_id: id, user_id, price, name, start_date, end_date, plan_id, include_mock_tests, description, validity };
			
			charge = await stripe.charges.create({
				amount: planDetails.price * 100,
				currency: config.stripe_currency,
				customer: customer.customerId,
				description: "Purchased Plan: " + planDetails.name + " (" + planDetails.price + ")",
				metadata: chargeMetadata
			});
			// console.log(charge);
			const paymentInserted = await insert_payment(userId, planActivated, charge, t);
			const payment_details = {
				id				: paymentInserted.id,
				user_id			: paymentInserted.user_id,
				paid_plan_id	: paymentInserted.paid_plan_id,
				charge_id		: paymentInserted.charge_id,
				currency		: paymentInserted.currency,
				amount			: paymentInserted.amount,
				payment_method	: paymentInserted.payment_method,
				plan_name		: planActivated.name,
				validity		: planActivated.validity,
				end_date		: planActivated.end_date
			};
			res.json({ success: true, message: 'Plan purchased successfully!', data: { payment_details } });
		});	  
		// console.log("******************** TRANSACTION RESULT ****************************");
		// console.log(result);
	} catch (error) {
		console.log("******************** TRANSACTION ROLLBACK ****************************");
		// console.log(error);
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

const fetch_or_create_customer = async (stripe, t, data) => {
	const existingCustomer = await Customers.findOne({ where: { user_id: data.userId } });
	if (existingCustomer) {
		return { customerId: existingCustomer.customer_id, type: 'old_customer' };
	}
	const customer = await stripe.customers.create({
		source: data.tokenId,
		email: data.email,
	});
	const inserted = await Customers.create({
		user_id: data.userId, customer_id: customer.id
	}, { transaction: t });
	// console.log(inserted);	
	return { customerId: customer.id, type: 'new_customer' };
};

const insert_payment = async (userId, planActivated, charge, t) => {
	// try {
		const payments = {
			user_id			: userId,
			paid_plan_id	: planActivated.id,
			charge_id 		: charge.id,
			currency 		: charge.currency,
			amount			: charge.amount,
			payment_method	: charge.payment_method,
		};
		return await Payments.create(payments, { transaction: t });
	// } catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	// }
}

module.exports = {
	get_plans,
	save_plan,
	get_plan_details,
	delete_plans,
	get_all_paid_plans,
	get_all_plans,
	generate_plan_by_access_code,
	generate_plan_by_payment,
};