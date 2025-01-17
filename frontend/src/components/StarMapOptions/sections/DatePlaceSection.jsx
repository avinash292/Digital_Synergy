import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import Autocomplete from 'react-google-autocomplete';
import DateMomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import moment from 'moment';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import useStyles from '../StarMapOptionStyle';

const DatePlaceSection = ({ selectedOptions, celestialConfiguration, onPlaceSelection, onDateChange }) => {
	const classes = useStyles();

	/* React.useEffect(() => {
		console.log("selectedOptions : ", selectedOptions);
	}, [selectedOptions]) */

	
	return (
		<Box>
			<div className={classes.locationwrap}>
				<Typography variant="subtitle2" className={classes.locationtitle}>Location</Typography>
				<Autocomplete
					onPlaceSelected={onPlaceSelection}
					className={classes.autocompleteStyle}
					types={['(regions)']}
					// types={['(cities)']}
					// componentRestrictions={{country: "ru"}}
				/>
				<Typography variant="subtitle2">{celestialConfiguration.location.place}</Typography>
			</div>
			<MuiPickersUtilsProvider utils={DateMomentUtils}>
				<DatePicker
					variant="dialog"
					format="MM/DD/YYYY"
					margin="dense"
					id="date-picker"
					label="Date"
					inputVariant="outlined"
					maxDate={moment().add(1, 'year')}
					minDate={moment().subtract(100, 'year')}
					value={celestialConfiguration.date || moment()}
					onChange={onDateChange}
					fullWidth
					autoOk
					// KeyboardButtonProps={{
					// 	'aria-label': 'change date',
					// }}
				/>
			</MuiPickersUtilsProvider>
		</Box>
	);
};


DatePlaceSection.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	celestialConfiguration: PropTypes.object.isRequired,
	onPlaceSelection: PropTypes.func.isRequired,
	onDateChange: PropTypes.func.isRequired,
};
export default DatePlaceSection;