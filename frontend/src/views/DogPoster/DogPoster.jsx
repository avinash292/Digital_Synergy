import React, { useEffect, useState } from 'react';
// import clsx from 'clsx';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/scss/image-gallery.scss";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Snackbar from '@material-ui/core/Snackbar';

import InfoIcon from '@material-ui/icons/Info';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import useStyles from './DogPosterStyle';
import DogPosterOptions from '../../components/DogPosterOptions';
import EditorInfoGuideDialog from '../../components/EditorInfoGuideDialog';
import ConfirmProductDialog from '../../components/ConfirmProductDialog';
import API from '../../axios/axiosApi';
import { DOG_POSTER_LABEL } from '../../config';

const images = [
  {
    original: 'https://d361gbievcxqh7.cloudfront.net/asaaab/user/pages/products/portraits/pet-portraits/pet-portrait-general/images/environment/01-general.jpg',
    thumbnail: 'https://d361gbievcxqh7.cloudfront.net/asaaab/images/0/1/-/g/e/01-general-0d574ac8.jpeg',
  },
  {
    original: 'https://d361gbievcxqh7.cloudfront.net/asaaab/user/pages/products/portraits/pet-portraits/pet-portrait-general/images/environment/02-general-16x24.jpg',
    thumbnail: 'https://d361gbievcxqh7.cloudfront.net/asaaab/images/0/2/-/g/e/02-general-16x24-b9ce6e23.jpeg',
  },
  {
    original: 'https://d361gbievcxqh7.cloudfront.net/asaaab/user/pages/products/portraits/pet-portraits/pet-portrait-general/images/environment/z-customerimage-1.jpg',
    thumbnail: 'https://d361gbievcxqh7.cloudfront.net/asaaab/images/z/-/c/u/s/z-customerimage-1-a02e5db0.jpeg',
  },
];


const DogPoster = ({ history }) => {
	const classes = useStyles();

	const defaultSizes = [
		{ id: 7, class: "size_30_40", currency: "USD", label: "30_40", name: "30x40cm / 12x16inch", pdf_price: 15, price: 39, product_id: 3 },
	];

	const defaultOptions = {
		size: 0,
		materialType: 'fine_art',		
		file: { file: null, imageSource: null },
	};

	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const [confirmProductDialog, setConfirmProductDialog] = useState({ open: false, data: {} });
	const [productDetails, setProductDetails] = useState({
		sizes: defaultSizes,
	});
	const [loading, setLoading] = useState(false);
	const [snack, setSnack] = useState({ open: false, message: '' });

  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));


	useEffect(() => {
		const fetchDogPosterElements = async () => {
			try {
				setLoading(true);
				const response = await API.get('products/' + DOG_POSTER_LABEL);
				if (response.data.success && response.data.data && response.data.data.product_details) {
					const product = response.data.data.product_details;
					setSelectedOptions(selectedOptions => ({
						...selectedOptions,
						// color: product.colors[3] ? product.colors[3] : selectedOptions.color,
					}));
					setProductDetails(product);
					setLoading(false);
				} else if (response.data.success && !response.data.data.product_details) {
					setLoading(false);
					// handleSnackToogle("Product don't exists!");
					return history.push('/');
				} else {
					setLoading(false);
				}
			} catch (error) {
				console.log("ERROR in fetchDogPosterElements : ", error);
				setLoading(false);
				// const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
				// handleSnackToogle(errorMsg);
			}
		};
		fetchDogPosterElements();
	}, [history]);	


	const handleOptionChange = (options) => {
		// console.log("options : ", options);
		setSelectedOptions(options);
	};


	/**
	 * Handle info dialog toggle
	 */
	const handleInfoDialogToogle = () => {
		setInfoDialogOpen(infoDialogOpen => !infoDialogOpen);
	};


	const evaluatePrice = () => {
		let price = 69;
		if (productDetails.sizes[selectedOptions.size]) {
			switch (selectedOptions.materialType) {
				case 'fine_art'	: price = productDetails.sizes[selectedOptions.size].price;				break;
				case 'canvas'		: price = productDetails.sizes[selectedOptions.size].pdf_price;		break;
				default					: price = productDetails.sizes[selectedOptions.size].price;				break;
			}
		}
		return price;
	};

	/**
	 * Open product confirm dialog
	 * 
	 * @param {*} index 
	 */
	const openConfirmProductDialog = () => {
		if (!selectedOptions.file.file) { return handleSnackToogle("In order to continue, please upload a photo of your dog."); }
		setConfirmProductDialog({ open: true, data: {
			size: productDetails.sizes[selectedOptions.size],
			materialType: selectedOptions.materialType,
			price: evaluatePrice(),
			type: DOG_POSTER_LABEL,
			imageSource: selectedOptions.file.imageSource,
		}});
	};

	/**
	 * Handle Product Confirm dialog
	 * 
	 * @param {*} data 
	 */
	const handleProductConfirmClose = (proceed) => {
		console.log("proceed : ", proceed);
		setConfirmProductDialog({ open: false, data: {} });
		/* if (data) {
			data = { ...data, id: taskDialog.data.id };
			if (taskDialog.data.date_end) {
				data.date_start = moment(data.date_start).format("YYYY-MM-DD HH:mm:ss");
				data.date_end = moment(data.date_end).format("YYYY-MM-DD HH:mm:ss");
			} else {
				delete data.date_start;
				delete data.date_end;
			}
			updateTask(data, taskDialog.index);
		} */
	};

	const handleSnackToogle = (message) => {
		setSnack(snack => ({ open: !snack.open, message: message || '' }));
	};

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				{/* <Grid container spacing={4} > */}
				<Grid container spacing={4} direction={isDesktop ? 'row' : 'column-reverse'} >
					<Grid item xs={12} md={4} className={classes.editingOptionsColumn}>
						<Button
							variant="outlined"
							startIcon={<InfoIcon />}
							onClick={handleInfoDialogToogle}
							className={classes.guideBtn}
						>
							Guide
						</Button>
						{!loading ? (
							<DogPosterOptions
								defaultOptions={selectedOptions}
								onOptionChange={handleOptionChange}
								productDetails={productDetails}
							/>
						) : (
							<div className={classes.skeletonConatiner}>
								<Skeleton variant="rect" className={classes.topSkeleton} animation="wave" />
								<Skeleton variant="rect" className={classes.bottomSkeleton} animation="wave" />
							</div>
						)}
						<div className={classes.addToCartContainer}>
							<Button
								variant="contained"
								color="primary"
								// startIcon={<InfoIcon />}
								onClick={openConfirmProductDialog}
								className={classes.addToCartBtn}
								fullWidth
							>
								<Typography>{'$' + evaluatePrice()}</Typography>
								<Typography className={classes.addToCartBtn}><ShoppingCartIcon className={classes.cartLogo} /> Add to cart</Typography>
							</Button>
						</div>
					</Grid>

					<Grid className={classes.posterPreviewColumn} item xs={12} md={8}>
						<ImageGallery
							items={images}
							showNav={false}
							showPlayButton={false}
							showBullets={false}
						/>
					</Grid>
				</Grid>
			</div>
			<EditorInfoGuideDialog
				open={infoDialogOpen}
				onClose={handleInfoDialogToogle}
			/>
			<ConfirmProductDialog
				open={confirmProductDialog.open}
				onClose={handleProductConfirmClose}
				dialogData={confirmProductDialog.data}
			/>

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

export default DogPoster
