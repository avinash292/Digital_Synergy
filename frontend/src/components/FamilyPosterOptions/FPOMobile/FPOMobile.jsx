import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import useStyles from '../FamilyPosterOptionStyle';
import SizeSection from '../../SizeSection';
import { CharacterSection, DesignSection } from '../sections';
import TabPanel from '../../TabPanel';
import { onFPCharacterTabChange, onFPTabChange } from 'redux/actions';

const defaultSelectedCharacter = {
	characterIndex: 0,
	size: 'm',
	hairStyle: 'bald',
	hairColor: '#000000',
	beard: '',
	accessory: '',
	name: '',
	type: 0,
	position: 0,
	skinColor: '#e5a477',
};
const FPOMobile = ({ defaultOptions, onOptionChange, productDetails, handleSnackToogle, onFPCharacterTabChange, fpCharacterTabValue, onFPTabChange, fpTabValue }) => {
	const classes = useStyles();
	// const [tabValue, setTabValue] = useState('memberPanel');
	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);

	const isXs = useMediaQuery(theme => theme.breakpoints.down('xs'), { defaultMatches: true });

	useEffect(() => {
		onOptionChange(selectedOptions);
	}, [selectedOptions, onOptionChange]);
	
	const handleTabChange = (event, newValue) => {
		onFPTabChange(newValue);
	};

	const handleLayoutChange = (layout) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, layout }));
	};

	const handleSizeChange = (event) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, size: event.target.value }));
	};
	const handlePurchaseTypeChange = (type) => {
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, purchaseType: type }));
	};

	const handleAddMember = (charactersCount) => {
		if (selectedOptions.characters.length < 10) {
			onFPCharacterTabChange([ ...fpCharacterTabValue, 'characterPanel' ]);
			setSelectedOptions(selectedOptions => ({ ...selectedOptions, characters: [ ...selectedOptions.characters, defaultSelectedCharacter ] }));
		} else {
			handleSnackToogle('You cannot add more than 10 family members');
		}
	};

	const handleRemoveMember = (index) => {
		let characters = selectedOptions.characters;
		characters.splice(index, 1);
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, characters }));
		let fpCharTabValue = [ ...fpCharacterTabValue ];
		fpCharTabValue.splice(index, 1);
		onFPCharacterTabChange(fpCharTabValue);
	};

	/**
	 * Handle change of member options
	 * 
	 * @param {*} value 
	 * @param {*} key 
	 * @param {*} index 
	 */
	 const handleMemberOptionChange = (value, key, index) => {
		let selectedChars = [ ...selectedOptions.characters ];
		if (key === 'accessory' && value.isCombo && selectedChars[index].hairStyle !== 'bald') {
			if (selectedChars[index].hairStyle !== 'simple') { selectedChars[index].lastHairStyle = selectedChars[index].hairStyle; }
			selectedChars[index].hairStyle = 'simple';
		} else if (key === 'accessory' && !value.isCombo && selectedChars[index].hairStyle === 'simple') {
			selectedChars[index].hairStyle = selectedChars[index].lastHairStyle; 	//	'bald'
		}
		
		if (typeof value === 'object')
			value = (key === "hairColor" || key === "skinColor") ? value.primary_color : value.label;

		selectedChars[index] = { ...selectedChars[index], [key]: value };
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, characters: selectedChars }));
	};

	const handleLayoutTextChange = (value, type) => {
		// let selectedChars = [ ...selectedOptions.characters ];
		selectedOptions.text[type] = value;
		setSelectedOptions(selectedOptions => ({ ...selectedOptions }));	
	};

	/**
	 * Handle charachter change
	 * @param {*} type 
	 * @param {*} index 
	 */
	const handleCharacterChange = (character, type, index, charIndex) => {
		let selectedChars = [ ...selectedOptions.characters ];
		selectedChars[index] = { ...selectedChars[index], characterIndex: charIndex };		
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, characters: selectedChars }));
	};

	const handleAccessoryRemove = (index) => {
		let selectedChars = [ ...selectedOptions.characters ];
		selectedChars[index] = { ...selectedChars[index], accessory: '' };
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, characters: selectedChars }));		
	};

	const handlePostionChange = (event, index) => {
		let selectedChars = [ ...selectedOptions.characters ];
		let positionIndex = event.target.value;

		if (selectedChars[index]){
			let temp = selectedChars[positionIndex];
			temp.position = index;
			selectedChars[index] = { ...selectedChars[index], position: positionIndex };			
			selectedChars[positionIndex] = selectedChars[index];
			selectedChars[index] = temp;
		}
		setSelectedOptions(selectedOptions => ({ ...selectedOptions, characters: selectedChars }));
	};

	return (
		<Paper className={classes.root}>
			<Tabs
				orientation="horizontal"
				value={fpTabValue}
				indicatorColor="primary"
				textColor="primary"
				onChange={handleTabChange}
				className={classes.tabsContainer}
				variant='fullWidth'
				scrollButtons="auto"
			>
				<Tab value="memberPanel" label={isXs ? "Design" : "Choose Design"} />
				<Tab value="layoutPanel" label={isXs ? "Layout" : "Choose Layout"} />
				<Tab value="sizePanel" label={isXs ? "Size" : "Choose size"} />
			</Tabs>
			<Divider />

			<TabPanel value={fpTabValue} index="memberPanel">
				<CharacterSection
					productDetails={productDetails}
					selectedOptions={selectedOptions}
					onMemberOptionChange={handleMemberOptionChange}
					onMemberAdd={handleAddMember}
					onMemberRemove={handleRemoveMember}
					onCharacterChange={handleCharacterChange}
					onAccessoryRemove={handleAccessoryRemove}
					onPositionChange={handlePostionChange}
				/>
			</TabPanel>
			
			<TabPanel value={fpTabValue} index="layoutPanel">
				<DesignSection
					productDetails={productDetails}
					selectedOptions={selectedOptions}
					onLayoutLabelChange={handleLayoutTextChange}
					onLayoutChange={handleLayoutChange}
				/>			
			</TabPanel>

			<TabPanel value={fpTabValue} index="sizePanel">
				<SizeSection
					selectedOptions={selectedOptions}
					productDetails={productDetails}
					onSizeChange={handleSizeChange}
					onPurchaseTypeChange={handlePurchaseTypeChange}
				/>
			</TabPanel>
		</Paper>
	);
};

const mapStateToProps = state => ({
	fpCharacterTabValue	: state.fpCharacterTabValue,
	fpTabValue					:	state.fpTabValue,
});

const mapDispatchToProps = dispatch => ({
	onFPCharacterTabChange : tab => dispatch(onFPCharacterTabChange(tab)),
	onFPTabChange					 : tab => dispatch(onFPTabChange(tab)),
});

FPOMobile.propTypes = {
	defaultOptions				: PropTypes.object.isRequired,
	onOptionChange				: PropTypes.func.isRequired,
	productDetails				: PropTypes.object.isRequired,
	handleSnackToogle			: PropTypes.func.isRequired,
	fpCharacterTabValue		: PropTypes.array,
	onFPCharacterTabChange: PropTypes.func,
	onFPTabChange					: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(FPOMobile);