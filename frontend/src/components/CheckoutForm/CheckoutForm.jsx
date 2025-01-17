import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import {
  CardElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import CancelIcon from '@material-ui/icons/Cancel';

import useStyles from './CheckoutFormStyle';


const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			fontSize: "16px",
			color: "#424770",
			letterSpacing: "0.025em",
			fontFamily: "Source Code Pro, monospace",
			"::placeholder": {
				color: "#aab7c4"
			}
		},
		invalid: {
			color: "#9e2146"
		}
	}
};

const CheckoutForm = ({ billingDetails, totalPrice, countries, onTokenGeneration }) => {
	const classes = useStyles();
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState(null);
	const [cardComplete, setCardComplete] = useState(false);
	const [processing, setProcessing] = useState(false);

	/**
	 * Handle payment submit
	 * 
	 * @param {*} event 
	 * @returns 
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();
		// console.log("billingDetails : ", billingDetails);
		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		if (error) { return elements.getElement("card").focus(); }

		if (cardComplete) { setProcessing(true); }
			const card = elements.getElement(CardElement);

			const result = await stripe.createToken(card, {
				name: billingDetails.full_name,
				address_line1: billingDetails.address,
				address_line2: billingDetails.addressLine2,
				address_city: billingDetails.city,
				address_state: billingDetails.state,
				address_zip: billingDetails.postal_code,
				address_country: countries[billingDetails.country] ?  countries[billingDetails.country].iso2 : null,
			});
			if (result.error) {
				console.log(result.error);
				setError(result.error);
			} else {
				onTokenGeneration(result.token);
			}
			setProcessing(false);
	
	};


	return (
		<Box>
			<form className="Form" >
				<fieldset className={classes.formGroup}>
					<CardElement
						className={classes.cardInput}
						options={CARD_OPTIONS}
						onChange={(e) => {
							setError(e.error);
							setCardComplete(e.complete);
						}}
					/>
				</fieldset>
				{error && <div className={classes.errorMsg}>
					<CancelIcon color="error" className={classes.errorIcon} />
					<Typography>{error.message}</Typography>
				</div>}
				<Button
					variant="contained"
					color="primary"
					fullWidth
					disabled={(!stripe || !elements || processing || error) ? true: false}
					className={classes.payBtn}
					onClick={handleSubmit}
					size="large"
				>
					Pay ${totalPrice}
				</Button>
			</form>
		</Box>
	);
};

CheckoutForm.propTypes = {
	billingDetails: PropTypes.object.isRequired,
	totalPrice: PropTypes.number.isRequired,
	countries: PropTypes.array.isRequired,
	onTokenGeneration: PropTypes.func.isRequired,
};


export default CheckoutForm;