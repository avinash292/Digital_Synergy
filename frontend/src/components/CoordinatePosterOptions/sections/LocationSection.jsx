import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import Autocomplete from 'react-google-autocomplete';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import useStyles from '../CoordinatePosterOptionStyle';

const LocationSection = ({ selectedOptions, onPlaceSelection }) => {
	const classes = useStyles();

	return (
		<Box>
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
		</Box>
	);
};

LocationSection.propTypes = {
	selectedOptions: PropTypes.object.isRequired,
	onPlaceSelection: PropTypes.func.isRequired,
};
export default LocationSection;