import React, { useEffect, useState } from 'react';
// import clsx from 'clsx';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import useStyles from './CartStyle';
import API from '../../axios/axiosApi';
// import { Section } from 'components/organisms';
import { SectionHeader } from 'components/molecules';
import { formatUnderscore, formatCurrency, convertDMS } from 'utils/formatter';
import { COMMON_ERR_MSG, SERVER_PATH, PRODUCT_FILE_PATH } from '../../config';
import { updateCartCount, decrementCartCount } from '../../redux/actions';

const productImagePath = SERVER_PATH + PRODUCT_FILE_PATH;

const Cart = ({ history, updateCartCount, decrementCartCount }) => {
	const classes = useStyles();
	const [cart, setCart] = useState({});
	const [loading, setLoading] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [snack, setSnack] = useState({ open: false, message: '' });

  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));


	useEffect(() => {
		const fetchCart = async () => {
			try {
				setLoading(true);
				const response = await API.get('cart');
				if (response.data.success && response.data.data) {
					const cartDetails = response.data.data.cart;
					setCart(response.data.data.cart);
					updateCartCount((cartDetails && cartDetails.cart_products && cartDetails.cart_products.length) ? cartDetails.cart_products.length : 0)
				}
				setLoading(false);
			} catch (error) {
				console.log("ERROR in fetchCart : ", error);
				setLoading(false);
				const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
				handleSnackToogle(errorMsg);
			}
		};
		fetchCart();
	}, [updateCartCount]);

	/**
	 * Delete product from cart
	 * 
	 * @param {Number} index 
	 */
	const deleteFromCart = async (index) => {
		// console.log(cart.cart_products[index]);
		const imgPath = cart.cart_products[index].image_path;
		const pdfPath = cart.cart_products[index].pdf_path;
		try {
			setProcessing(true);
			const response = await API.delete(`cart/${cart.cart_products[index].id}/${pdfPath}/${imgPath}`);
			if (response.data.success) {
				let cartProducts = [ ...cart.cart_products ];
				cartProducts.splice(index, 1)
				setCart(cart => ({
					...cart,
					cart_products: cartProducts
				}));
				decrementCartCount();
				handleSnackToogle(response.data.message);
			}
			setProcessing(false);
		} catch (error) {
			console.log("ERROR in fetchCart : ", error);
			setProcessing(false);
			const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
			handleSnackToogle(errorMsg);
		}
	};

	/**
	 * Set text component as per the poster type
	 */
	const setTextComponent = (cartItem) => {
		switch (cartItem.product.label) {
			case 'star_map'						: return <StarMapTextComponent cartItem={cartItem} />;
			case 'city_map'						: return <CityMapTextComponent cartItem={cartItem} />;
			case 'coordinate_poster'	: return <CoordinatePosterTextComponent cartItem={cartItem} />;
			case 'family_poster'			: return <FamilyPosterTextComponent cartItem={cartItem} />;
			default										: return <CityMapTextComponent cartItem={cartItem} />;
		}
	};

	const evaluateTotalPrice = () => {
		if (!cart.cart_products) { return '0'; }
		let total = 0;
		cart.cart_products.forEach(item => {
			total += item.purchaseType === "print" ? item.size.price : item.size.pdf_price;
		});
		return '$' + formatCurrency(total);
	};

	/**
	 * Proceed to checkout screen
	 */
	 const proccedToCheckout = () => {
		history.push('/checkout');
	};

	const handleSnackToogle = (message) => {
		setSnack(snack => ({ open: !snack.open, message: message || '' }));
	};

	return (
		<div className={classes.root}>
      {/* <Section className={classes.section}> */}
			<div className={classes.pageTitle}>
				{isDesktop ? (
					<Button
						size="small"
						startIcon={<ArrowBackIcon />}
						onClick={() => history.goBack()}
					>
						Continue shopping
					</Button>
				) : (
					<IconButton size="small" aria-label="go-back" onClick={() => history.goBack()}>
						<ArrowBackIcon />
					</IconButton>
				)}
				<Typography variant="h3">Cart Summary</Typography>
				<div className={classes.spacer} />
			</div>
			<div className={classes.content}>
			{loading ? (
				<Container>
					<Skeleton variant="rect" className={classes.skeletonLoader} animation="wave" />
				</Container>
			) : (
				cart.cart_products && cart.cart_products.length ? (
					<Container>
						{cart.cart_products.map((cartItem, index) => (
							<Paper key={index} className={classes.cartItem}>
								<div className={classes.itemImageContainer}>
									<img src={productImagePath + cartItem.image_path} alt="product" className={classes.itemImage} />
									{!isDesktop && <RemoveButton className={classes.removeBtn} disabled={processing} onClick={() => deleteFromCart(index)} /> }
								</div>
								<Grid container spacing={4} direction="row" className={classes.itemDetails}>
									{setTextComponent(cartItem)}
									<Grid item xs={12} md={6} >
										<Typography>Size: {cartItem.size.name}</Typography>
										<Typography>Medium: {formatUnderscore(cartItem.purchaseType)}</Typography>
										<Typography variant="h6">Price: ${formatCurrency(cartItem.purchaseType === 'pdf' ? cartItem.size.pdf_price : cartItem.size.price)}</Typography>
									</Grid>
								</Grid>
								{isDesktop && <RemoveButton onClick={() => deleteFromCart(index)} disabled={processing} /> }
							</Paper>
						))}

						<div className={classes.bottomContainer}>
							<div className={classes.totalSpacer}></div>
							<div className={classes.totalContainer}>
								<div className={classes.priceContent}>
									<Typography variant="h6">Total</Typography>
									<Typography variant="h6">{evaluateTotalPrice()}</Typography>
								</div>
								<Button
									variant="contained"
									color="primary"
									fullWidth
									onClick={proccedToCheckout}
									disabled={processing}
								>
									Checkout
								</Button>
								</div>
							</div>
					</Container>
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
				)
			)}
			</div>

			{/* </Section> */}
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={snack.open}
				onClose={() => handleSnackToogle()}
				message={snack.message}
				autoHideDuration={2000}
			/>
		</div>
	);
};

const StarMapTextComponent = ({ cartItem }) => {
	// const classes = useStyles();
	return (
		<Grid item xs={12} md={6} >
			<RowComponent label="Product Name" value={cartItem.product.name} />
			<RowComponent label="Shape" value={cartItem.shape ? cartItem.shape.name : '-'} />
			<RowComponent label="Layout" value={cartItem.layout ? cartItem.layout.name : '-'} />
			<RowComponent label="Title" value={cartItem.product_data.text.title} />
			<RowComponent label="Place Text" value={cartItem.product_data.text.placeText} />
			<RowComponent label="Tagline" value={cartItem.product_data.location ? convertDMS(cartItem.product_data.location.lat, cartItem.product_data.location.lng) : '-'} />
			{ cartItem.product_data.text.message && <RowComponent label="Message" value={cartItem.product_data.text.message} />}			
		</Grid>
	);
};

const CityMapTextComponent = ({ cartItem }) => {
	return (
		<Grid item xs={12} md={6} >
			<RowComponent label="Product Name" value={cartItem.product.name} />
			<RowComponent label="Shape" value={cartItem.shape ? cartItem.shape.name : '-'} />
			<RowComponent label="Layout" value={cartItem.layout ? cartItem.layout.name : '-'} />
			<RowComponent label="Title" value={cartItem.product_data.text.title} />
			<RowComponent label="Subtitle" value={cartItem.product_data.text.subtitle} />
			<RowComponent label="Tagline" value={cartItem.product_data.text.coordinates} />
			{ cartItem.product_data.text.message && <RowComponent label="Message" value={cartItem.product_data.text.message} />}
		</Grid>
	);
};

const CoordinatePosterTextComponent = ({ cartItem }) => {
	return (
		<Grid item xs={12} md={6} >
			<RowComponent label="Product Name" value={cartItem.product.name} />
			<RowComponent label="Layout" value={cartItem.layout ? cartItem.layout.name : '-'} />
			<RowComponent label="Title" value={cartItem.product_data.text.title} />
			<RowComponent label="Subtitle" value={cartItem.product_data.text.subtitle} />
			<RowComponent label="Tagline" value={cartItem.product_data.location ? convertDMS(cartItem.product_data.location.lat, cartItem.product_data.location.lng) : '-'} />
		</Grid>
	);
};

const FamilyPosterTextComponent = ({ cartItem }) => {
	return (
		<Grid item xs={12} md={6} >
			<RowComponent label="Product Name" value={cartItem.product.name} />
			<RowComponent label="Layout" value={cartItem.layout ? cartItem.layout.name : '-'} />
			<RowComponent label="Title" value={cartItem.product_data.text.top} />
		</Grid>
	);
};

const RowComponent = ({ label, value }) => {
	const classes = useStyles();
	return (
		<div className={classes.row}>
			<Typography className={classes.rowTitle}>{label}:</Typography>
			<Typography variant="subtitle2">{value ? value : '-'}</Typography>
		</div>
	);
};

const RemoveButton = ({ onClick, processing, ...rest }) => {
	return (
		<Button
			{...rest}
			variant="outlined"
			color="secondary"
			startIcon={<DeleteForeverIcon />}
			onClick={onClick}
		>
			Remove
		</Button>
	)
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateCartCount: cartCount => dispatch(updateCartCount(cartCount)),
		decrementCartCount: increment => dispatch(decrementCartCount(increment)),
	};
};

export default connect(null, mapDispatchToProps)(Cart);
