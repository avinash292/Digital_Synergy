import React, { useEffect, useState } from 'react';
// import clsx from 'clsx';
import { connect } from 'react-redux';
import validate from 'validate.js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Backdrop from '@material-ui/core/Backdrop';
// import useMediaQuery from '@material-ui/core/useMediaQuery';

import CircularProgress from '@material-ui/core/CircularProgress';

import useStyles from './CheckoutStyle';
import API from '../../axios/axiosApi';
// import { Section } from 'components/organisms';
import { SectionHeader } from 'components/molecules';
import CheckoutBillingComponent from 'components/CheckoutBillingComponent';
import CheckoutShippingComponent from 'components/CheckoutShippingComponent';
import CheckoutForm from 'components/CheckoutForm';
import { formatUnderscore, formatCurrency } from 'utils/formatter';
import { COMMON_ERR_MSG, STRIPE_PUBLISHABLE_KEY } from '../../config';
import { updateCartCount } from '../../redux/actions';

const formSteps = ['Billing', 'Shipping', 'Payment'];

const schema = {
	full_name: {
		presence: { allowEmpty: false, message: 'is required' },
	},
	email: {
		presence: { allowEmpty: false, message: 'is required' },
		email: true,
		length: {
			maximum: 64
		}
	},
	mobile: {
		presence: { allowEmpty: false, message: 'is required' },
	},
	address: {
		presence: { allowEmpty: false, message: 'is required' },
	},
	city: {
		presence: { allowEmpty: false, message: 'is required' },
	},
	state: {
		presence: { allowEmpty: false, message: 'is required' },
	},	
	country: {
		presence: { allowEmpty: false, message: 'is required' },
	},
	postal_code: {
		presence: { allowEmpty: false, message: 'is required' },
	},
};

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Checkout = ({ history, updateCartCount }) => {
	const classes = useStyles();
	const [cart, setCart] = useState({ total_price: 0 });
	const [loading, setLoading] = useState(false);
	const [spinner, setSpinner] = useState(false);
	const [snack, setSnack] = useState({ open: false, message: '' });
	const [activeStep, setActiveStep] = useState(0);
	const [countries, setCountries] = useState([]);
	const [billingFormState, setBillingFormState] = useState({
		isValid: false,
		values: {
			useDifferentShippingAddress: false,
		},
		touched: {},
		errors: {}
	});
	const [shippingFormState, setShippingFormState] = useState({
		isValid: false,
		values: {},
		touched: {},
		errors: {}
	});

	// const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));

	useEffect(() => {
		const fetchOrderSummary = async () => {
			try {
				setLoading(true);
				const response = await API.get('checkout');
				if (response.data.success && response.data.data) {
					const cartDetails = response.data.data.cart;
					setCart(cartDetails);
					setBillingFormState(billingFormState => ({
						...billingFormState,
						values: { ...billingFormState.values, email: response.data.data.email }
					}));
				}
				setLoading(false);
			} catch (error) {
				console.log("ERROR in fetchOrderSummary : ", error);
				setLoading(false);
				const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
				handleSnackToogle(errorMsg);
			}
		};
		fetchOrderSummary();
		const fetchCountries = async () => {
			try {
				setLoading(true);
				const response = await API.get('countries');
				if (response.data.success && response.data.data && response.data.data.countries) {
					setCountries(response.data.data.countries);
				}
				setLoading(false);
			} catch (error) {
				console.log("ERROR in fetchCountries : ", error);
				setLoading(false);
				const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
				handleSnackToogle(errorMsg);
			}
		};
		fetchCountries();
	}, []);

	useEffect(() => {
		const errors = validate(shippingFormState.values, schema);
		setShippingFormState(shippingFormState => ({
			...shippingFormState,
			isValid: errors ? false : true,
			errors: errors || {}
		}));
	}, [shippingFormState.values]);

	useEffect(() => {
		const errors = validate(billingFormState.values, schema);
		setBillingFormState(billingFormState => ({
			...billingFormState,
			isValid: errors ? false : true,
			errors: errors || {}
		}));
	}, [billingFormState.values]);

	/**
	 * Handle field change
	 * 
	 * @param {*} event 
	 */
	 const handleBillingFormChange = event => {
		event.persist();
		setBillingFormState(billingFormState => ({
			...billingFormState,
			values: {
				...billingFormState.values,
				[event.target.name]:
				event.target.type === 'checkbox'
					? event.target.checked
					: event.target.value
			},
			touched: {
				...billingFormState.touched,
				[event.target.name]: true
			}
		}));
	};

	/**
	 * Handle field change
	 * 
	 * @param {*} event 
	 */
	 const handleShippingFormChange = event => {
		event.persist();
		setShippingFormState(shippingFormState => ({
			...shippingFormState,
			values: {
				...shippingFormState.values,
				[event.target.name]:
				event.target.type === 'checkbox'
					? event.target.checked
					: event.target.value
			},
			touched: {
				...shippingFormState.touched,
				[event.target.name]: true
			}
		}));
	};

	const handleFormSubmit = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleStepChange = (index) => {
		// console.log("billingFormState : ", billingFormState);
		// console.log("shippingFormState : ", shippingFormState);
		if (!billingFormState.isValid || (billingFormState.values.useDifferentShippingAddress && !shippingFormState.isValid)) { return false; }
		setActiveStep(index);
	};

	/**
	 * Handle checkout after card token generation
	 * 
	 * @param {Object} token 
	 */
	const handleCheckout = async (token) => {
		// console.log("token : ", token);
		// console.log("billingFormState : ", billingFormState.values);
		// console.log("shippingFormState : ", shippingFormState.values);
		if (!billingFormState.isValid || (billingFormState.values.useDifferentShippingAddress && !shippingFormState.isValid)) { return false; }
		if (token.id) {
			try {
				setSpinner(true);
				const postData = {
					tokenId: token.id,
					billingAddress: {
						...billingFormState.values,
						country: countries[billingFormState.values.country]
					},
					shippingAddress: shippingFormState.values.country ? {
						...shippingFormState.values,
						country: countries[shippingFormState.values.country]
					}: shippingFormState.values,
				};
				// console.log("postData : ", postData);
				const response = await API.post('checkout', postData);
				setSpinner(false);
				if (response.data.success) {
					handleSnackToogle(response.data.message);
					updateCartCount(0);
					setTimeout(() => {
						history.push('/orders');
					}, 200);
				} else {
					handleSnackToogle(response.data.message);
					// showMessage({ message: response.data.message, type: "danger" });
					console.log("ERROR RESPONSE in handleCheckout : ", response.data);
				}
			} catch (error) {
				setSpinner(false);				
				console.log("ERROR in handleCheckout : ", error);
				const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
				handleSnackToogle(errorMsg);
			}			
		}
	};

	const getStepContent = (step) => {
		switch (step) {
			case 0: 	return (
				<CheckoutBillingComponent
					onSubmit={handleFormSubmit}
					countries={countries}
					formState={billingFormState}
					onBillingFormChange={handleBillingFormChange}
				/>
			);
			case 1: 	return (
				<CheckoutShippingComponent
					onSubmit={handleFormSubmit}
					countries={countries}
					formState={shippingFormState}
					onShippingFormChange={handleShippingFormChange}
					useDifferentShippingAddress={billingFormState.values.useDifferentShippingAddress}
				/>
			);
			case 2:
				return (
					<Elements stripe={stripePromise}>
						<CheckoutForm billingDetails={billingFormState.values} totalPrice={cart.total_price} countries={countries} onTokenGeneration={handleCheckout} />
					</Elements>
				);
			default:
				return 'Unknown step';
		}
	};

	const handleSnackToogle = (message) => {
		setSnack(snack => ({ open: !snack.open, message: message || '' }));
	};

	return (
		<div className={classes.root}>
			<div className={classes.pageTitle}>
				<Typography variant="h3">Checkout</Typography>
			</div>
			<Container className={classes.container}>
			{(cart.cart_products && cart.cart_products.length) || loading ? (
				<Grid container spacing={4}>
					<Grid item xs={12} md={8}>
						<Stepper activeStep={activeStep} orientation="vertical" elevation={1} className={classes.stepperContainer}>
							{formSteps.map((label, index) => (
								<Step key={index}>
									<StepLabel onClick={() => handleStepChange(index)}>{label}</StepLabel>
									<StepContent>
										{getStepContent(index)}
									</StepContent>
								</Step>
							))}
						</Stepper>
					</Grid>

					<Grid item xs={12} md={4}>
						{loading ? (
							<Skeleton variant="rect" className={classes.skeletonLoader} animation="wave" />
						) : (
							<Paper className={classes.orderSummary}>
								<Typography variant="h6" className={classes.orderSummaryTitle}>Order summary</Typography>
								<Divider />
								{cart.cart_products.map((cartItem, index) => (
									<div key={index} className={classes.item}>
										<div>
											<Typography>{cartItem.product.name}</Typography>
											<Typography variant="subtitle2">{cartItem.size.name}</Typography>
											<Typography variant="subtitle2">Medium: {formatUnderscore(cartItem.purchaseType)}</Typography>
										</div>
										<Typography variant="subtitle2">x1</Typography>
										<Typography>
											<b>${formatCurrency(cartItem.purchaseType === 'pdf' ? cartItem.size.pdf_price : cartItem.size.price)}</b>
										</Typography>
									</div>
								))}
								<Divider />
								<div className={classes.priceContent}>
									<Typography variant="h6">Total</Typography>
									<Typography variant="h6"><b>${formatCurrency(cart.total_price)}</b></Typography>
								</div>
							</Paper>
						)}
					</Grid>
				</Grid>
			) : (
				<SectionHeader
					title="Your cart is empty."
					titleProps={{
						variant: 'h4',
					}}
					ctaGroup={[
						<Button
							size="large"
							variant="contained"
							color="primary"
							onClick={() => history.push('/')}
						>
							Back To Store
						</Button>
					]}
					disableGutter
				/>
			)}
			</Container>

			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={snack.open}
				onClose={() => handleSnackToogle()}
				message={snack.message}
				autoHideDuration={2000}
			/>
			<Backdrop className={classes.backdrop} open={spinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
		</div>
	);
};


const mapDispatchToProps = (dispatch) => {
	return {
		updateCartCount: cartCount => dispatch(updateCartCount(cartCount)),
	};
};

export default connect(null, mapDispatchToProps)(Checkout);
