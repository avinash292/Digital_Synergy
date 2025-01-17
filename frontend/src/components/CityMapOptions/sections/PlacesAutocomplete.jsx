import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-google-autocomplete';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import useStyles from '../CityMapOptionStyle';

const PlacesAutocomplete = ({ onPlaceSelection }) => {
	const classes = useStyles();
	
	return (
		<Box>
			<Typography variant="subtitle2" className={classes.locationTitle}>Location</Typography>
			<Autocomplete
				onPlaceSelected={onPlaceSelection}
				className={classes.autocompleteStyle}
				types={['(regions)']}
				placeholder="Enter city or place"
			/>
		</Box>
	);
};

PlacesAutocomplete.propTypes = {
	onPlaceSelection: PropTypes.func.isRequired,
};

export default PlacesAutocomplete;