import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	addToCartBtn: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cartLogo: {
		margin: theme.spacing(1),
	},
}));


const AddToCartButton = ({ openConfirmProductDialog, evaluatePrice, processing }) => {
	processing = processing || false;
	const classes = useStyles();
	return (
		<Button
			variant="contained"
			color="primary"
			// startIcon={<InfoIcon />}
			onClick={openConfirmProductDialog}
			className={classes.addToCartBtn}
			disabled={processing}
			fullWidth
		>
			<Typography>{'$' + evaluatePrice()}</Typography>
			<Typography className={classes.addToCartBtn}><ShoppingCartIcon className={classes.cartLogo} /> Add to cart</Typography>
		</Button>
	);
};


AddToCartButton.propTypes = {
	openConfirmProductDialog: PropTypes.func.isRequired,
	evaluatePrice: PropTypes.func.isRequired,
};

export default AddToCartButton;