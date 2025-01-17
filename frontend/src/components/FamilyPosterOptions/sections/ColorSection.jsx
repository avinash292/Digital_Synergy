import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// import Box from '@material-ui/core/Box';
// import Divider from '@material-ui/core/Divider';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
// import useMediaQuery from '@material-ui/core/useMediaQuery';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import useStyles from '../FamilyPosterOptionStyle';
// import GridItem from '../../GridItem';

// import { SERVER_PATH, FP_MEMBER_HAIR_COLOR_PATH } from '../../../config';

const ColorComponent = ({ productDetails, selectedOptions, onColorChange, onLayoutChange }) => {
	const classes = useStyles();
	// const [tabValue, setTabValue] = useState(0);

	// const imageLayoutPath = SERVER_PATH + FP_MEMBER_HAIR_COLOR_PATH;
	// const isXs = useMediaQuery(theme => theme.breakpoints.down('sm'), { defaultMatches: true });

	/* const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	}; */

	return (
		<div className={classes.colorsConatiner}>
			<Grid container spacing={2}>
				{productDetails.hairColors.map((color, index) => (
					<ColorOptions
						key={index}
						color={color}
						activeItem={selectedOptions.hairColor}
						onItemChange={onColorChange}
					/>
				))}
			</Grid>
		</div>
			
	);
};

const ColorOptions = ({ color,  activeItem, onItemChange }) => {
	const classes = useStyles();
	return (
		<Grid
			className={activeItem.label === color.label ? clsx(classes.colorGridItem, classes.activeItem) : classes.colorGridItem}
			item
			xs={4} sm={3} md={3} lg={2}
			onClick={() => onItemChange(color)}
		>
			{activeItem.label === color.label ? (
				<Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} overlap="circular">
					<div className={classes.colorView} style={{ backgroundColor: color.primary_color }}>
						{color.secondary_color && 
							<div className={classes.secondaryColorView} style={{ backgroundColor: color.secondary_color }} />}
					</div>
				</Badge>
			) : (
				<div className={classes.colorView} style={{ backgroundColor: color.primary_color }}>
					{color.secondary_color && 
						<div className={classes.secondaryColorView} style={{ backgroundColor: color.secondary_color }} />}
				</div>
			)}
		</Grid>

	);
};


ColorComponent.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	onColorChange: PropTypes.func.isRequired,
	onLayoutChange: PropTypes.func.isRequired,
};
export default ColorComponent;