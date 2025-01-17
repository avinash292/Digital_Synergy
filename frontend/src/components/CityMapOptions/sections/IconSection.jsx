import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker } from 'material-ui-color';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import useStyles from '../CityMapOptionStyle';

const IconSection = ({ mapConfiguration, markerIcons, onSliderChange, onIconChange, onIconColorChange }) => {
	const classes = useStyles();

	/* React.useEffect(() => {
		console.log("mapConfiguration.icons : ", mapConfiguration.icons);
	}, [mapConfiguration.icons]); */

	return (
		<div className={classes.iconPanelAccordion}>
			{mapConfiguration.icons.map((marker, index) => (
				<MarkerComponent
					key={index}
					index={index}
					marker={marker}
					onSliderChange={onSliderChange}
					onIconColorChange={onIconColorChange}
					onIconRemove={onIconChange}
				/>
			))}
			{/* {mapConfiguration.icons.key && <div className={classes.sliderContainer}>
				<Slider value={iconSize} onChange={onSliderChange} aria-labelledby="size-slider" min={20} max={60}/>
				<Tooltip title="Remove Icon">
					<IconButton className={classes.removeBtn} onClick={() => onIconChange(null)}>
						<HighlightOffIcon fontSize="large" />
					</IconButton>
				</Tooltip>
				<Tooltip title="Change Icon Color">
					<div>
						<ColorPicker defaultValue="transparent" value={mapConfiguration.icons.color} disableAlpha hideTextfield onChange={onIconColorChange}/>
					</div>
				</Tooltip>
			</div> } */}
			<Grid className={classes.containerGrid} container>
				{markerIcons.map((marker, index) => (
					<MarkerIcon
						key={index}
						index={index}
						Icon={marker.Icon}
						color={marker.color || 'inherit'} 
						name={marker.key}
						onIconClick={onIconChange}
						activeItems={mapConfiguration.icons}
					/>
				))}	
			</Grid>
		</div>
	);
};


const MarkerIcon = ({ Icon, name, index, onIconClick, activeItems, ...rest }) => {
	const classes = useStyles();

	/**
	 * Check if icon is already used
	 * 
	 * @param {*} name 
	 * @returns 
	 */
	const checkIfExists = (name) => {
		const exists = activeItems.filter(item => item.key === name);
		return exists.length ? true : false;
	};

	return (
		<Grid		
			// className={activeItem.key === name ? clsx(classes.gridItem, classes.activeItem) : classes.gridItem}
			className={classes.gridItem}
			item
			xs={3} sm={2} md={3} lg={2}
		>
			<IconButton  onClick={() => onIconClick(index, 'add')} disabled={checkIfExists(name)}>
				{activeItems.key === name ? (
					<Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} overlap="rectangular">
						<Icon {...rest} fontSize="large" />
					</Badge>
				) : (
					<Icon {...rest} fontSize="large" />
				)}
				
			</IconButton>
		</Grid>
	);
};

const MarkerComponent = ({ index, marker, onSliderChange, onIconColorChange, onIconRemove }) => {
	const classes = useStyles();
	const Icon = marker.Icon;
	return (		
		<div key={index} className={classes.markerContainer}>
			<Paper className={classes.selectedMarkerContainer}>
				<Icon />

				<Slider className={classes.iconRangeWidth} value={marker.size} onChange={(event, newValue) => onSliderChange(newValue, index)} aria-labelledby="size-slider" min={20} max={60}/>
				<Tooltip title="Change Icon Color">
					<div>
						<ColorPicker defaultValue="transparent" value={marker.color} disableAlpha hideTextfield onChange={(color) => onIconColorChange(color, index)}/>
					</div>
				</Tooltip>
			</Paper>

			<Tooltip title="Remove Icon" className={classes.removeContainer}>
				<IconButton onClick={() => onIconRemove(index, 'remove')} size="small">
					<HighlightOffIcon className={classes.removeBtn}  />
				</IconButton>
			</Tooltip>
		</div>
	);
};

IconSection.propTypes = {
	mapConfiguration: PropTypes.object.isRequired,
	markerIcons: PropTypes.array.isRequired,
	onSliderChange: PropTypes.func.isRequired,
	onIconChange: PropTypes.func.isRequired,
	onIconColorChange: PropTypes.func.isRequired,
};

export default IconSection;