import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// import useStyles from '../CityMapOptionStyle';

const TextSection = ({ selectedOptions, onInputChange }) => {
	// const classes = useStyles();
	
	return (
		<Grid container spacing={1}>
			<TextField
				id="text-name"
				label="Title"
				name="title"
				value={selectedOptions.text.title || ''}
				onChange={onInputChange}
				variant="outlined"
				fullWidth
				margin="dense"
				inputProps={{ maxLength: (selectedOptions.layout.label === "layout_1" && selectedOptions.text.message) ?  35 : 50 }}
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
				inputProps={{ maxLength: (selectedOptions.layout.label === "layout_1" && selectedOptions.text.message) ?  100 : 130 }}
			/>
			<TextField
				id="text-coordinates"
				label="Coordinates"
				name="coordinates"
				value={selectedOptions.text.coordinates || ''}
				onChange={onInputChange}
				variant="outlined"
				fullWidth
				margin="dense"
				inputProps={{ maxLength: 50 }}
			/>
			{selectedOptions.layout.label === "layout_1" && 
				<TextField
					id="text-message"
					label="Message"
					name="message"
					placeholder="Custom Message (Optional)"
					value={selectedOptions.text.message || ''}
					onChange={onInputChange}
					variant="outlined"
					fullWidth
					margin="dense"
					inputProps={{ maxLength: 100 }}
				/>
			}
			<FormControlLabel
				control={
					<Checkbox
						checked={selectedOptions.text.updateCoordinates}
						onChange={onInputChange}
						name="updateCoordinates"
						color="primary"
					/>
				}
				label="Update coordinates when map position changes."
			/>
		</Grid>
	);
};

TextSection.propTypes = {
	selectedOptions: PropTypes.object.isRequired,
	onInputChange: PropTypes.func.isRequired,
};

export default TextSection;