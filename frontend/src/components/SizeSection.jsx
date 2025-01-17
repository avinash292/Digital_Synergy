import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({	
	activeBtn: {
		backgroundColor: theme.palette.colors.grey[300] + ' !important',
	},
	btnGrp: {
		marginTop: theme.spacing(2),
	},
}));


const SizeSection = ({ selectedOptions, productDetails, onSizeChange, onPurchaseTypeChange }) => {
	const classes = useStyles();
	return (
		<div>
			<FormControl fullWidth variant="outlined" margin="dense">
				<InputLabel id="select-label">Size</InputLabel>
				<Select
					labelId="select-label"
					id="select-outlined"
					name="status"
					fullWidth
					value={selectedOptions.size}
					onChange={onSizeChange}
					labelWidth={40}
				>
					{productDetails.sizes.map((size, index) => (
						<MenuItem value={index} key={index}>
							<PhotoAlbumIcon /> {size.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<ButtonGroup size="large" fullWidth className={classes.btnGrp}>
				<Button
					className={selectedOptions.purchaseType === 'print' ? classes.activeBtn : null }
					onClick={() => onPurchaseTypeChange('print')}
				>
					Print
				</Button>
				<Button
					className={selectedOptions.purchaseType === 'pdf' ? classes.activeBtn : null }
					onClick={() => onPurchaseTypeChange('pdf')}
				>
					PDF only
				</Button>
			</ButtonGroup>
		</div>
	);
};


SizeSection.propTypes = {
	selectedOptions: PropTypes.object.isRequired,
	productDetails: PropTypes.object.isRequired,
	onSizeChange: PropTypes.func.isRequired,
	onPurchaseTypeChange: PropTypes.func.isRequired,
};

export default SizeSection;