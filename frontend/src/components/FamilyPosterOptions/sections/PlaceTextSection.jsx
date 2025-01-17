import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import Autocomplete from 'react-google-autocomplete';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import useStyles from '../FamilyPosterOptionStyle';
import TabPanel from '../../TabPanel';

const PlaceTextSection = ({ selectedOptions, onPlaceSelection, onInputChange }) => {
	const classes = useStyles();
	const [placeTabValue, setPlaceTabValue] = useState(0);


	const handlePlaceTabChange = (event, newValue) => {
		setPlaceTabValue(newValue);
	};
	
	return (
		<Box>
			<Tabs
				value={placeTabValue}
				onChange={handlePlaceTabChange}
				indicatorColor="primary"
				textColor="primary"
				variant="fullWidth"
				// variant="scrollable"
				scrollButtons="auto"
			>
				<Tab label="Location" />
				<Tab label="Text" />
			</Tabs>
			<Divider />
			<TabPanel value={placeTabValue} index={0}>
				<div className={classes.locationwrap}>
					<Typography variant="subtitle2" className={classes.locationtitle}>Location</Typography>
					<Autocomplete
						onPlaceSelected={onPlaceSelection}
						className={classes.autocompleteStyle}
						types={['(regions)']}
						// types={['(cities)']}
					/>
					<Typography variant="subtitle2">{selectedOptions.location.place}</Typography>
				</div>
			</TabPanel>
			<TabPanel value={placeTabValue} index={1}>
				<div>
					<TextField
						id="text-name"
						label="Title"
						name="title"
						value={selectedOptions.text.title || ''}
						onChange={onInputChange}
						variant="outlined"
						fullWidth
						margin="dense"
						inputProps={{ maxLength: 80 }}
					/>
					<TextField
						id="text-subtitle"
						label="Subtitle"
						name="subtitle"
						value={selectedOptions.text.subtitle || ''}
						onChange={onInputChange}
						variant="outlined"
						fullWidth
						margin="dense"
						inputProps={{ maxLength: 200 }}
					/>
				</div>
			</TabPanel>
		</Box>
	);
};

PlaceTextSection.propTypes = {
	selectedOptions: PropTypes.object.isRequired,
	onPlaceSelection: PropTypes.func.isRequired,
	onInputChange: PropTypes.func.isRequired,
};
export default PlaceTextSection;