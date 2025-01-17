import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import clsx from 'clsx';

// import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import useStyles from '../FamilyPosterOptionStyle';
import TabPanel from '../../TabPanel';
import { PosterGridItem } from '../sections';
import {
	SERVER_PATH,
	FP_MEMBER_AVATAR_PATH,
	FP_MEMBER_SIZE_PATH,
	FP_MEMBER_BEARD_PATH,
	FP_MEMBER_FEMALE_HAIR_PATH,
	FP_MEMBER_MEN_HAIR_PATH,
	FP_MEMBER_ACCESSORIES_PATH
} from '../../../config';
import { onFPCharacterTabChange } from 'redux/actions';

const haveManHairStyles = ["man", "boy", "baby"],  smallerCharacters = ['baby', 'dog', 'cat'];

const CharacterSection = ({ productDetails, selectedOptions, onMemberOptionChange, onMemberAdd, onMemberRemove, onAccessoryRemove, onCharacterChange, onPositionChange, fpCharacterTabValue, onFPCharacterTabChange }) => {
	const classes = useStyles();

	// const imageLayoutPath = SERVER_PATH + COORDINATE_POSTER_PATH;
	/* React.useEffect(() => {
		console.log("selectedOptions Characters : ", selectedOptions.characters);
	}, [selectedOptions.characters]); */

	// const imageLayoutPath = '';
	// const isXs = useMediaQuery(theme => theme.breakpoints.down('sm'), { defaultMatches: true });
	let memberComponentCount = Object.keys(selectedOptions.characters).length;
	let positionObj = [];
	if (memberComponentCount > 1){
		for(var i=1;i<=memberComponentCount;i++){
			positionObj.push({"name":i,"label":i});
		}
	}
	return (
		<Box>
			{selectedOptions.characters.map((character, index) => (
				<MemberComponent
					key={index}
					index={index}
					productDetails={productDetails}
					onOptionChange={(value, key) => onMemberOptionChange(value, key, index)}
					selectedCharacterOptions={character}
					onCharacterChange={(charIndex) => onCharacterChange(character, 'increment', index, charIndex)}
					haveRemoveBtn={index > 0}
					onMemberRemove={() => onMemberRemove(index)}
					onAccessoryRemove={() => onAccessoryRemove(index)}
					onPositionChange={(event)  => onPositionChange(event, index)}
					positionObj={positionObj}
					fpCharacterTabValue={fpCharacterTabValue}
					onFPCharacterTabChange={onFPCharacterTabChange}
				/>
			))}
			<Button className={classes.addBtn} variant="outlined" color="primary" fullWidth onClick={onMemberAdd}>Add Family Member</Button>
		</Box>
	);
};

const MemberComponent = ({ productDetails: { characters }, onOptionChange, selectedCharacterOptions, onCharacterChange, onMemberRemove,  onAccessoryRemove, onPositionChange, index, positionObj, fpCharacterTabValue, onFPCharacterTabChange }) => {
	const getNestedObject = (value, data) => {
		let requiredObj = {};
		if (data === undefined)
			return requiredObj;
		
		data.forEach((obj) => {
		    if (obj.label === value) {
		    	requiredObj = obj;
		    }
		});
		return requiredObj;
	}
	const classes = useStyles();
	const member = characters[selectedCharacterOptions.characterIndex];
	// console.info("MEMBER :", member);

	const selectedAccessoryObj = getNestedObject(selectedCharacterOptions.accessory, member.accessories);
	const accessory	= (member.accessories && selectedAccessoryObj) ? selectedAccessoryObj : null;
	// console.info("selectedAccessoryObj : ", selectedAccessoryObj);
	const hairStyles = accessory && accessory.isCombo ? member.comboHairStyles : member.hairstyles;

	// const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'), { defaultMatches: true });
	const imageAvatarPath      = SERVER_PATH + FP_MEMBER_AVATAR_PATH;
	const sizeImagePath        = SERVER_PATH + FP_MEMBER_SIZE_PATH;
	const beardImagePath       = SERVER_PATH + FP_MEMBER_BEARD_PATH;
	const femaleHairImagePath  = SERVER_PATH + FP_MEMBER_FEMALE_HAIR_PATH;
	const manHairImagePath     = SERVER_PATH + FP_MEMBER_MEN_HAIR_PATH;
	const accessoriesImagePath = SERVER_PATH + FP_MEMBER_ACCESSORIES_PATH;
	//console.info("MEMBER:-", selectedCharacterOptions);
	const handleTabChange = (event, newValue) => {
		let fpCharTabValue = [ ...fpCharacterTabValue ];
		fpCharTabValue[index] = newValue;
		onFPCharacterTabChange(fpCharTabValue);
	};

	const handleInputChange = (event) => {
		onOptionChange(event.target.value, 'name');
	};

	return (
		<Box>
			<div className={classes.memberContainer}>
				<div className={classes.memberNameContainer}>
				  <Typography className={classes.memberLabel}>Member { index + 1 }</Typography>
					<TextField
						id={"text-name_" + index}
						label="Name"
						name="name"
						value={selectedCharacterOptions.name || ''}
						onChange={handleInputChange}
						variant="outlined"
						margin="dense"
						inputProps={{ maxLength: 20 }}
						className={classes.input}
					/>
				</div>
				<div className={classes.actionContainer}>
					{ positionObj.length > 0 &&
						<SelectInput
							label="Position"
							items={positionObj}
							selectedValue={(selectedCharacterOptions.position !== undefined || selectedCharacterOptions.position !== "") ? selectedCharacterOptions.position : index}
							onSelectChange={event => onPositionChange(event)}
							labelWidth={58}
							name="position"
							className={classes.positionLabel}
						/>
					}					
					{ index > 0 &&
						<Button
							color="secondary"
							className={classes.removeMemberBtn}
							variant="outlined"
							startIcon={<DeleteIcon />}
							onClick={onMemberRemove}
						>
						</Button>
					}
				</div>
				<Tabs
					orientation="horizontal"
        	variant="scrollable"
					value={fpCharacterTabValue[index]}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="primary"
				>
					<Tab className={classes.tabHandle} label="Character" value="characterPanel" />
					<Tab className={classes.tabHandle} label="Size" value="sizePanel" />
					{ member.hairstyles !== undefined && <Tab className={classes.tabHandle} label="Hairstyle" value="hairPanel" /> }
					{ member.beards !== undefined && <Tab className={classes.tabHandle} label="Beard" value="beardPanel" /> }
					{ member.hairColors !== undefined && <Tab className={classes.tabHandle} label="Hair color" value="hairColorPanel" /> }
					{ member.skinColors !== undefined && <Tab className={classes.tabHandle} label="Skin color" value="skinStylePanel" /> }
					{ member.accessories !== undefined && <Tab className={classes.tabHandle} label="Accessories" value="accessoryPanel" /> }
				</Tabs>
				<Divider />
				<TabPanel value={fpCharacterTabValue[index]} index="characterPanel">
					<Grid container spacing={1} className={classes.containerGrid}>
						{characters.map((member, index) => (
							<PosterGridItem
								key={index}
								item={member}
								title={member.name}
								activeItem={selectedCharacterOptions.characterIndex + 1}
								onItemChange={event => onCharacterChange(index)}
								imgSrc={imageAvatarPath + member.label + ".png"}
								imageStyle={smallerCharacters.includes(member.label) ? classes.smallerMemberImage : classes.memberImage}
							/>
						))}
					</Grid>
				</TabPanel>
				<TabPanel value={fpCharacterTabValue[index]} index="sizePanel">
					<Grid container spacing={1} className={classes.containerGrid}>
					{member.sizes.map((size, index) => (
						<PosterGridItem
							key={index}
							item={size}
							title={size.name}
							activeItem={selectedCharacterOptions.size}
							onItemChange={event => onOptionChange(event, 'size')}
							imgSrc={sizeImagePath + member.label + "_" + size.label + ".png"}
							imageStyle={classes.sizeImage}
						/>
					))}
					</Grid>
				</TabPanel>
				{ member.hairstyles &&
					<TabPanel value={fpCharacterTabValue[index]} index="hairPanel">
						<Grid container spacing={1} className={classes.containerGrid}>
						{ hairStyles.map((hairStyle, index) => (
							<PosterGridItem
								key={index}
								item={hairStyle}
								title={hairStyle.name}
								activeItem={selectedCharacterOptions.hairStyle}
								onItemChange={event => onOptionChange(event, 'hairStyle')}
								imgSrc={haveManHairStyles.includes(member.label) ? manHairImagePath + hairStyle.image : femaleHairImagePath + hairStyle.image}
								imageStyle={classes.hairSizeImage}
							/>
						))}
						</Grid>
					</TabPanel>
				}
				{ member.hairColors !== undefined &&
					<TabPanel value={fpCharacterTabValue[index]} index="hairColorPanel">
						<Grid container spacing={1} className={classes.containerGrid}>
							{member.hairColors.map((hairColor, index) => (
								<ColorOptions
									key={index}
									color={hairColor}
									activeItem={selectedCharacterOptions.hairColor}
									onItemChange={event => onOptionChange(event, 'hairColor')}
								/>
							))}
						</Grid>
					</TabPanel>
				}
				{ member.skinColors !== undefined &&
					<TabPanel value={fpCharacterTabValue[index]} index="skinStylePanel">
						<Grid container spacing={1} className={classes.containerGrid}>
							{member.skinColors.map((skinColor, index) => (
								<ColorOptions
									key={index}
									color={skinColor}
									activeItem={selectedCharacterOptions.skinColor}
									onItemChange={event => onOptionChange(event, 'skinColor')}
								/>
							))}
						</Grid>
					</TabPanel>
				}
				{ member.beards !== undefined &&
					<TabPanel value={fpCharacterTabValue[index]} index="beardPanel">
						<Grid container spacing={1} className={classes.containerGrid}>
						{member.beards.map((beard, index) => (
							<PosterGridItem
								key={index}
								item={beard}
								title={beard.name}
								activeItem={selectedCharacterOptions.beard}
								onItemChange={event => onOptionChange(event, 'beard')}
								imgSrc={beardImagePath + beard.image}
								imageStyle={classes.hairSizeImage}
							/>
						))}
						</Grid>
					</TabPanel>
				}
				{ member.accessories !== undefined &&
					<TabPanel value={fpCharacterTabValue[index]} index="accessoryPanel">
						<Grid container spacing={1} className={classes.containerGrid}>
						{ member.accessories.map((accessory, index) => (
							<PosterGridItem
								key={index}
								item={accessory}
								title={accessory.name}
								activeItem={selectedCharacterOptions.accessory}
								onItemChange={event => onOptionChange(event, 'accessory')}
								imgSrc={accessoriesImagePath + accessory.image}
								imageStyle={classes.hairSizeImage}
							/>
						)) }
						</Grid>
					</TabPanel>
				}
			</div>
		</Box>
	);
};

const SelectInput = ({ label, selectedValue, onSelectChange, items, labelWidth, showNone, name="status", className="" }) => {
	const classes = useStyles();
	//console.log("HERE", label, selectedValue, typeof(selectedValue))
	return (
		<FormControl className={classes.inputField} fullWidth variant="outlined" margin="dense">
			<InputLabel id="select-label">{label}</InputLabel>
			<Select
				labelId="select-label"
				id="select-outlined"
				name={name}
				fullWidth
				labelWidth={labelWidth}
				value={selectedValue}
				onChange={onSelectChange}
				className={className}
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


const ColorOptions = ({ color,  activeItem, onItemChange }) => {
	const classes = useStyles();
	return (
		<Grid
			className={classes.colorItem}
			item
			xs={4} sm={3} md={3} lg={3}
			onClick={() => onItemChange(color)}
		>
			{activeItem === color.primary_color ? (
				<Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} overlap="circular">
					<div className={classes.colorView} style={{ backgroundColor: color.primary_color }} />
				</Badge>
			) : (
				<div className={classes.colorView} style={{ backgroundColor: color.primary_color }} />
			)}
			<Typography className={classes.swatchTitle}>{color.name}</Typography>
		</Grid>
	);
};

const mapDispatchToProps = dispatch => ({
	onFPCharacterTabChange: tab => dispatch(onFPCharacterTabChange(tab)),
});

const mapStateToProps = state => ({
	fpCharacterTabValue: state.fpCharacterTabValue,
});


CharacterSection.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	onMemberOptionChange: PropTypes.func.isRequired,
	onMemberAdd: PropTypes.func.isRequired,
	onMemberRemove: PropTypes.func.isRequired,
	onCharacterChange: PropTypes.func.isRequired,
	onAccessoryRemove: PropTypes.func.isRequired,
	onPositionChange: PropTypes.func.isRequired,
	fpCharacterTabValue: PropTypes.array,
	onFPCharacterTabChange: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(CharacterSection);