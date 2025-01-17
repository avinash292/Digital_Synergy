import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import validate from 'validate.js';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';

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
	password: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			minimum: 8,
		},
	},
};

const Form = ({ loading, onLogin }) => {
	const classes = useStyles();

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

		if (formState.isValid) {
			onLogin(formState.values);
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

	/**
	 * Toogle password visiblity
	 */
	const handlePasswordVisibility = () => {
		setFormState({ ...formState, values: { ...formState.values,  showPassword: !formState.values.showPassword } });
	};

	const hasError = field =>
		formState.touched[field] && formState.errors[field] ? true : false;

	return (
		<div className={classes.root}>
			<form name="password-reset-form" method="post" onSubmit={handleSubmit}>
				<Grid container spacing={2}>
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
							autoFocus
							autoComplete="email"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							placeholder="Password"
							label="Password"
							autoComplete="current-password"
							variant="outlined"
							size="medium"
							name="password"
							fullWidth
							helperText={
								hasError('password') ? formState.errors.password[0] : null
							}
							error={hasError('password')}
							onChange={handleChange}
							type={formState.values.showPassword ? 'text' : 'password'}
							value={formState.values.password || ''}
							required
							InputProps={{
								endAdornment: <InputAdornment position="end"><IconButton
									aria-label="toggle password visibility"
									edge="end"
									onClick={handlePasswordVisibility}
								>
									{formState.values.showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton></InputAdornment>,
							}}
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
							Sign In
						</Button>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

Form.propTypes = {
	loading: PropTypes.bool.isRequired,
	onLogin: PropTypes.func.isRequired,
};

export default Form;
