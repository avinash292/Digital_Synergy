import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import useStyles from './DogPosterOptionStyle';
import DogPosterGuidelines from '../DogPosterGuidelines';
import CanvasImage from './canvas.png';
import FineArtImage from './fine-art-paper.png';

// import { SERVER_PATH, COORDINATE_POSTER_PATH } from '../../config';


const DogPosterOptions = ({ defaultOptions, onOptionChange, productDetails }) => {
	const classes = useStyles();
	const [expanded, setExpanded] = useState('designPanel');
	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
	const [guidelineDialogOpen, setGuidelineDialogOpen] = useState(false);

	// const imageLayoutPath = SERVER_PATH + COORDINATE_POSTER_PATH;


	useEffect(() => {
		onOptionChange(selectedOptions);
	}, [selectedOptions, onOptionChange]);
	

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};


	const handleSizeChange = (event) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, size: event.target.value }));
	};


	const handleMaterialChange = (type) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, materialType: type }));
	};

	/**
	 * Handle upload photo guideline dialog toggle
	 * 
	 * @param {*} data 
	 */
	const handleGuidelineDialogToogle = (event, data) => {
		setGuidelineDialogOpen(guidelineDialogOpen => !guidelineDialogOpen);
		if (data) {
			setSelectedOptions(selectedOptions => ({ ...selectedOptions, file: data }));
		}
	};
	
	return (
		<Container className={classes.root}>
			<Accordion expanded={expanded === 'designPanel'} onChange={handleChange('designPanel')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="designPanel-content"
					id="designPanel-header"
				>
					<Typography className={classes.heading}>Upload your dog's photo</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion}>
					{selectedOptions.file.imageSource ? (
						<div className={classes.selectedImgContainer}>
							<img className={classes.previewImg} src={selectedOptions.file.imageSource} alt="selected" />
							<Button onClick={handleGuidelineDialogToogle} variant="outlined" startIcon={<CloudUploadIcon />}>Change photo</Button>
							<Typography variant="subtitle2" className={classes.uploadInfo}>Our artists will evaluate your image to guarantee it meets our high standards to make beautiful art. We will contact you if the quality of the image is not high enough or if the angle is not suitable for the artwork. We always send a digital proof for your final approval before print to ensure you will be satisfied with your purchase.</Typography>
						</div>
					) : (
						<Button onClick={handleGuidelineDialogToogle} variant="outlined" startIcon={<CloudUploadIcon />}>Choose photo</Button>
					)}
				</AccordionDetails>
			</Accordion>

			<Accordion expanded={expanded === 'materialPanel'} onChange={handleChange('materialPanel')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="materialPanel-content"
					id="materialPanel-header"
				>
					<Typography className={classes.heading}>Select material</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion}>

					<ButtonGroup size="large" fullWidth className={classes.btnGrp} orientation="vertical">
						<Button
							className={selectedOptions.materialType === 'fine_art' ? classes.activeBtn : null }
							onClick={() => handleMaterialChange('fine_art')}
						>
							<MaterialItem
								Image={FineArtImage}
								title="Fine art paper"
								startingFrom={productDetails.sizes[0] ? `From $${productDetails.sizes[0].price}` : 'From $39'}
								subtitle="Enhanced Matte Art 200gsm premium-quality heavyweight fine art paper gentle textured surface. Brilliant vibrant colours, deep blacks and almost three dimensional depth. Perfect for fine art."
							/>
						</Button>

						<Button
							className={selectedOptions.materialType === 'canvas' ? classes.activeBtn : null }
							onClick={() => handleMaterialChange('canvas')}
						>
							<MaterialItem
								Image={CanvasImage}
								title="Canvas"
								startingFrom={productDetails.sizes[0] ? `From $${productDetails.sizes[0].pdf_price}` : 'From $65'}
								subtitle="High definition artist-grade 400gsm canvas using giclée fine art printing process reproducing image details with outstanding results. Hand-strung onto a 38mm canvas frame."
							/>
						</Button>
					</ButtonGroup>
				</AccordionDetails>
			</Accordion>
	
			<Accordion expanded={expanded === 'sizePanel'} onChange={handleChange('sizePanel')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="sizePanel-content"
					id="sizePanel-header"
				>
					<Typography className={classes.heading}>Choose size</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion}>
					<FormControl fullWidth variant="outlined" margin="dense">
						<InputLabel id="select-label">Size</InputLabel>
						<Select
							labelId="select-label"
							id="select-outlined"
							name="status"
							fullWidth
							value={selectedOptions.size}
							onChange={handleSizeChange}
							labelWidth={40}
						>
							{productDetails.sizes.map((size, index) => (
								<MenuItem value={index} key={index}>
									<PhotoAlbumIcon /> {size.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* <ButtonGroup size="large" fullWidth className={classes.btnGrp}>
						<Button
							className={selectedOptions.purchaseType === 'print' ? classes.activeBtn : null }
							onClick={() => handlePurchaseTypeChange('print')}
						>
							Print
						</Button>
						<Button
							className={selectedOptions.purchaseType === 'pdf' ? classes.activeBtn : null }
							onClick={() => handlePurchaseTypeChange('pdf')}
						>
							PDF only
						</Button>
					</ButtonGroup> */}
				</AccordionDetails>
			</Accordion>


			<DogPosterGuidelines
				open={guidelineDialogOpen}
				onClose={handleGuidelineDialogToogle}
				// onFileChange={handleFileChange}
			/>
		</Container>
	);
};

const MaterialItem = ({ Image, title, startingFrom, subtitle }) => {
	const classes = useStyles();
	return (
		<div className={classes.materialItemContainer}>
			<img className={classes.materialImage} src={Image} alt="title" />								
			<div className={classes.content}>
				<div className={classes.titlePriceContainer}>
					<Typography className={classes.title}>{title}</Typography>
					<Typography color='primary' className={classes.price}><i>{startingFrom}</i></Typography>
				</div>
				<Typography variant="subtitle2" className={classes.subtitle}>{subtitle}</Typography>
			</div>
		</div>
	);
};


DogPosterOptions.propTypes = {
	defaultOptions: PropTypes.object.isRequired,
	onOptionChange: PropTypes.func.isRequired,
	productDetails: PropTypes.object.isRequired,
};

export default DogPosterOptions;