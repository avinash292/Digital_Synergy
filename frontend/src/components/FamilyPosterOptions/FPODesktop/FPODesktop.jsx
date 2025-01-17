import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import useStyles from '../FamilyPosterOptionStyle';
import SizeSection from '../../SizeSection';
import { CharacterSection, DesignSection } from '../sections';
import { onFPCharacterTabChange } from 'redux/actions';

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
	lastHairStyle: 'bald',
};

const FPODesktop = ({ defaultOptions, onOptionChange, productDetails, handleSnackToogle, onFPCharacterTabChange, fpCharacterTabValue }) => {
	const classes = useStyles();
	const [expanded, setExpanded] = useState('memberPanel');
	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);

	useEffect(() => {
		onOptionChange(selectedOptions);
	}, [selectedOptions, onOptionChange]);
	

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
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
			defaultSelectedCharacter.position = selectedOptions.characters.length;
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
		selectedOptions.text[type] = value;
		setSelectedOptions(selectedOptions => ({ ...selectedOptions }));	
	};

	/**
	 * Handle character change
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
		<Container className={classes.root}>
			<Accordion expanded={expanded === 'memberPanel'} onChange={handleChange('memberPanel')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="memberPanel-content"
					id="memberPanel-header"
				>
					<Typography className={classes.heading}>Choose Characters</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion} id="characters-accordian">
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
				</AccordionDetails>
			</Accordion>
			
			<Accordion expanded={expanded === 'layoutPanel'} onChange={handleChange('layoutPanel')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="layoutPanel-content"
					id="layoutPanel-header"
				>
					<Typography className={classes.heading}>Choose Layout</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion}>
					<DesignSection
						productDetails={productDetails}
						selectedOptions={selectedOptions}
						onLayoutLabelChange={handleLayoutTextChange}
						onLayoutChange={handleLayoutChange}
					/>
				</AccordionDetails>
			</Accordion>

			<Accordion expanded={expanded === 'sizePanel'} onChange={handleChange('sizePanel')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="sizePanel-content"
					id="sizePanel-header"
				>
					<Typography className={classes.heading}>Choose size</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.designAccordion}>
					<SizeSection
						selectedOptions={selectedOptions}
						productDetails={productDetails}
						onSizeChange={handleSizeChange}
						onPurchaseTypeChange={handlePurchaseTypeChange}
					/>
				</AccordionDetails>
			</Accordion>
		</Container>
	);
};

const mapStateToProps = state => ({
	fpCharacterTabValue: state.fpCharacterTabValue,
});

const mapDispatchToProps = dispatch => ({
	onFPCharacterTabChange: tab => dispatch(onFPCharacterTabChange(tab)),
});

FPODesktop.propTypes = {
	defaultOptions				: PropTypes.object.isRequired,
	onOptionChange				: PropTypes.func.isRequired,
	productDetails				: PropTypes.object.isRequired,
	handleSnackToogle			: PropTypes.func.isRequired,
	fpCharacterTabValue		: PropTypes.array,
	onFPCharacterTabChange: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(FPODesktop);