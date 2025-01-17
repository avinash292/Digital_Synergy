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
import useStyles from './ForgotPasswordStyle';
import API from '../../axios/axiosApi';
import { COMMON_ERR_MSG, APP_NAME } from '../../config';

const schema = {
	email: {
		presence: { allowEmpty: false, message: 'is required' },
		email: true,
		length: {
			maximum: 120,
		},
	},
};

const ForgotPassword = ({ history }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ success, setSuccess ] = useState({ status: false, message: '' });
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
				setSuccess({ status: false, message: '' });
				const response = await API.post('forgot_password', formState.values);
				setLoading(false);
				if (response.data.success) {
					setSuccess({ status: true, message: response.data.message });
				} else {
					const errorMsg = response.data.message || 'Invalid Credentials';
					setErrorMessage(errorMsg);
				}
			} catch (error) {
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
						title="Forgot Password"
						subtitle="We will send you an email with instructions on how to reset your password."
						titleProps={{
							variant: 'h3',
						}}
					/>
					{errorMessage &&
						<Alert className={classes.errorAlert} severity="error">{ errorMessage }</Alert>
					}
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
											autoComplete="off"
											autoFocus
										/>
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
											Email Me
										</Button>
									</Grid>
								</Grid>
							</form>
						)}
				</div>
			</Section>
		</div>
	);
};

export default ForgotPassword;