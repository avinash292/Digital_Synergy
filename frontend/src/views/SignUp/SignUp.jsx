import React, { useState, useEffect } from 'react';
import validate from 'validate.js';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';

import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';
import useStyles from './SignUpStyle';
import API from '../../axios/axiosApi';
import { COMMON_ERR_MSG } from '../../config';
import { updateLoginCart, incrementCartCount } from '../../redux/actions';

const schema = {
	email: {
		presence: { allowEmpty: false, message: 'is required' },
		email: true,
		length: {
			maximum: 120,
		},
	},
	firstName: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 120,
		},
	},
	lastName: {
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

const SignUp = ({ history, cartData, updateLoginCart, incrementCartCount }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');
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

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (formState.isValid) {
			try {
				setLoading(true);
				const postData = { ...formState.values, source: 'email' };
				const response = await API.post('signup', postData);
				if (response.data.success) {
					if (cartData.forCart && cartData.cart) {
						// await API.post('cart', cartData.cart);
						await API.post('cart', cartData.cart, { headers: {'Content-Type': 'multipart/form-data'} });
						incrementCartCount();
						updateLoginCart({ forCart: false, cart: {} });
						setLoading(false);
						history.replace('/cart');
					} else {
						setLoading(false);
						history.push('/');
					}
				} else {
					console.log("SignUp fail");
					const errorMsg = response.data.message || 'Invalid Credentials';
					setErrorMessage(errorMsg);
				}
			} catch (error) {
				console.log(" !formState.isValid");
				console.log("ERROR in handleSubmit : ", error);
				setLoading(false);
				const errMsg = (error.response && error.response.data) ? error.response.data.message : COMMON_ERR_MSG;
				setErrorMessage(errMsg);
			}
		}

		/* setFormState(formState => ({
			...formState,
			touched: {
				...formState.touched,
				...formState.errors,
			},
		})); */
	};

	const hasError = field =>
		formState.touched[field] && formState.errors[field] ? true : false;

	return (
		<div className={classes.root}>
			<Section className={classes.section}>
				<div className={classes.formContainer}>
					<SectionHeader
						title="Sign Up"
						subtitle="Create beautiful personalised maps to celebrate every moment, place and memory."
						titleProps={{
							variant: 'h3',
						}}
					/>
					{errorMessage &&
						<Alert className={classes.errorAlert} severity="error">{ errorMessage }</Alert>
					}
					<form className={classes.form} name="sign-up-form" method="post" onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={6} xs={12}>
								<TextField
									placeholder="First name"
									label="First name"
									variant="outlined"
									size="medium"
									name="firstName"
									fullWidth
									helperText={
										hasError('firstName') ? formState.errors.firstName[0] : null
									}
									error={hasError('firstName')}
									onChange={handleChange}
									type="firstName"
									value={formState.values.firstName || ''}
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
									name="lastName"
									fullWidth
									helperText={
										hasError('lastName') ? formState.errors.lastName[0] : null
									}
									error={hasError('lastName')}
									onChange={handleChange}
									type="lastName"
									value={formState.values.lastName || ''}
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
					<Typography
						color="textSecondary"
						variant="body1"
						className={classes.signupLink}
					>
						Have an account?{' '}
						<Link className={classes.cursorPointer} onClick={() => history.push('/signin')}>
							Sign In
						</Link>
					</Typography>
				</div>
			</Section>
		</div>
	);
};

const mapStateToProps = state => {
	return { cartData: state.cartData }
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateLoginCart: cart => dispatch(updateLoginCart(cart)),
		incrementCartCount: cart => dispatch(incrementCartCount(cart)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);