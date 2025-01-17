import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import Joyride from 'react-joyride';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import useStyles from '../CityMapOptionStyle';
import TabPanel from '../../TabPanel';
import GridItem from '../../GridItem';
import { SERVER_PATH, CITY_SHAPES_PATH, CITY_COLOR_PATH, CITY_LAYOUT_PATH } from '../../../config';
import { onCMDesignTabChange } from 'redux/actions';

const steps = [
	{
		target: '#cm-color-panel',
		content: 'Swipe right to see more colors!',
		spotlightClicks: true,
	},
];

const DesignComponent = ({ productDetails, selectedOptions, mapConfiguration, onColorChange, onLayoutChange, onShapeChange, cmDesignTabValue, onCMDesignTabChange }) => {
	const classes = useStyles();

	const imageShapePath = SERVER_PATH + CITY_SHAPES_PATH;
	const imageColorPath = SERVER_PATH + CITY_COLOR_PATH;
	const imageLayoutPath = SERVER_PATH + CITY_LAYOUT_PATH;	
	const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));
	const introDone = (localStorage.getItem('color_intro_done') !== null && localStorage.getItem('color_intro_done') !== undefined) ? localStorage.getItem('color_intro_done') : false;

	const [tourOpen, setTourOpen] = useState(false);

	useEffect(() => {
		setTourOpen(!isDesktop && !introDone);
	}, [introDone, isDesktop]);

	const handleTabChange = (event, newValue) => {
		onCMDesignTabChange(newValue);
	};

	const handleJoyrideCallback = (callbackData) => {
		// console.log("callbackData : ",callbackData);
		if (callbackData.action === 'close') {
			localStorage.setItem('color_intro_done', true);
		}
	};
	
	return (
		<Box>
			<Tabs
				value={cmDesignTabValue}
				onChange={handleTabChange}
				indicatorColor="primary"
				textColor="primary"
				variant="fullWidth"
				// variant={isDesktop ? 'scrollable' : 'fullWidth'}
				scrollButtons="auto"
			>
				<Tab className={classes.tabHandle} label="Color" />
				<Tab className={classes.tabHandle} label="Layout" />
				<Tab className={classes.tabHandle} label="Shape" />
			</Tabs>
			<Divider />
			<TabPanel id="cm-color-panel" value={cmDesignTabValue} index={0} className={classes.colorsContainer} padding={0}>
				<Grid className={classes.containerGrid} container spacing={2}>
					{productDetails.colors.map((color, index) => (									
						<ColorOptions
							key={index}
							color={color}
							title={color.name}
							imgSrc={imageColorPath + color.image}
							activeItem={mapConfiguration.color}
							onItemChange={onColorChange}
							isDesktop={isDesktop}
						/>
					))}
				</Grid>
			</TabPanel>
			<TabPanel value={cmDesignTabValue} index={1} padding={0}>
				<Grid className={classes.containerGrid} container spacing={1}>
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
			<TabPanel value={cmDesignTabValue} index={2} padding={0}>
				<Grid className={classes.containerGrid} container spacing={1}>
					{productDetails.shapes.map((shape, index) => (
						<GridItem
							key={index}
							item={shape}
							title={shape.name}
							imageStyle={shape.label !== "cmNoShape" ? classes.shapeSize : null}
							activeItem={selectedOptions.shape}
							onItemChange={onShapeChange}
							imgSrc={imageShapePath + shape.image}
						/>
					))}
				</Grid>
			</TabPanel>

			<Joyride
				callback={handleJoyrideCallback}
				continuous={true}
				run={tourOpen}
				scrollToFirstStep={true}
				showSkipButton={true}
				steps={steps}
				placementBeacon="center"
				styles={{
					options: {
						arrowColor: '#ff0044',
						backgroundColor: '#ff0044',
						overlayColor: 'rgba(255, 0, 68, 0.2)',
						primaryColor: '#000',
						textColor: '#fff',
					},
					buttonNext: {
						display: 'none',
					}
				}}
			/>
		</Box>
	);
};

const ColorOptions = ({ imgSrc, title, activeItem, onItemChange, color, isDesktop }) => {
	const classes = useStyles();
	return (
		<Grid
			className={clsx(classes.gridItem, classes.colorgid)}
			item
			xs={3} sm={3} md={3} lg={3}
			onClick={() => onItemChange(color)}
		>
			{activeItem.id === color.id ? (
				<Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} overlap="circular">
					<img className={classes.colorImg} src={imgSrc} alt={title} />
				</Badge>
			) : (
				<img className={classes.colorImg} src={imgSrc} alt={title} />
			)}
			{isDesktop && <Typography className={classes.colorName}>{title}</Typography>}
		</Grid>
	);
};

const mapDispatchToProps = dispatch => ({
	onCMDesignTabChange: tab => dispatch(onCMDesignTabChange(tab)),
});

const mapStateToProps = state => ({
	cmDesignTabValue: state.cmDesignTabValue,
});

DesignComponent.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	mapConfiguration: PropTypes.object.isRequired,
	onColorChange: PropTypes.func.isRequired,
	onShapeChange: PropTypes.func.isRequired,
	onLayoutChange: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DesignComponent);