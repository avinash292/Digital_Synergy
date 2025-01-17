import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import useStyles from '../StarMapOptionStyle';
import { DesignSection, DatePlaceSection, CustomizeSection } from '../sections';
import SizeSection from '../../SizeSection';
import TabPanel from '../../TabPanel';
import { onSMTabChange } from 'redux/actions';


const SMOMobile = ({ defaultOptions, defautCelestialConfig, onOptionChange, onCelestialConfigChange, productDetails, onLayoutChange, smTabValue, onSMTabChange }) => {
	const classes = useStyles();
	const [celestialConfiguration, setCelestialConfiguration] = useState(defautCelestialConfig);
	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
	
	const isXs = useMediaQuery(theme => theme.breakpoints.down('xs'), { defaultMatches: true });


	useEffect(() => {
		onOptionChange(selectedOptions);
	}, [selectedOptions, onOptionChange]);
	
	useEffect(() => {
		onCelestialConfigChange(celestialConfiguration);
	}, [celestialConfiguration, onCelestialConfigChange]);

	/* useEffect(() => {
		console.log("selectedOptions.layout.label : ", selectedOptions.layout.label);
	}, [selectedOptions]); */

	const handleTabChange = (event, newValue) => {
		onSMTabChange(newValue);
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
		<Paper className={classes.root}>
			<Tabs
				value={smTabValue}
				indicatorColor="primary"
				textColor="primary"
				onChange={handleTabChange}
				className={classes.tabsContainer}
				variant="fullWidth"
				// variant={isXs ? 'scrollable' : 'fullWidth'}
				scrollButtons="auto"
			>
				<Tab value="placePanel" label={isXs ? "Moment" : "Place & Date"} />
				<Tab value="customizePanel" label="Customize" />
				<Tab value="designPanel" label={isXs ? "Design" : "Choose Design"} />
				<Tab value="sizePanel" label={isXs ? "Size" : "Choose size"} />
			</Tabs>
			<Divider />

			<TabPanel value={smTabValue} index="placePanel">
				<DatePlaceSection
					productDetails={productDetails}
					selectedOptions={selectedOptions}
					celestialConfiguration={celestialConfiguration}
					onPlaceSelection={handlePlaceSelection}
					onDateChange={handleDateChange}
					onInputChange={handleInputChange}
				/>
			</TabPanel>

			<TabPanel value={smTabValue} index="customizePanel" padding={0}>
				<CustomizeSection
					productDetails={productDetails}
					selectedOptions={selectedOptions}
					celestialConfiguration={celestialConfiguration}
					onElementToggle={handleElementToggle}
					onInputChange={handleInputChange}
				/>
			</TabPanel>

			<TabPanel value={smTabValue} index="designPanel" padding={0}>
				<DesignSection
					productDetails={productDetails}
					selectedOptions={selectedOptions}
					celestialConfiguration={celestialConfiguration}
					onColorChange={handleColorChange}
					onLayoutChange={handleLayoutChange}
					onShapeChange={handleShapeChange}
				/>
			</TabPanel>

			<TabPanel value={smTabValue} index="sizePanel">
				<SizeSection
					selectedOptions={selectedOptions}
					productDetails={productDetails}
					onSizeChange={handleSizeChange}
					onPurchaseTypeChange={handlePurchaseTypeChange}
				/>
			</TabPanel>
		</Paper>
	);
};

SMOMobile.propTypes = {
	defaultOptions: PropTypes.object.isRequired,
	defautCelestialConfig: PropTypes.object.isRequired,
	onOptionChange: PropTypes.func.isRequired,
	onCelestialConfigChange: PropTypes.func.isRequired,
	productDetails: PropTypes.object.isRequired,
	onLayoutChange: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
	onSMTabChange: tab => dispatch(onSMTabChange(tab)),
});

const mapStateToProps = state => ({ smTabValue: state.smTabValue });

export default connect(mapStateToProps, mapDispatchToProps)(SMOMobile);	