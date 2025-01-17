import React, { useState, useEffect } from 'react';
import validate from 'validate.js';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';

import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';
import useStyles from './ResetPasswordStyle';
import API from '../../axios/axiosApi';
import { COMMON_ERR_MSG, APP_NAME } from '../../config';

const schema = {
	email: {
		presence: { allowEmpty: false, message: 'is required' },
		email: true,
		length: {
		maximum: 64
		}
	},
	password: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 128,
			minimum: 8,
		},
	},
	password_confirmation: {
		presence: true,
		equality: {
			attribute: "password",
			message: "^Password and Confirm Password doesn't match"
		}
	},
};

const ResetPassword = ({ history, match: { params } }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ success, setSuccess ] = useState({ status: false, message: '' });
	const [ isValidLink, setValidLink ] = useState(true);
	const [formState, setFormState] = useState({
		isValid: false,
		values: {},
		touched: {},
		errors: {},
	});
	// console.log(params.hash);

	useEffect(() => {
		const checkUrl = async () => {
			setLoading(true);
			try {
				const response = await API.get('password/' + params.hash);
				setLoading(false);
				if (response.data.success) {
					setValidLink(true)
					setFormState(formState => ({
						...formState,
						values: {
							...formState.values,
							email: response.data.data.user.email
						},
					}));
					// setSuccessMessage(response.data.message);
					// props.history.push('/');
				} else {
					setValidLink(false);
				}
			} catch (error) {
				// console.log("ERROR in setLoading : ", error);
				setLoading(false);
				setValidLink(false)
			}
		};
		checkUrl();
	}, [params]);

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
		setErrorMessage('');
		setLoading(true);
		try {
			const postData = { ...formState.values, hash: params.hash }
			const response = await API.post('password/reset', postData);
			setLoading(false);
			if (response.data.success) {
				setSuccess({ status: true, message: response.data.message })
			} else {
				const errorMsg = response.data.message || COMMON_ERR_MSG;
				setErrorMessage(errorMsg);
			}
		} catch (error) {
			console.log("ERROR in handlePassReset : ", error);
			setLoading(false);
			const errMsg = (error.response && error.response.data) ? error.response.data.message : COMMON_ERR_MSG;
			setErrorMessage(errMsg);
		}
	};

	const hasError = field =>
		formState.touched[field] && formState.errors[field] ? true : false;

	return (
		<div className={classes.root}>
			<Section className={classes.section}>
				<div className={classes.formContainer}>
					<SectionHeader
						title="Reset Password"
						// subtitle="We will send you an email with instructions on how to reset your password."
						titleProps={{
							variant: 'h3',
						}}
					/>
					{errorMessage &&
						<Alert className={classes.errorAlert} severity="error">{ errorMessage }</Alert>
					}
					{isValidLink ? (
						<div>
							{success.status ? (
								<Typography variant="subtitle1" className={classes.successMessage}>
									<Alert severity="success">{ success.message }</Alert>
									<Link className={classes.link} onClick={() => history.push('/signin')} variant="body2">
										Click here to return to <b>{APP_NAME}</b> Login Page
									</Link>
								</Typography>
							) : (
								<form className={classes.form} name="sign-up-form" method="post" onSubmit={handleSubmit}>
									<Grid container spacing={2}>							
										<Grid item xs={12}>
											<TextField
												className={classes.textField}
												error={hasError('email')}
												fullWidth
												helperText={
													hasError('email') ? formState.errors.email[0] : null
												}
												label="Email address"
												name="email"
												onChange={handleChange}
												type="text"
												value={formState.values.email || ''}
												variant="outlined"
												required
												disabled
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												className={classes.textField}
												error={hasError('password')}
												fullWidth
												helperText={
													hasError('password') ? formState.errors.password[0] : null
												}
												label="Password"
												name="password"
												onChange={handleChange}
												type="password"
												value={formState.values.password || ''}
												variant="outlined"
												required
												autoComplete="new-password"
											/>
										</Grid>
										<Grid item xs={12}>
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
												autoComplete="new-password"
												required
											/>
										</Grid>
										<Grid item xs={12}>
											<Button
												className={classes.signInButton}
												color="primary"
												disabled={!formState.isValid || loading}
												fullWidth
												size="large"
												type="submit"
												variant="contained"
											>
												Reset
											</Button>
										</Grid>
									</Grid>
								</form>
							)}
						</div>
					) : (
						<div className={classes.expiredLinkconatiner}>
							<Alert severity="warning">This link is expired</Alert>
							<Link className={classes.link} variant="body2" onClick={() => history.push('/forgot-password')}>
								Reset you password again
							</Link>
						</div>
					)}
				</div>
			</Section>
		</div>
	);
};

export default ResetPassword;