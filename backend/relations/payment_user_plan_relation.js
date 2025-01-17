const Payments = require('../models/paymentModel');
const User = require('../models/userModel');
const UserPaidPlans = require('../models/userPaidPlanModel');

Payments.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Payments, { foreignKey: 'user_id' });

Payments.belongsTo(UserPaidPlans, { foreignKey: 'paid_plan_id' });
UserPaidPlans.hasMany(Payments, { foreignKey: 'paid_plan_id' });