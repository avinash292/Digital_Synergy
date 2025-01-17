import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import useStyles from '../StarMapOptionStyle';
import { DesignSection, DatePlaceSection, CustomizeSection } from '../sections';
import SizeSection from '../../SizeSection';


const SMODesktop = ({ defaultOptions, defautCelestialConfig, onOptionChange, onCelestialConfigChange, productDetails, onLayoutChange }) => {
	const classes = useStyles();
	const [expanded, setExpanded] = useState('placePanel');
	const [celestialConfiguration, setCelestialConfiguration] = useState(defautCelestialConfig);
	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);

	/* useEffect(() => {
		console.log("layout : ", selectedOptions.layout.label);
	}, [selectedOptions]); */

	useEffect(() => {
		onOptionChange(selectedOptions);
	}, [selectedOptions, onOptionChange]);
	
	useEffect(() => {
		onCelestialConfigChange(celestialConfiguration);
	}, [celestialConfiguration, onCelestialConfigChange]);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const handleShapeChange = (shape) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, shape }));
	};

	const handleLayoutChange = (layout) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, layout }));
		onLayoutChange(layout);
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

	const handleSizeChange = (event) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, size: event.target.value }));
	};

	const handleElementToggle = (name) => {
		setCelestialConfiguration(celestialConfiguration => ({
			...celestialConfiguration,
			elements: {
				...celestialConfiguration.elements,
				[name]: !celestialConfiguration.elements[name]
			}
		}));
	};

	const handleDateChange = (date) => {
		setCelestialConfiguration(celestialConfiguration => ({ ...celestialConfiguration, date }));
	};

	const handlePlaceSelection = (place) => {
		// console.log(place);
		// console.log(place.geometry.location.lng());
		setCelestialConfiguration(celestialConfiguration => ({
			...celestialConfiguration,
			location: {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng(),
				place: (place.address_components[0] && place.address_components[0].long_name) ? place.address_components[0].long_name : (place.address_components[0].short_name ? place.address_components[0].short_name : celestialConfiguration.location.place)  
			}
		}));
		setSelectedOptions(selectedOptions => ({
			...selectedOptions,
			text: {
				...selectedOptions.text,
				placeText: place.address_components[0] ? place.address_components[0].long_name : selectedOptions.text.placeText
			}
		}));
	};

	const handleColorChange = (color) => {
		setCelestialConfiguration(celestialConfiguration => ({ ...celestialConfiguration, color }));
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
					<Typography className={classes.heading}>Enter place and date</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion}>
					<DatePlaceSection
						productDetails={productDetails}
						selectedOptions={selectedOptions}
						celestialConfiguration={celestialConfiguration}
						onPlaceSelection={handlePlaceSelection}
						onDateChange={handleDateChange}
						onInputChange={handleInputChange}
					/>
				</AccordionDetails>
			</Accordion>

			<Accordion expanded={expanded === 'customizePanel'} onChange={handleChange('customizePanel')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="customizePanel-content"
					id="customizePanel-header"
				>
					<Typography className={classes.heading}>Customize</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion}>
					<CustomizeSection
						productDetails={productDetails}
						selectedOptions={selectedOptions}
						celestialConfiguration={celestialConfiguration}
						onElementToggle={handleElementToggle}
						onInputChange={handleInputChange}
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
						celestialConfiguration={celestialConfiguration}
						onColorChange={handleColorChange}
						onLayoutChange={handleLayoutChange}
						onShapeChange={handleShapeChange}
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

SMODesktop.propTypes = {
	defaultOptions: PropTypes.object.isRequired,
	defautCelestialConfig: PropTypes.object.isRequired,
	onOptionChange: PropTypes.func.isRequired,
	onCelestialConfigChange: PropTypes.func.isRequired,
	productDetails: PropTypes.object.isRequired,
	onLayoutChange: PropTypes.func.isRequired,
};

export default SMODesktop;