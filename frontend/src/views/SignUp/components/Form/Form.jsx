import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import validate from 'validate.js';

import API from '../../../../axios/axiosApi';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
}));

const schema = {
	email: {
		presence: { allowEmpty: false, message: 'is required' },
		email: true,
		length: {
			maximum: 300,
		},
	},
	first_name: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 120,
		},
	},
	last_name: {
		length: {
			maximum: 120,
		},
	},
	password: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 128,
			minimum: 8,
		},
	},
	/* password: {
		presence: { allowEmpty: false, message: 'is required' },
		format: {
			pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{4,}$/,
			flags: "i",
			message: "Must contain at-least one uppercase, lowercase, number and a special character."
		},
		length: {
			maximum: 128,
			minimum: 8
		},
	}, */
	password_confirmation: {
		presence: true,
		equality: {
			attribute: "password",
			message: "^Password and Confirm Password doesn't match."
		}
	},
};

const Form = () => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [formState, setFormState] = useState({
		isValid: false,
		values: {},
		touched: {},
		errors: {},
	});

	useEffect(() => {
		const errors = validate(formState.values, schema);

		setFormState(formState => ({
			...formState,
			isValid: errors ? false : true,
			errors: errors || {},
		}));
	}, [formState.values]);

	const handleChange = event => {
		event.persist();

		setFormState(formState => ({
			...formState,
			values: {
				...formState.values,
				[event.target.name]:
					event.target.type === 'checkbox'
						? event.target.checked
						: event.target.value,
			},
			touched: {
				...formState.touched,
				[event.target.name]: true,
			},
		}));
	};

	const handleSubmit = event => {
		event.preventDefault();
		console.log("formState : ", formState);
		if (formState.isValid) {
			// window.location.replace('/');
		}

		

		setFormState(formState => ({
			...formState,
			touched: {
				...formState.touched,
				...formState.errors,
			},
		}));
	};

	const hasError = field =>
		formState.touched[field] && formState.errors[field] ? true : false;

	return (
		<div className={classes.root}>
			<form name="password-reset-form" method="post" onSubmit={handleSubmit}>
				<Grid container spacing={2}>
					<Grid item md={6} xs={12}>
						<TextField
							placeholder="First name"
							label="First name"
							variant="outlined"
							size="medium"
							name="first_name"
							fullWidth
							helperText={
								hasError('first_name') ? formState.errors.first_name[0] : null
							}
							error={hasError('first_name')}
							onChange={handleChange}
							type="first_name"
							value={formState.values.first_name || ''}
							autoFocus
							required
						/>
					</Grid>
					<Grid item md={6} xs={12}>
						<TextField
							placeholder="Last name"
							label="Last name"
							variant="outlined"
							size="medium"
							name="last_name"
							fullWidth
							helperText={
								hasError('last_name') ? formState.errors.last_name[0] : null
							}
							error={hasError('last_name')}
							onChange={handleChange}
							type="last_name"
							value={formState.values.last_name || ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							placeholder="E-mail"
							label="E-mail"
							variant="outlined"
							size="medium"
							name="email"
							fullWidth
							helperText={hasError('email') ? formState.errors.email[0] : null}
							error={hasError('email')}
							onChange={handleChange}
							type="email"
							value={formState.values.email || ''}
							required
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							placeholder="Password"
							label="Password"
							variant="outlined"
							size="medium"
							name="password"
							fullWidth
							helperText={
								hasError('password') ? formState.errors.password[0] : null
							}
							error={hasError('password')}
							onChange={handleChange}
							type="password"
							value={formState.values.password || ''}
							autoComplete="new-password"
							required
						/>
					</Grid>
					<Grid item md={12} xs={12}>
						<TextField
							className={classes.textField}
							error={hasError('password_confirmation')}
							fullWidth
							helperText={
								hasError('password_confirmation') ? formState.errors.password_confirmation[0] : null
							}
							label="Confirm Password"
							name="password_confirmation"
							onChange={handleChange}
							type="password"
							value={formState.values.password_confirmation || ''}
							variant="outlined"
							required
							autoComplete="new-password"
						/>
					</Grid>
					<Grid item xs={12}>
						<i>
							<Typography variant="subtitle2">
								Fields that are marked with * sign are required.
							</Typography>
						</i>
					</Grid>
					<Grid item xs={12}>
						<Button
							size="large"
							variant="contained"
							type="submit"
							color="primary"
							fullWidth
							disabled={!formState.isValid || loading}
						>
							Sign Up
						</Button>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default Form;