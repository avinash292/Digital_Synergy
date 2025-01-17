import {
	LOGIN_BEFORE_CART,
	UPDATE_CART_COUNT,
	INCREMENT_CART_COUNT,
	DECREMENT_CART_COUNT,
	UPDATE_SHIPPING_DETAILS,
	UPDATE_BILLING_DETAILS,
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

const initialState = {
	cartData: { forCart: false, cart: {} },
	profile: {},
	cartCount: 0,
	billingDetails: {},
	shippingDetails: {},
	cmTabValue: 'placePanel',
	cmDesignTabValue: 0,
	smCustomizeTabValue: 0,
	smTabValue: 'placePanel',
	smDesignTabValue: 0,
	cpTabValue: 'placePanel',
	cpDesignTabValue: 0,
	fpCharacterTabValue: ['characterPanel'],
	fpTabValue: 'memberPanel',
};

const rootReducer = (state = initialState, action = {}) => {
	const { type, payload } = action;
	if (type === LOGIN_BEFORE_CART) {
		return { ...state, cartData: payload };
	} else if (type === UPDATE_CART_COUNT && payload !== undefined) {
		return { ...state, cartCount: payload };
	} else if (type === INCREMENT_CART_COUNT) {
		return { ...state, cartCount: ++state.cartCount };
	} else if (type === DECREMENT_CART_COUNT) {
		return { ...state, cartCount: --state.cartCount };
	} else if (type === UPDATE_BILLING_DETAILS) {
		return { ...state, billingDetails: payload };
	} else if (type === UPDATE_SHIPPING_DETAILS) {
		return { ...state, shippingDetails: payload };
	} else if (type === CM_TAB_CHANGE) {
		return { ...state, cmTabValue: payload };
	} else if (type === CM_DESIGN_TAB_CHANGE) {
		return { ...state, cmDesignTabValue: payload };
	} else if (type === SM_PLACE_TAB_CHANGE) {
		return { ...state, smCustomizeTabValue: payload };
	} else if (type === SM_TAB_CHANGE) {
		return { ...state, smTabValue: payload };
	} else if (type === SM_DESIGN_TAB_CHANGE) {
		return { ...state, smDesignTabValue: payload };
	} else if (type === CP_TAB_CHANGE) {
		return { ...state, cpTabValue: payload };
	} else if (type === CP_DESIGN_TAB_CHANGE) {
		return { ...state, cpDesignTabValue: payload };
	} else if (type === FP_CHARACTER_TAB_CHANGE) {
		return { ...state, fpCharacterTabValue: payload };
	} else if (type === FP_TAB_CHANGE) {
		return { ...state, fpTabValue: payload };
	} else if (type === UPDATE_USER_PROFILE) {
		return { ...state, profile: payload };
	}
	return state;
	
};
export default rootReducer;