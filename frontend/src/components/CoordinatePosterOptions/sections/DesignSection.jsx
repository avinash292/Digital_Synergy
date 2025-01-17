import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import useStyles from '../CoordinatePosterOptionStyle';
import TabPanel from '../../TabPanel';
import GridItem from '../../GridItem';
import { SERVER_PATH, COORDINATE_POSTER_PATH } from '../../../config';
import { onCPDesignTabChange } from 'redux/actions';

const DesignComponent = ({ productDetails, selectedOptions, onColorChange, onLayoutChange, onInputChange, cpDesignTabValue, onCPDesignTabChange }) => {
	const classes = useStyles();

	const imageLayoutPath = SERVER_PATH + COORDINATE_POSTER_PATH;
	// const isXs = useMediaQuery(theme => theme.breakpoints.down('sm'), { defaultMatches: true });

	const handleTabChange = (event, newValue) => {
		onCPDesignTabChange(newValue);
	};

	return (
		<Box>
			<Tabs
				value={cpDesignTabValue}
				onChange={handleTabChange}
				indicatorColor="primary"
				textColor="primary"
				variant="fullWidth"
				scrollButtons="auto"
			>
				<Tab className={classes.tabHandle} label="Layout" />
				<Tab className={classes.tabHandle} label="Color" />
				<Tab className={classes.tabHandle} label="Text" />
			</Tabs>
			<Divider />
			<TabPanel value={cpDesignTabValue} index={0}>
				<Grid container spacing={1} className={classes.containerGrid}>
					{productDetails.layouts.map((layout, index) => (
						<GridItem
							key={index}
							item={layout}
							title={layout.name}
							activeItem={selectedOptions.layout}
							onItemChange={onLayoutChange}
							imgSrc={imageLayoutPath + layout.image}
						/>
					))}
				</Grid>
			</TabPanel>
			<TabPanel value={cpDesignTabValue} index={1}>
				<div className={classes.colorsConatiner}>
					<Grid container spacing={2} className={classes.containerGrid}>
						{productDetails.colors.map((color, index) => (
							<ColorOptions
								key={index}
								color={color}
								activeItem={selectedOptions.color}
								onItemChange={onColorChange}
							/>
						))}
					</Grid>
				</div>
			</TabPanel>
			<TabPanel value={cpDesignTabValue} index={2}>
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
					{selectedOptions.layout.label === 'layout_1' && 
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
					}
				</div>
			</TabPanel>
		</Box>
	);
};

const ColorOptions = ({ color,  activeItem, onItemChange }) => {
	const classes = useStyles();
	return (
		<Grid
			className={activeItem.id === color.id ? clsx(classes.gridItem, classes.activeItem) : classes.gridItem}
			item
			xs={4} sm={3} md={3} lg={2}
			onClick={() => onItemChange(color)}
		>
			{activeItem.id === color.id ? (
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

const mapDispatchToProps = dispatch => ({
	onCPDesignTabChange: tab => dispatch(onCPDesignTabChange(tab)),
});

const mapStateToProps = state => ({
	cpDesignTabValue: state.cpDesignTabValue,
});

DesignComponent.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	onColorChange: PropTypes.func.isRequired,
	onLayoutChange: PropTypes.func.isRequired,
	onInputChange: PropTypes.func.isRequired,
	cpDesignTabValue: PropTypes.number.isRequired,
	onCPDesignTabChange: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(DesignComponent);