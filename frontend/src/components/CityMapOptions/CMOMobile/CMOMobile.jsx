import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import clsx from 'clsx';

// import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';

import useStyles from '../CityMapOptionStyle';
import { formatCoordinates } from '../../../utils/formatter';
import { PlacesAutocomplete, DesignSection, TextSection, IconSection } from '../sections';
import SizeSection from '../../SizeSection';
import TabPanel from '../../TabPanel';
import { onCMTabChange } from 'redux/actions';

const CMODesktop = ({ defaultOptions, defautMapConfig, onOptionChange, onMapConfigChange, productDetails, markerIcons, onSizeChange, cmTabValue, onCMTabChange }) => {
	const classes = useStyles();
	const [mapConfiguration, setMapConfiguration] = useState(defautMapConfig);
	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);

	// const isSM = useMediaQuery(theme => theme.breakpoints.down('sm'), { defaultMatches: true });
	// const isMobile = useMediaQuery('(min-width:425px)');

	useEffect(() => {
		// console.log("defautMapConfig : ", defautMapConfig);
		setMapConfiguration(defautMapConfig);

		setSelectedOptions(selectedOptions => ({
			...selectedOptions,
			text: selectedOptions.text.updateCoordinates ? {
				...selectedOptions.text,
				coordinates: formatCoordinates(defautMapConfig.location.lat, defautMapConfig.location.lng),
			} : selectedOptions.text
		}));
	}, [defautMapConfig]);

	useEffect(() => {
		onOptionChange(selectedOptions);
	}, [selectedOptions, onOptionChange]);
	
	const handleTabChange = (event, newValue) => {
		onCMTabChange(newValue);
	};


	const handleShapeChange = (shape) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, shape }));
	};

	const handleLayoutChange = (layout) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, layout }));
	};

	const handleSizeChange = (event) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, size: event.target.value }));
		onSizeChange();
	};

	const handlePlaceSelection = (place) => {
		const lat = place.geometry.location.lat(), lng = place.geometry.location.lng();
		const location = { lat, lng };
		let title = mapConfiguration.location.title, subtitle = mapConfiguration.location.subtitle;
		if (place.address_components.length) {
			place.address_components.forEach((component, index) => {
				if (index === 0) {					
					title = (component && component.long_name) ? component.long_name : (component.short_name ? component.short_name : mapConfiguration.location.title);
				}
				if (component.types.includes("country")) {
					subtitle = (component && component.long_name) ? component.long_name : (component.short_name ? component.short_name : mapConfiguration.location.subtitle);
				}
			});
		}

		onMapConfigChange({
			...mapConfiguration,
			location
		}, 'map');
		setMapConfiguration(mapConfiguration => ({ ...mapConfiguration, location }));

		setSelectedOptions(selectedOptions => ({
			...selectedOptions,
			text: {
				...selectedOptions.text,
				title: title,
				subtitle: subtitle,
				coordinates: formatCoordinates(lat, lng),
			}
		}));
	};

	const handleColorChange = (color) => {
		onMapConfigChange({ ...mapConfiguration, color }, 'map');
		setMapConfiguration(mapConfiguration => ({ ...mapConfiguration, color }));
	};

	const handlePurchaseTypeChange = (type) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, purchaseType: type }));
	};

	/**
	 * Handle input change
	 * 
	 * @param {*} event 
	 */
	const handleInputChange = (event) => {
		setSelectedOptions(selectedOptions => ({
			...selectedOptions,
			text: {
				...selectedOptions.text,
				[event.target.name]:
					event.target.type === 'checkbox'
						? event.target.checked
						: event.target.value,
			}
		}));
	};

	/**
	 * Handle marker icon change
	 * 
	 * @param {*} iconIndex 
	 * @param {*} type 
	 */
	const handleIconChange = (iconIndex, type) => {
		// console.log("mapConfiguration : ", mapConfiguration);
		if (type === 'remove') {
			let configIcons = mapConfiguration.icons;
			configIcons.splice(iconIndex, 1);
			onMapConfigChange({ ...mapConfiguration, icons: configIcons }, 'remove_marker_icon', iconIndex);
		} else {
			const newIndex = mapConfiguration.icons.length;
			onMapConfigChange({
				...mapConfiguration,
				icons: [
					...mapConfiguration.icons,
					{ ...markerIcons[iconIndex], size: 30, color: mapConfiguration.color.secondary_color }
				]
			}, 'add_marker_icon', newIndex);
		}
		// onMapConfigChange({ ...mapConfiguration, icon: { ...mapConfiguration.icon, key: iconKey  } }, 'marker_icon');
	};

	/**
	 * Handle marker size change
	 * 
	 * @param {*} newValue 
	 * @param {*} index 
	 */
	const handleSliderChange = (newValue, index) => {
		let markerIcons = mapConfiguration.icons;
		markerIcons[index].size = newValue;
		onMapConfigChange({ ...mapConfiguration, icons: markerIcons }, 'marker_size');
		// onMapConfigChange({ ...mapConfiguration, icon: { ...mapConfiguration.icon, size: newValue } }, 'marker_size');
  };

	/**
	 * Handle marker color change
	 * 
	 * @param {*} color 
	 * @param {*} index 
	 */
	const handleIconColorChange = (color, index) => {
		const newColor = color.css && color.css.backgroundColor ? color.css.backgroundColor : '#' + color.hex;
		let markerIcons = mapConfiguration.icons;
		markerIcons[index].color = newColor;
		onMapConfigChange({ ...mapConfiguration, icons: markerIcons }, 'marker_color');
		// onMapConfigChange({ ...mapConfiguration, icon: { ...mapConfiguration.icon, color: newColor } }, 'marker_color');
  };

	
	return (
		<Paper className={classes.root}>
			<Tabs
				value={cmTabValue}
				indicatorColor="primary"
				textColor="primary"
				onChange={handleTabChange}
				className={classes.tabsContainer}
				variant="fullWidth"
				// variant={isSM ? 'scrollable' : 'fullWidth'}
				scrollButtons="auto"
			>
				<Tab className={classes.tabBtns} value="placePanel" label="Place" />
				<Tab className={classes.tabBtns} value="designPanel" label="Design" />
				<Tab className={classes.tabBtns} value="textPanel" label="Text" />
				<Tab className={classes.tabBtns} value="iconPanel" label="Icon" />
				<Tab className={classes.tabBtns} value="sizePanel" label="size" />
			</Tabs>
			<Divider />
			<TabPanel value={cmTabValue} index="placePanel">
				<PlacesAutocomplete onPlaceSelection={handlePlaceSelection} />
			</TabPanel>

			<TabPanel value={cmTabValue} index="designPanel" padding={0}>
				<DesignSection
					productDetails={productDetails}
					selectedOptions={selectedOptions}
					mapConfiguration={mapConfiguration}
					onColorChange={handleColorChange}
					onShapeChange={handleShapeChange}
					onLayoutChange={handleLayoutChange}
				/>
			</TabPanel>

			<TabPanel value={cmTabValue} index="textPanel">
				<TextSection
					selectedOptions={selectedOptions}
					onInputChange={handleInputChange}
				/>
			</TabPanel>

			<TabPanel value={cmTabValue} index="iconPanel" padding={0}>
				<IconSection
					mapConfiguration={mapConfiguration}
					markerIcons={markerIcons}
					onSliderChange={handleSliderChange}
					onIconChange={handleIconChange}
					onIconColorChange={handleIconColorChange}
				/>
			</TabPanel>
			
			<TabPanel value={cmTabValue} index="sizePanel">
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
	onCMTabChange: tab => dispatch(onCMTabChange(tab)),
});

const mapStateToProps = state => ({ cmTabValue: state.cmTabValue });

CMODesktop.propTypes = {
	defaultOptions: PropTypes.object.isRequired,
	defautMapConfig: PropTypes.object.isRequired,
	onOptionChange: PropTypes.func.isRequired,
	onMapConfigChange: PropTypes.func.isRequired,
	productDetails: PropTypes.object.isRequired,
	markerIcons: PropTypes.array.isRequired,
	onSizeChange: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CMODesktop);