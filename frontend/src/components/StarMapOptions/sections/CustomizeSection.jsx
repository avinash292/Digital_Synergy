import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import useStyles from '../StarMapOptionStyle';
import TabPanel from '../../TabPanel';
import { onSMCustomizeTabChange } from 'redux/actions';
import GlobeImage from '../elements/globe.png';
import DotsImage from '../elements/consellations.png';
import MikywayImage from '../elements/milky_way.png';

const CustomizeSection = ({ selectedOptions, celestialConfiguration, onElementToggle, onInputChange, smCustomizeTabValue, onSMCustomizeTabChange }) => {
	const classes = useStyles();

	/* React.useEffect(() => {
		console.log("selectedOptions : ", selectedOptions);
	}, [selectedOptions]) */

	const handlePlaceTabChange = (event, newValue) => {
		onSMCustomizeTabChange(newValue);
	};
	
	return (
		<Box>
			<Tabs
				value={smCustomizeTabValue}
				onChange={handlePlaceTabChange}
				indicatorColor="primary"
				textColor="primary"
				variant="fullWidth"
				// variant="scrollable"
				scrollButtons="auto"
			>
				<Tab label="Options" />
				<Tab label="Text" />
			</Tabs>
			<Divider />
      <TabPanel value={smCustomizeTabValue} index={0}>
				<div className={classes.optionsTab}>
					<ElementOption
						name="grid"
						label="Grid"
						activeItem={celestialConfiguration.elements.grid}
						onItemChange={onElementToggle}
						ImageComponent={GlobeImage}
					/>
					<ElementOption
						name="constellations"
						label="Constellations"
						activeItem={celestialConfiguration.elements.constellations}
						onItemChange={onElementToggle}
						ImageComponent={DotsImage}
					/>
					<ElementOption
						name="milkyWay"
						label="Milky Way"
						activeItem={celestialConfiguration.elements.milkyWay}
						onItemChange={onElementToggle}
						ImageComponent={MikywayImage}
					/>
				</div>
			</TabPanel>
			<TabPanel value={smCustomizeTabValue} index={1}>
				<div>
					{selectedOptions.layout.label === "layout_1" ? (
						<>
							<TextField
								id="text-name"
								label="Title"
								name="title"
								value={selectedOptions.text.title || ''}
								onChange={onInputChange}
								variant="outlined"
								fullWidth
								margin="dense"
								inputProps={{ maxLength: 50 }}
							/>
							<TextField
								id="text-subTitle"
								label="Add a message"
								name="subTitle"
								value={selectedOptions.text.subTitle || ''}
								onChange={onInputChange}
								variant="outlined"
								fullWidth
								margin="dense"
								// multiline
								// rows={5}
								inputProps={{ maxLength: 100 }}
							/>
						</>
					) : null }
					<TextField
						id="text-placeText"
						label="Place text"
						name="placeText"
						value={selectedOptions.text.placeText || ''}
						onChange={onInputChange}
						variant="outlined"
						fullWidth
						margin="dense"
						inputProps={{ maxLength: 40 }}
					/>
					{selectedOptions.layout.label === "layout_2" && 
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
				</div>
			</TabPanel>
		</Box>
	);
};

const ElementOption = ({ name, label,  activeItem, onItemChange, ImageComponent }) => {
	const classes = useStyles();
	return (
		<Tooltip
			title={activeItem ? 'Hide ' + label : 'Show ' + label}
			className={activeItem === name ? clsx(classes.elementContainer, classes.activeItem) : classes.elementContainer}
			onClick={() => onItemChange(name)}
		>
			{activeItem ? (
				<Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} className={classes.elementImage} overlap="rectangular">
					<img src={ImageComponent} alt={label} className={classes.elementImg} />
				</Badge>
			) : (
				<div className={classes.elementImage}>
					<img src={ImageComponent} alt={label} className={classes.elementImg} />
				</div>				
			)}
		</Tooltip>
	);
};


const mapDispatchToProps = dispatch => ({
	onSMCustomizeTabChange: tab => dispatch(onSMCustomizeTabChange(tab)),
});

const mapStateToProps = state => ({ smCustomizeTabValue: state.smCustomizeTabValue });

CustomizeSection.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	celestialConfiguration: PropTypes.object.isRequired,
	onElementToggle: PropTypes.func.isRequired,
	onInputChange: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomizeSection);