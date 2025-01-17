import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import TitleIcon from '@material-ui/icons/Title';

import useStyles from './ConfirmProductDialogStyle';
import useCommonStyles from '../../common/style';



const ConfirmProductDialog = ({ open, onClose, dialogData }) => {
	const classes = useStyles();
	const commonClasses = useCommonStyles();
	const fullScreen = useMediaQuery(theme => theme.breakpoints.down('xs'));

	/* React.useEffect(() => {
		console.log("dialogData : ", dialogData);
	}, [open, dialogData]); */
   
	/**
	 * Close and pass data on close
	 */
	const handleProceed = () => {
		onClose(true);  
	};

	/**
	 * Set text component as per the poster type
	 */
	const setTextComponent = () => {

		switch (dialogData.type) {
			case 'star_map'		: return <StarMapTextComponent dialogData={dialogData} />
			case 'city_map'		:
			case 'coordinate_poster': return <CityMapTextComponent dialogData={dialogData} />
			case 'dog_poster'	: return <DogPosterImageComponent dialogData={dialogData} />
			case 'family_poster'	: return <FamilyPosterTextComponent dialogData={dialogData} />
			default						: return <StarMapTextComponent dialogData={dialogData} />
		}
	};

	const setProductType = () => {
		let productType = '';
		if (dialogData.type === 'dog_poster' && dialogData.materialType) {
			productType = dialogData.materialType === "fine_art" ? 'Fine art paper' : 'Canvas';
		} else {
			productType = dialogData.purchaseType === 'print' ? 'Print' : 'PDF only';
		}
		return productType;
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			classes={{ paper: commonClasses.dialogueFullwidth }}
			onClose={() => onClose()}
			aria-labelledby="confirm-product-dialog"
			open={open}
		>
			<AppBar position="static" className={classes.dialogHeader} elevation={2}>
				<Typography variant="h6" color="inherit" className={classes.dialogTitle}>
					Well done!
				</Typography>
				<IconButton aria-label="delete" onClick={() => onClose()} color="inherit">
					<CloseIcon />
				</IconButton>
			</AppBar>
			<DialogContent className={classes.dialogContent}>
				<Typography><i>Please check that all the details are correct.</i></Typography>
					{setTextComponent()}
				<Box className={classes.contentBox}>
					<div>
						<Typography><b>Size: </b> {dialogData.size ? dialogData.size.name : ''}</Typography>
						<Typography><b>Product Type: </b>{setProductType()}</Typography>
						<Typography><b>Price: </b> {dialogData.price ? '$' + dialogData.price : ''}</Typography>
					</div>
					<AspectRatioIcon />
				</Box>
			</DialogContent>
			<DialogActions className={classes.dialogActions}>
				<Button
					autoFocus
					variant="contained"
					color="primary"
					onClick={handleProceed}
					className={classes.addToCartBtn}
					fullWidth
				>
					<Typography>{dialogData.price ? '$' + dialogData.price : ''}</Typography>
					<Typography className={classes.addToCartBtn}><ShoppingCartIcon className={classes.cartLogo} /> Add to cart</Typography>
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const CityMapTextComponent = ({ dialogData }) => {
	const classes = useStyles();
	return (
		<Box className={classes.contentBox}>
			<div>
				<Typography><b>Title: </b> {dialogData.text ? dialogData.text.title : ''}</Typography>
				<Typography><b>Subtitle: </b> {dialogData.text ? dialogData.text.subtitle : ''}</Typography>
				<Typography><b>Coordinates: </b> {dialogData.text ? dialogData.text.coordinates : ''}</Typography>
				{dialogData.layout &&  dialogData.layout.label === "layout_1" && 
					<Typography><b>Message: </b> {dialogData.text ? dialogData.text.message : ''}</Typography>
				}
			</div>
			<TitleIcon />
		</Box>
	);
};

const StarMapTextComponent = ({ dialogData }) => {
	const classes = useStyles();
	return (
		<Box className={classes.contentBox}>
			<div>
				<Typography><b>Title: </b> {dialogData.text ? dialogData.text.title : ''}</Typography>
				<Typography><b>Message: </b> {dialogData.text ? dialogData.text.message : ''}</Typography>
				<Typography><b>Place Text: </b> {dialogData.text ? dialogData.text.placeText : ''}</Typography>
				<Typography><b>Date: </b> {dialogData.date ? dialogData.date : ''}</Typography>
			</div>
			<TitleIcon />
		</Box>
	);
};

const FamilyPosterTextComponent = ({ dialogData }) => {
	const classes = useStyles();
	return (
		<Box className={classes.contentBox}>
			<div>
				<Typography><b>Family Name: </b> {dialogData.text ? dialogData.text.title : ''}</Typography>
				{ dialogData.layout === "layout_2" &&
					<Typography><b>Family Quote: </b> {dialogData.text && dialogData.text.subtitle ? dialogData.text.subtitle : '-'}</Typography>
				}
			</div>
			<TitleIcon />
		</Box>
	);
};

const DogPosterImageComponent = ({ dialogData }) => {
	const classes = useStyles();
	return (
		<div>
			<img className={classes.previewImg} src={dialogData.imageSource} alt="selected" />
		</div>
	);
};

ConfirmProductDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	dialogData: PropTypes.object.isRequired,
};

export default ConfirmProductDialog;