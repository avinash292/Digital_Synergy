'user strict';

const config = require('../config');
const { ErrorHandler } = require('../helpers/errorhandler');
const PlanTypes = require('../models/planTypeModel');

/**
 * Fetch language listing
 * 
 * @param {*} req 
 * @param {*} res 
 */
const get_plan_types = async (req, res, next) => {
	try {
		let result = await PlanTypes.findAll();
        let defaultPlanTypeId = result.filter(plan => plan.is_default == true);
        defaultPlanTypeId = (defaultPlanTypeId.length > 0) ? defaultPlanTypeId[0].id : 0;
		return res.json({ success: true, message: 'Fetched dialogue languages successfully!', data: { plan_types: result, default_plan_type_id: defaultPlanTypeId } });
	} catch (error) {
		next(new ErrorHandler(200, config.common_err_msg, error));
	}
};

module.exports = {
	get_plan_types,
};