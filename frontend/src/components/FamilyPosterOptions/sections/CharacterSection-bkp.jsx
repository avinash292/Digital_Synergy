import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import Divider from '@material-ui/core/Divider';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/Delete';

import useStyles from '../FamilyPosterOptionStyle';
import MemberPlaceholderImage from '../member-placeholder.png';

const haveHairStyles = ['man', 'woman', 'boy', 'girl', 'baby'], haveHairColors = ['man', 'woman', 'boy', 'girl', 'baby'];

const CharacterSection = ({ productDetails, selectedOptions, onMemberOptionChange, onMemberAdd, onMemberRemove, onCharacterChange }) => {
	const classes = useStyles();

	/* React.useEffect(() => {
		console.log("selectedOptions.characters : ", selectedOptions.characters);
	}, [selectedOptions.characters]); */

	// const imageLayoutPath = SERVER_PATH + COORDINATE_POSTER_PATH;
	// const isXs = useMediaQuery(theme => theme.breakpoints.down('sm'), { defaultMatches: true });

	return (
		<Box>
			{selectedOptions.characters.map((character, index) => (
				<MemberComponent
					key={index}
					productDetails={productDetails}
					onOptionChange={(value, key) => onMemberOptionChange(value, key, index)}
					selectedCharacterOptions={character}
					onCharacterChange={(type) => onCharacterChange(type, index)}
					haveRemoveBtn={index > 0}
					onMemberRemove={() => onMemberRemove(index)}
				/>
			))}
			<Button className={classes.addBtn} variant="outlined" color="primary" fullWidth onClick={onMemberAdd}>Add Family Member</Button>
		</Box>
	);
};

const MemberComponent = ({ productDetails: { characters }, onOptionChange, selectedCharacterOptions, onCharacterChange, haveRemoveBtn, onMemberRemove }) => {
	const classes = useStyles();
	const member = characters[selectedCharacterOptions.characterIndex];

	const accessory	= (member.accessories && member.accessories[selectedCharacterOptions.accessory]) ? member.accessories[selectedCharacterOptions.accessory] : null;
	// console.log("accessory : ", accessory);

	const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'), { defaultMatches: true });

	const handleInputChange = (event) => {
		onOptionChange(event.target.value, 'name');
	};

	return (
		<Box>
			<Grid container direction={isDesktop ? "row" : "column" } justify="space-evenly" alignItems="flex-start" spacing={2}>
				<Grid item sm={12} md={6} className={classes.gridItem}>
					<div className={classes.memberCharacter}>
						<IconButton aria-label="left" onClick={() => onCharacterChange('decrement')}><ChevronLeftIcon /></IconButton>
						<div className={classes.characterContainer}>
							<img className={classes.memberImage} src={MemberPlaceholderImage} alt="MemberPlaceholderImage" />
							{characters[selectedCharacterOptions.characterIndex].name}
						</div>
						<IconButton aria-label="right" onClick={() => onCharacterChange('increment')}><ChevronRightIcon /></IconButton>
					</div>
					{haveRemoveBtn &&
						<Button
							color="secondary"
							className={classes.addBtn}
							variant="outlined"
							fullWidth
							startIcon={<DeleteIcon />}
							onClick={onMemberRemove}
						>
							Remove Member
						</Button>}
				</Grid>
				<Grid item sm={12} md={6} className={classes.memberInfo}>
					<SelectInput
						label="Size"
						selectedValue={selectedCharacterOptions.size}
						onSelectChange={event => onOptionChange(event.target.value, 'size')}
						items={characters[selectedCharacterOptions.characterIndex].sizes}
						labelWidth={30}
					/>
					{haveHairStyles.includes(characters[selectedCharacterOptions.characterIndex].label)  && 
						<SelectInput
							label="Hairstyles"
							selectedValue={selectedCharacterOptions.hairStyle}
							onSelectChange={event => onOptionChange(event.target.value, 'hairStyle')}
							items={accessory && accessory.isCombo ? characters[selectedCharacterOptions.characterIndex].comboHairStyles : characters[selectedCharacterOptions.characterIndex].hairstyles}
							labelWidth={75}
						/>
					}
					{haveHairColors.includes(characters[selectedCharacterOptions.characterIndex].label)  && 
						<SelectInput
							label="Hair Colors"
							selectedValue={selectedCharacterOptions.hairColor}
							onSelectChange={event => onOptionChange(event.target.value, 'hairColor')}
							items={characters[selectedCharacterOptions.characterIndex].hairColors}
							labelWidth={80}
						/>
					}
					{characters[selectedCharacterOptions.characterIndex].label === 'man' && 
						<SelectInput
							label="Beards"
							selectedValue={selectedCharacterOptions.beard}
							onSelectChange={event => onOptionChange(event.target.value, 'beard')}
							items={characters[selectedCharacterOptions.characterIndex].beards}
							labelWidth={50}
							showNone={true}
						/>
					}
					{haveHairColors.includes(characters[selectedCharacterOptions.characterIndex].label)  && 
						<SelectInput
							label="Accessories"
							selectedValue={selectedCharacterOptions.accessory}
							onSelectChange={event => onOptionChange(event.target.value, 'accessory')}
							items={characters[selectedCharacterOptions.characterIndex].accessories}
							labelWidth={80}
							showNone={true}
						/>
					}
					{characters[selectedCharacterOptions.characterIndex].label === 'pet' && 
						<SelectInput
							label="Pet"
							selectedValue={selectedCharacterOptions.type}
							onSelectChange={event => onOptionChange(event.target.value, 'type')}
							items={characters[selectedCharacterOptions.characterIndex].types}
							labelWidth={25}
							showNone={false}
						/>
					}
					<TextField
						id="text-name"
						label="Name"
						name="name"
						// value={selectedOptions.text.name || ''}
						onChange={handleInputChange}
						variant="outlined"
						fullWidth
						margin="dense"
						inputProps={{ maxLength: 80 }}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

const SelectInput = ({ label, selectedValue, onSelectChange, items, labelWidth, showNone }) => {
	const classes = useStyles();
	return (
		<FormControl className={classes.inputField} fullWidth variant="outlined" margin="dense">
			<InputLabel id="select-label">{label}</InputLabel>
			<Select
				labelId="select-label"
				id="select-outlined"
				name="status"
				fullWidth
				labelWidth={labelWidth}
				value={selectedValue}
				onChange={onSelectChange}
			>
				{showNone && <MenuItem value=""> <em>None</em></MenuItem>}
				{items && items.map((item, index) => (
					<MenuItem value={index} key={index}>
						{item.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};


CharacterSection.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	onMemberOptionChange: PropTypes.func.isRequired,
	onMemberAdd: PropTypes.func.isRequired,
	onMemberRemove: PropTypes.func.isRequired,
	onCharacterChange: PropTypes.func.isRequired,
};
export default CharacterSection;