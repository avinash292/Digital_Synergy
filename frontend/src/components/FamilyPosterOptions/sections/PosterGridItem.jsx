import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({	
	gridItem: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer',
		[theme.breakpoints.down('sm')]: {
			padding: '16px 8px !important',
			justifyContent: 'flex-start',
		},
	},
	badgeIcon: {
		backgroundColor: theme.palette.success.main,
		color: '#fff',
		borderRadius: 50,
		padding: 0
	},
	title: {
		textAlign: 'center',
		[theme.breakpoints.down('xs')]: {
			fontSize: 12,
			textAlign: 'center',
		},
	},
	swatchTitle:{
		textAlign: 'center',
		fontSize: 14,
		[theme.breakpoints.down('sm')]: {
			fontSize: 12,
			padding: '0 3px',
		},
	},
	imageStyle: {
		[theme.breakpoints.down('sm')]: {
			height: theme.spacing(6),
		},
	},
}));


const PosterGridItem = ({ item, title, activeItem, onItemChange, imgSrc, imageStyle }) => {
	const classes = useStyles();
	let gridElement = <img className={clsx(classes.imageStyle, imageStyle)} src={imgSrc} alt={item.name} />;

	if (activeItem !== undefined){
		if ( Number.isInteger(activeItem) ){
	 		if (activeItem === item.id)
				gridElement = <Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} overlap="rectangular"><img className={clsx(classes.imageStyle, imageStyle)} src={imgSrc} alt={item.name} /></Badge>;
		}
		else{
			if (item.primary_color){
				if (activeItem === item.primary_color)
					gridElement = <Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} overlap="rectangular"><img className={clsx(classes.imageStyle, imageStyle)} src={imgSrc} alt={item.name} /></Badge>;			
			}
			if (activeItem === item.label)
				gridElement = <Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} overlap="rectangular"><img className={clsx(classes.imageStyle, imageStyle)} src={imgSrc} alt={item.name} /></Badge>;			
		}		
	}
	
	return (
		<Grid
			className={classes.gridItem}
			item
			xs={3} sm={3} md={3} lg={3}
			onClick={() => onItemChange(item)}
		>	
		{gridElement}
		<Typography className={classes.swatchTitle}>{title}</Typography>
		</Grid>
	);
};


PosterGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	activeItem: PropTypes.any,
	onItemChange: PropTypes.func.isRequired,
	imgSrc: PropTypes.any.isRequired,
	imageStyle: PropTypes.any,
};

export default PosterGridItem;