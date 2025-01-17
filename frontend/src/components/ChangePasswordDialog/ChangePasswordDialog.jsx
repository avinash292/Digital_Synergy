import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import validate from 'validate.js';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import useStyles from './ChangePasswordDialogStyle';
import useCommonStyles from '../../common/style';

const schema = {
	password: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 128,
			minimum: 8
		}
	},
	confirm: {
		presence: true,
		equality: {
			attribute: "password",
			message: "^Password and Confirm Password doesn't match"
		}
	},
};

const ChangePasswordDialog = (props) => {
	const classes = useStyles();
	const commonClasses = useCommonStyles();
	const { open, onClose } = props;
	// const formRef = useRef(null);
	
	const [formState, setFormState] = useState({
		isValid: false,
		values: {},
		touched: {},
		errors: {}
	});
	
	useEffect(() => {
		setFormState(formState => ({
			...formState,
			values: {},
			touched: {}
		}));
	}, [open]);

	useEffect(() => {
		const errors = validate(formState.values, schema);

		setFormState(formState => ({
		...formState,
		isValid: errors ? false : true,
		errors: errors || {}
		}));
	}, [formState.values]);

	/**
	 * Handle field change
	 * 
	 * @param {*} event 
	 */
	const handleChange = event => {
		event.persist();

		setFormState(formState => ({
		...formState,
		values: {
			...formState.values,
			[event.target.name]:
			event.target.type === 'checkbox'
				? event.target.checked
				: event.target.value
		},
		touched: {
			...formState.touched,
			[event.target.name]: true
		}
		}));
	};
	
	const hasError = field =>
		formState.touched[field] && formState.errors[field] ? true : false;

   
	
	const handleSave = () => {
		onClose(formState.values);  
	};

	return (
		<Dialog classes={{ paper: commonClasses.dialogueFullwidth }} onClose={() => onClose()} aria-labelledby="customized-dialog-title" open={open}>
			<AppBar position="static" className={classes.dialogHeader} elevation={2}>
				<Typography variant="h5" color="inherit" className={classes.dialogTitle}>
					Change Password
				</Typography>
				<IconButton aria-label="delete" onClick={() => onClose()} color="inherit">
					<CloseIcon />
				</IconButton>
			</AppBar>
			<DialogContent className={classes.dialogContent}>
				<form className={classes.form} onSubmit={handleSave}>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							md={6}
							xs={12}
						>
							<TextField
								className={classes.inputField}
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
								autoComplete="new-password"
								required
							/>
						</Grid>
						<Grid
							item
							md={6}
							xs={12}
						>
							<TextField
								className={classes.inputField}
								error={hasError('confirm')}
								fullWidth
								helperText={
									hasError('confirm') ? formState.errors.confirm[0] : null
								}
								label="Confirm Password"
								name="confirm"
								onChange={handleChange}
								type="password"
								value={formState.values.confirm || ''}
								variant="outlined"
								autoComplete="new-password"
								required
							/>
						</Grid>
					</Grid>
				</form>
			</DialogContent>
			<DialogActions className={classes.dialogActions}>
				<Button autoFocus onClick={handleSave} color="primary" disabled={!formState.isValid}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ChangePasswordDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ChangePasswordDialog;