import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import useStyles from '../CoordinatePosterOptionStyle';
import SizeSection from '../../SizeSection';
import { DesignSection, LocationSection } from '../sections';


const CPODesktop = ({ defaultOptions, onOptionChange, productDetails }) => {
	const classes = useStyles();
	const [expanded, setExpanded] = useState('placePanel');
	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);


	useEffect(() => {
		onOptionChange(selectedOptions);
	}, [selectedOptions, onOptionChange]);
	

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const handleLayoutChange = (layout) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, layout }));
	};

	const handleInputChange = (event) => {
		setSelectedOptions(selectedOptions => ({
			...selectedOptions,
			text: {
				...selectedOptions.text,
				[event.target.name]: event.target.value
			}
		}));
	};

	const handlePlaceSelection = (place) => {
		// console.log(place);
		// console.log(place.geometry.location.lng());
		setSelectedOptions(selectedOptions => ({
			...selectedOptions,
			location: {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng(),
				place: (place.address_components[0] && place.address_components[0].long_name) ? place.address_components[0].long_name : (place.address_components[0].short_name ? place.address_components[0].short_name : selectedOptions.location.place)
			},
			text: {
				...selectedOptions.text,
				title: (place.address_components[0] && place.address_components[0].long_name) ? place.address_components[0].long_name : (place.address_components[0].short_name ? place.address_components[0].short_name : selectedOptions.location.place)  
			}
		}));
	};

	const handleSizeChange = (event) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, size: event.target.value }));
	};

	const handleColorChange = (color) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, color }));
	};

	const handlePurchaseTypeChange = (type) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, purchaseType: type }));
	};

	
	return (
		<Container className={classes.root}>
			
			<Accordion expanded={expanded === 'placePanel'} onChange={handleChange('placePanel')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="placePanel-content"
					id="placePanel-header"
				>
					<Typography className={classes.heading}>Choose Location</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion}>
					<LocationSection
						selectedOptions={selectedOptions}
						onPlaceSelection={handlePlaceSelection}
					/>
				</AccordionDetails>
			</Accordion>


			<Accordion expanded={expanded === 'designPanel'} onChange={handleChange('designPanel')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="designPanel-content"
					id="designPanel-header"
				>
					<Typography className={classes.heading}>Choose Design</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion}>
					<DesignSection
						productDetails={productDetails}
						selectedOptions={selectedOptions}
						onColorChange={handleColorChange}
						onLayoutChange={handleLayoutChange}
						onInputChange={handleInputChange}
					/>
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
					<SizeSection
						selectedOptions={selectedOptions}
						productDetails={productDetails}
						onSizeChange={handleSizeChange}
						onPurchaseTypeChange={handlePurchaseTypeChange}
					/>
				</AccordionDetails>
			</Accordion>
		</Container>
	);
};

CPODesktop.propTypes = {
	defaultOptions: PropTypes.object.isRequired,
	onOptionChange: PropTypes.func.isRequired,
	productDetails: PropTypes.object.isRequired,
};

export default CPODesktop;