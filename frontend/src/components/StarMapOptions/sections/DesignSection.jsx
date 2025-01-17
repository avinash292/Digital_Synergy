import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Joyride from 'react-joyride';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import useStyles from '../StarMapOptionStyle';
import TabPanel from '../../TabPanel';
import GridItem from '../../GridItem';
import { SERVER_PATH, STAR_LAYOUT_PATH, STAR_SHAPES_PATH } from '../../../config';
import { onSMDesignTabChange } from 'redux/actions';

const steps = [
	{
		target: '#color-panel',
		content: 'Swipe right to see more colors!',
		spotlightClicks: true,
	},
];

const imageShapePath = SERVER_PATH + STAR_SHAPES_PATH;
const imageLayoutPath = SERVER_PATH + STAR_LAYOUT_PATH;

const DesignComponent = ({ productDetails, selectedOptions, celestialConfiguration, onColorChange, onLayoutChange, onShapeChange, smDesignTabValue, onSMDesignTabChange }) => {
	const classes = useStyles();
	const introDone = (localStorage.getItem('color_intro_done') !== null && localStorage.getItem('color_intro_done') !== undefined) ? localStorage.getItem('color_intro_done') : false;
	const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));
	const [tourOpen, setTourOpen] = useState(false);

	useEffect(() => {
		setTourOpen(!isDesktop && !introDone)
		// setTourOpen(!isDesktop);
	}, [introDone, isDesktop]);

	/* useEffect(() => {
		console.log("tourOpen: ", tourOpen);
	}, [tourOpen]); */

	const handleTabChange = (event, newValue) => {
		onSMDesignTabChange(newValue);
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
				value={smDesignTabValue}
				onChange={handleTabChange}
				indicatorColor="primary"
				textColor="primary"
				variant="fullWidth"
				// variant={isDesktop ? 'scrollable' : 'fullWidth'}
				scrollButtons="auto"
			>
				<Tab className={classes.tabHandle} label="Color" />
				<Tab className={classes.tabHandle} label="Layout" />
				{selectedOptions.layout.label !== "layout_4" && <Tab className={classes.tabHandle} label="Shape" />}
			</Tabs>
			<Divider />
			<TabPanel value={smDesignTabValue} index={0} padding={0}>
					<Grid id="color-panel" className={classes.containerGrid} container spacing={2}>
						{productDetails.colors.map((color, index) => (
							<ColorOptions
								key={index}
								color={color}
								activeItem={celestialConfiguration.color}
								onItemChange={onColorChange}
							/>
						))}
					</Grid>
			</TabPanel>
			<TabPanel value={smDesignTabValue} index={1} padding={0}>
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
			<TabPanel value={smDesignTabValue} index={2}>		
				{selectedOptions.layout.label !== "layout_4" ? (
					<Grid container spacing={1}>
						{productDetails.shapes.map((shape, index) => (
							<GridItem
								key={index}
								item={shape}
								title={shape.name}
								activeItem={selectedOptions.shape}
								onItemChange={onShapeChange}
								imgSrc={imageShapePath + shape.image}
							/>
						))}
					</Grid>
				) : null}
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

const ColorOptions = ({ activeItem, onItemChange, color }) => {
	const classes = useStyles();
	return (
		<Grid
			className={classes.gridItem}
			item
			xs={4} sm={3} md={3} lg={2}
			onClick={() => onItemChange(color)}
		>
			{activeItem.id === color.id ? (
				<Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} overlap="circular">
					<div className={classes.colorView} style={{ backgroundColor: color.primary_color }}>
						{color.secondary_color ? (
							<div>
								<div className={color.label === 'white_multicolor_white' ? clsx(classes.secondaryColorView, 'multicolor_splash') : classes.secondaryColorView} style={{ backgroundColor: color.secondary_color }} />
								{color.tertiary_color && <div className={classes.tertiaryColorView} style={{ backgroundColor: color.tertiary_color }} />}
							</div>
						) : null}
					</div>
				</Badge>
			) : (
				<div className={classes.colorView} style={{ backgroundColor: color.primary_color }}>
					{color.secondary_color ? (
						<div>
							<div className={color.label === 'white_multicolor_white' ? clsx(classes.secondaryColorView, 'multicolor_splash') : classes.secondaryColorView} style={{ backgroundColor: color.secondary_color }} />
							{color.tertiary_color && <div className={classes.tertiaryColorView} style={{ backgroundColor: color.tertiary_color }} />}
						</div>
					) : null}
				</div>
			)}
		</Grid>
	);
};


DesignComponent.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	celestialConfiguration: PropTypes.object.isRequired,
	onColorChange: PropTypes.func.isRequired,
	onLayoutChange: PropTypes.func.isRequired,
	onShapeChange: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
	return {
		onSMDesignTabChange: tab => dispatch(onSMDesignTabChange(tab)),
	}
};

const mapStateToProps = state => {
	return { smDesignTabValue: state.smDesignTabValue }
};

export default connect(mapStateToProps, mapDispatchToProps)(DesignComponent);