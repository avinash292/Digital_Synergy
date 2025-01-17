import React, { useEffect, useState } from 'react';
// import clsx from 'clsx';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Skeleton from '@material-ui/lab/Skeleton';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GetAppIcon from '@material-ui/icons/GetApp';

import useStyles from './OrderDetailStyle';
// import useCommonStyles from '../../common/style';
import API from '../../axios/axiosApi';
import { formatDate, formatCurrency, formatUnderscore, convertDMS } from 'utils/formatter';
import { COMMON_ERR_MSG, SERVER_PATH, PRODUCT_FILE_PATH } from '../../config';

const productPath = SERVER_PATH + PRODUCT_FILE_PATH;


const OrderDetails = ({ match: { params }, history }) => {
	const classes = useStyles();
	// const commonClasses = useCommonStyles();
	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState({});
	const [snack, setSnack] = useState({ open: false, message: '' });
	// const debouncedSearch = useDebounce(search, 500);

	const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));


	useEffect(() => {
		const fetchOrderDetails = async () => {
			try {
				setLoading(true);
				const response = await API.get('orders/' + params.id);
				setLoading(false);
				if (response.data.success && response.data.data.order_details) {
					setOrder(response.data.data.order_details);
				} else {
					history.replace('/orders');
				}
			} catch (error) {
				console.log("ERROR in fetchOrderDetails : ", error);
				setLoading(false);
				const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
				handleSnackToogle(errorMsg);
			}
		};
		fetchOrderDetails();
	}, [params, history]);


	const handleSnackToogle = (message) => {
		setSnack(snack => ({ open: !snack.open, message: message || '' }));
	};

	return (
		<div className={classes.root}>
			<div className={classes.pageTitle}>
				<IconButton aria-label="go-back" onClick={() => history.goBack()} size={isDesktop ? 'medium' : 'small'}>
					<ArrowBackIcon />
				</IconButton>
				<Typography variant="h3">Order Details</Typography>
				<div className={classes.spacer} />
			</div>
			<div className={classes.content}>
			{loading ? (
				<Grid container spacing={3} direction={isDesktop ? 'row' : 'column'}>
					<Grid item md={4} xs={12}>
						<Skeleton variant="rect" className={classes.skeletonLoaderLeft} animation="wave" />
					</Grid>
					<Grid item md={8} xs={12}>
						<Skeleton variant="rect" className={classes.skeletonLoader} animation="wave" />
					</Grid>
				</Grid>
			) : (
				<Grid container spacing={3} direction={isDesktop ? 'row' : 'column'}>
					<Grid item md={4} xs={12}>
						<OrderInfo order={order} />
					</Grid>

					<Grid item md={8} xs={12}>
						<Paper>
							<Typography className={classes.cardTitle} variant="h6"><b>Order Items</b></Typography>
							<Divider />
							{order.order_products && order.order_products.map((orderItem, index) => (
								<ProductComponent key={index} orderItem={orderItem} />
							))}
						</Paper>
					</Grid>
				</Grid>
			)}
			</div>

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

const ProductComponent = ({ orderItem }) => {
	const classes = useStyles();

	const downloadPdf = (e)  => {
		e.preventDefault(); // stop the browser from following
		const file_path = productPath + orderItem.pdf_path;
    // window.location.href = file_path;
		// console.log("downloadPdf : ", orderItem);
		let a = document.createElement('a');
		a.href = file_path;
		a.download = orderItem.pdf_path;
		// a.setAttribute('href', file_path);
 		// a.setAttribute('download', file_path.substr(file_path.lastIndexOf('/') + 1) || '');
		a.target = '_blank';
		a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
		}, 100);

	// 	var filePath = productPath + orderItem.pdf_path; 
  //   var save = document.createElement('a');  
  //   save.href = filePath; 
  //   save.download = "Your file name here"; 
  //   save.target = '_blank'; 
  //   var event = document.createEvent('Event');
  //   event.initEvent('click', true, true); 
  //   save.dispatchEvent(event);
  //  (window.URL || window.webkitURL).revokeObjectURL(save.href);

		// window.location.assign(file_path);
		// window.open(file_path, '_blank');

	};

	/**
	 * Set text component as per the poster type
	 */
	const setTextComponent = (orderItem) => {
		switch (orderItem.product_data.product.label) {
			case 'star_map'						: return <StarMapTextComponent orderItem={orderItem} />;
			case 'city_map'						: return <CityMapTextComponent orderItem={orderItem} />;
			case 'coordinate_poster'	: return <CoordinatePosterTextComponent orderItem={orderItem} />;
			case 'family_poster'			: return <FamilyPosterTextComponent orderItem={orderItem} />;
			default										: return <CityMapTextComponent orderItem={orderItem} />;
		}
	};

	return (
		<div>
			<div className={classes.productItem}>
				<img src={productPath + orderItem.image_path} alt="product" className={classes.itemImage} />
				<Grid container spacing={4} direction="row" className={classes.itemDetails}>
					{setTextComponent(orderItem)}
					<Grid item xs={12} sm={6} className={classes.itemPriceDetails}>
						<div>
							<Typography>Size: {orderItem.product_data.size.name}</Typography>
							<Typography>Medium: {formatUnderscore(orderItem.purchaseType)}</Typography>
							<Typography variant="h6">Price: ${formatCurrency(orderItem.price)}</Typography>
						</div>
						{/* {orderItem.purchaseType === 'pdf' && 
							<a href={productPath + orderItem.pdf_path} target="_blank" download={orderItem.image_path}>Download it!</a>
						} */}
						{orderItem.purchaseType === 'pdf' && 
							<Button
								variant="outlined"
								startIcon={<GetAppIcon />}
								onClick={downloadPdf}
							>
								Download PDF
							</Button>
						}
					</Grid>
				</Grid>
			</div>
			<Divider style={{ width: '100%' }} />
		</div>
	);
};

const OrderInfo = ({ order }) => {
	const classes = useStyles();

	const evaluateAddress = (addresses, type) => {
		if (!addresses || !addresses.length) { return '-'; }
		let fullAddress;
		addresses.forEach(address => {
			if (address.type === type) {
				fullAddress = (
					<div>
						{address.full_name} <br />
						Mobile: {address.mobile} <br />
						{address.address} <br />
						{address.city}, {address.state} <br />
						{address.postal_code}, {address.country} <br />
					</div>
				);
			}
		});
		return fullAddress;
	};

	return (
		<Paper>
			<Typography className={classes.cardTitle} variant="h6"><b>Order Info</b></Typography>
			<Divider />
			<TableContainer>
				<Table className={classes.table} size='medium'>
					<TableBody>
						<TableRow>
							<TableCell scope="row">Order ID</TableCell>
							<TableCell scope="row">{order.order_number}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell scope="row">Total Quantity</TableCell>
							<TableCell scope="row">{order.total_quantity}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell scope="row">Total Amount</TableCell>
							<TableCell scope="row">${formatCurrency(order.total_price)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell scope="row">Status</TableCell>
							<TableCell scope="row">{formatUnderscore(order.order_status)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell scope="row">Order Date</TableCell>
							<TableCell scope="row">{formatDate(order.createdAt)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell scope="row">Billing Address</TableCell>
							<TableCell scope="row">{evaluateAddress(order.addresses, 'billing')}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell scope="row">Shipping Address</TableCell>
							<TableCell scope="row">{evaluateAddress(order.addresses, 'shipping')}</TableCell>
						</TableRow>
						{(order && order.order_shipments && order.order_shipments[0] && (order.order_shipments[0].shipping_id || order.order_shipments[0].shipping_url)) ? (
							<TableRow>
								<TableCell scope="row">Shipment Details</TableCell>
								<TableCell scope="row">
									<Typography><b>Tracking ID : </b> {order.order_shipments[0].shipping_id ? order.order_shipments[0].shipping_id : '-'}</Typography>
									<Typography>
										<b>Tracking URL : </b>
										{order.order_shipments[0].shipping_url ? (
											<a href={order.order_shipments[0].shipping_url ? order.order_shipments[0].shipping_url : ''} target="_blank" rel="noreferrer">{order.order_shipments[0].shipping_url}</a>
										) : '-' }
										</Typography>
								</TableCell>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

const StarMapTextComponent = ({ orderItem }) => {
	const productData = orderItem.product_data;
	return (
		<Grid item xs={12} md={6} >
			<RowComponent label="Product Name" value={productData.product.name} />
			<RowComponent label="Shape" value={productData.shape ? productData.shape.name : '-'} />
			<RowComponent label="Layout" value={productData.layout ? productData.layout.name : '-'} />
			<RowComponent label="Title" value={productData.text.title} />
			<RowComponent label="Place Text" value={productData.text.placeText} />
			<RowComponent label="Tagline" value={productData.location ? convertDMS(productData.location.lat, productData.location.lng) : '-'} />
			{ productData.text.message && <RowComponent label="Message" value={productData.text.message} />}			
		</Grid>
	);
};

const CityMapTextComponent = ({ orderItem }) => {
	const productData = orderItem.product_data;
	return (
		<Grid item xs={12} md={6} >
			<RowComponent label="Product Name" value={productData.product.name} />
			<RowComponent label="Shape" value={productData.shape ? productData.shape.name : '-'} />
			<RowComponent label="Layout" value={productData.layout ? productData.layout.name : '-'} />
			<RowComponent label="Title" value={productData.text.title} />
			<RowComponent label="Subtitle" value={productData.text.subtitle} />
			<RowComponent label="Tagline" value={productData.text.coordinates} />
			{ productData.text.message && <RowComponent label="Message" value={productData.text.message} />}
		</Grid>
	);
};

const CoordinatePosterTextComponent = ({ orderItem }) => {
	const productData = orderItem.product_data;
	return (
		<Grid item xs={12} md={6} >
			<RowComponent label="Product Name" value={productData.product.name} />
			<RowComponent label="Layout" value={productData.layout ? productData.layout.name : '-'} />
			<RowComponent label="Title" value={productData.text.title} />
			<RowComponent label="Subtitle" value={productData.text.subtitle} />
			<RowComponent label="Tagline" value={productData.location ? convertDMS(productData.location.lat, productData.location.lng) : '-'} />
		</Grid>
	);
};


const FamilyPosterTextComponent = ({ orderItem }) => {
	const productData = orderItem.product_data;
	return (
		<Grid item xs={12} md={6} >
			<RowComponent label="Product Name" value={productData.product.name} />
			<RowComponent label="Layout" value={productData.layout ? productData.layout.name : '-'} />
			<RowComponent label="Title" value={productData.text.title ? productData.text.title : '-'} />
			{productData.text.subtitle && <RowComponent label="Subtitle" value={productData.text.subtitle} /> }
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


export default OrderDetails;
