
import { 
	LOGIN_BEFORE_CART,
	UPDATE_CART_COUNT,
	INCREMENT_CART_COUNT,
	DECREMENT_CART_COUNT,
	UPDATE_BILLING_DETAILS,
	UPDATE_SHIPPING_DETAILS,
	CM_TAB_CHANGE,
	CM_DESIGN_TAB_CHANGE,
	SM_PLACE_TAB_CHANGE,
	SM_TAB_CHANGE,
	SM_DESIGN_TAB_CHANGE,
	CP_TAB_CHANGE,
	CP_DESIGN_TAB_CHANGE,
	FP_CHARACTER_TAB_CHANGE,
	FP_TAB_CHANGE,
	UPDATE_USER_PROFILE
} from "../constants/action-types";

const updateLoginCart = (payload) => {
	return { type: LOGIN_BEFORE_CART, payload };
};

const updateCartCount = (payload) => {
	return { type: UPDATE_CART_COUNT, payload };
};
const incrementCartCount = (payload) => {
	return { type: INCREMENT_CART_COUNT, payload };
};
const decrementCartCount = (payload) => {
	return { type: DECREMENT_CART_COUNT, payload };
};

const updateBillingDetails = (payload) => {
	return { type: UPDATE_BILLING_DETAILS, payload };
};

const updateShippingDetails = (payload) => {
	return { type: UPDATE_SHIPPING_DETAILS, payload };
};

const onCMTabChange = (payload) => {
	return { type: CM_TAB_CHANGE, payload };
};
const onCMDesignTabChange = (payload) => {
	return { type: CM_DESIGN_TAB_CHANGE, payload };
};

const onSMCustomizeTabChange = (payload) => {
	return { type: SM_PLACE_TAB_CHANGE, payload };
};

const onSMTabChange = (payload) => {
	return { type: SM_TAB_CHANGE, payload };
};

const onSMDesignTabChange = (payload) => {
	return { type: SM_DESIGN_TAB_CHANGE, payload };
};

const onCPTabChange = (payload) => {
	return { type: CP_TAB_CHANGE, payload };
};

const onCPDesignTabChange = (payload) => {
	return { type: CP_DESIGN_TAB_CHANGE, payload };
};

const onFPCharacterTabChange = (payload) => {
	return { type: FP_CHARACTER_TAB_CHANGE, payload };
};

const onFPTabChange = (payload) => {
	return { type: FP_TAB_CHANGE, payload };
};
const onUserProfileUpdate = (payload) => {
	return { type: UPDATE_USER_PROFILE, payload };
};

export {
	updateLoginCart,
	updateCartCount,
	incrementCartCount,
	decrementCartCount,
	updateBillingDetails,
	updateShippingDetails,
	onCMTabChange,
	onCMDesignTabChange,
	onSMCustomizeTabChange,
	onSMTabChange,
	onSMDesignTabChange,
	onCPTabChange,
	onCPDesignTabChange,
	onFPCharacterTabChange,
	onFPTabChange,
	onUserProfileUpdate
};