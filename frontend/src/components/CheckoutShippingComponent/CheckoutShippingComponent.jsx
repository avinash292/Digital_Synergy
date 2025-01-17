import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import useStyles from './CheckoutShippingComponentStyle';

const CheckoutShippingComponent = ({ countries, onSubmit, formState, onShippingFormChange, useDifferentShippingAddress }) => {
	const classes = useStyles();

	const hasError = field =>
		formState.touched[field] && formState.errors[field] ? true : false;


	return (
		<Box>
			{useDifferentShippingAddress &&				
				<form className={classes.form}>
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<TextField
								error={hasError('full_name')}
								fullWidth
								helperText={
									hasError('full_name') ? formState.errors.full_name[0] : null
								}
								label="Full Name"
								name="full_name"
								onChange={onShippingFormChange}
								type="text"
								value={formState.values.full_name || ''}
								variant="outlined"
								required
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								error={hasError('mobile')}
								fullWidth
								helperText={
									hasError('mobile') ? formState.errors.mobile[0] : null
								}
								label="Mobile"
								name="mobile"
								onChange={onShippingFormChange}
								type="text"
								value={formState.values.mobile || ''}
								variant="outlined"
								required
							/>
						</Grid>
						<Grid item md={12} xs={12}>
							<TextField
								error={hasError('email')}
								fullWidth
								helperText={
									hasError('email') ? formState.errors.email[0] : null
								}
								label="Email address"
								autoComplete="off"
								name="email"
								onChange={onShippingFormChange}
								type="email"
								value={formState.values.email || ''}
								variant="outlined"
								required
							/>
						</Grid>
						<Grid item md={12} xs={12}>
							<TextField
								fullWidth
								label="Address"
								name="address"
								helperText={
									hasError('address') ? formState.errors.address[0] : null
								}
								error={hasError('address')}
								onChange={onShippingFormChange}
								type="text"
								value={formState.values.address || ''}
								variant="outlined"
								required
							/>
						</Grid>
						<Grid item md={12} xs={12}>
							<TextField
								fullWidth
								label="Address Line 2"
								name="addressLine2"
								onChange={onShippingFormChange}
								type="text"
								value={formState.values.addressLine2 || ''}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								error={hasError('city')}
								fullWidth
								helperText={
									hasError('city') ? formState.errors.city[0] : null
								}
								label="City"
								name="city"
								onChange={onShippingFormChange}
								type="text"
								value={formState.values.city || ''}
								variant="outlined"
								required
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								error={hasError('state')}
								fullWidth
								helperText={
									hasError('state') ? formState.errors.state[0] : null
								}
								label="State"
								name="state"
								onChange={onShippingFormChange}
								type="text"
								value={formState.values.state || ''}
								variant="outlined"
								required
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<FormControl
								required
								fullWidth
								variant="outlined"
								error={hasError('country')}
							>
								<InputLabel id="language-label">Country</InputLabel>
								<Select
									labelId="language-label"
									id="language-outlined"
									name="country"
									fullWidth
									value={formState.values.country || ''}
									onChange={onShippingFormChange}
									labelWidth={72}
								>
								{
									countries.map((category, index) => (
										<MenuItem key={index} value={index}>{category.country}</MenuItem>
									))
								}
								</Select>
								<FormHelperText>{hasError('country') ? formState.errors.country[0] : null}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								error={hasError('postal_code')}
								fullWidth
								helperText={
									hasError('postal_code') ? formState.errors.postal_code[0] : null
								}
								label="Postal Code"
								name="postal_code"
								onChange={onShippingFormChange}
								type="text"
								value={formState.values.postal_code || ''}
								variant="outlined"
								required
							/>
						</Grid>
					</Grid>
				</form>
			}
			<div className={classes.postalContainer}>
				<div className={classes.postalTitle}>
						<CheckCircleIcon className={classes.checkIcon}/>
						<Typography>POSTNL / DPD / JANSSEN</Typography>
				</div>
				<Typography>$0.00</Typography>
			</div>
			<Button
				variant="contained"
				color="primary"
				onClick={() => onSubmit(formState)}
				fullWidth
				className={classes.continueBtn}
				disabled={useDifferentShippingAddress && !formState.isValid}
			>
				Continue
			</Button>
		</Box>
	);
};

CheckoutShippingComponent.propTypes = {
	countries: PropTypes.array.isRequired,
	onSubmit: PropTypes.func.isRequired,
	formState: PropTypes.object.isRequired,
	onShippingFormChange: PropTypes.func.isRequired,
	useDifferentShippingAddress: PropTypes.bool.isRequired,
};


export default CheckoutShippingComponent;