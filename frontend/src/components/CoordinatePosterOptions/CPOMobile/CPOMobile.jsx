import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import useStyles from '../CoordinatePosterOptionStyle';
import SizeSection from '../../SizeSection';
import { DesignSection, LocationSection } from '../sections';
import TabPanel from '../../TabPanel';
import { onCPTabChange } from 'redux/actions';

const CPOMobile = ({ defaultOptions, onOptionChange, productDetails, cpTabValue, onCPTabChange }) => {
	const classes = useStyles();
	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);

	const isXs = useMediaQuery(theme => theme.breakpoints.down('xs'), { defaultMatches: true });

	useEffect(() => {
		onOptionChange(selectedOptions);
	}, [selectedOptions, onOptionChange]);
	
	const handleTabChange = (event, newValue) => {
		onCPTabChange(newValue);
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
		<Paper className={classes.root}>
			<Tabs
				value={cpTabValue}
				indicatorColor="primary"
				textColor="primary"
				onChange={handleTabChange}
				className={classes.tabsContainer}
				variant="fullWidth"
				// variant={isXs ? 'scrollable' : 'fullWidth'}
				scrollButtons="auto"
			>
				<Tab value="placePanel" label={isXs ? "Location" : "Choose Location"} />
				<Tab value="designPanel" label={isXs ? "Design" : "Choose Design"} />
				<Tab value="sizePanel" label={isXs ? "Size" : "Choose size"} />
			</Tabs>
			<Divider />


			<TabPanel value={cpTabValue} index="placePanel">
				<LocationSection
					selectedOptions={selectedOptions}
					onPlaceSelection={handlePlaceSelection}
				/>
			</TabPanel>

			<TabPanel value={cpTabValue} index="designPanel" padding={0}>
				<DesignSection
					productDetails={productDetails}
					selectedOptions={selectedOptions}
					onColorChange={handleColorChange}
					onLayoutChange={handleLayoutChange}
					onInputChange={handleInputChange}
				/>
			</TabPanel>

			<TabPanel value={cpTabValue} index="sizePanel">
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

const mapDispatchToProps = dispatch => ({
	onCPTabChange: tab => dispatch(onCPTabChange(tab)),
});

const mapStateToProps = state => ({
	cpTabValue: state.cpTabValue,
});


CPOMobile.propTypes = {
	defaultOptions: PropTypes.object.isRequired,
	onOptionChange: PropTypes.func.isRequired,
	productDetails: PropTypes.object.isRequired,
	cpTabValue: PropTypes.string.isRequired,
	onCPTabChange: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CPOMobile);