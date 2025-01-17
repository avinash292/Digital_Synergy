const Plans = require('../models/planModel');
const PlanTypes = require('../models/planTypeModel');

Plans.belongsTo(PlanTypes, { foreignKey: 'plan_type_id' });
PlanTypes.hasMany(Plans, { foreignKey: 'plan_type_id' });