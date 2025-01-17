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
	},
	badgeIcon: {
		backgroundColor: theme.palette.success.main,
		color: '#fff',
		borderRadius: 50,
		padding: 0
	},
	title: {
		[theme.breakpoints.down('xs')]: {
			fontSize: 12,
			textAlign: 'center',
		},
	},
	imageStyle: {
		[theme.breakpoints.down('xs')]: {
			height: theme.spacing(6),
		},
	},
}));


const GridItem = ({ item, title, activeItem, onItemChange, imgSrc, imageStyle }) => {
	const classes = useStyles();
	return (
		<Grid
			className={classes.gridItem}
			item
			xs={3} sm={3} md={3} lg={3}
			onClick={() => onItemChange(item)}
		>
			{activeItem.id === item.id ? (
				<Badge badgeContent={<CheckCircleOutlineIcon className={classes.badgeIcon} />} overlap="circular">
					<img className={clsx(classes.imageStyle, imageStyle)} src={imgSrc} alt={item.label} />
				</Badge>
			) : (
				<img className={clsx(classes.imageStyle, imageStyle)} src={imgSrc} alt={item.label} />
			)}			
			<Typography className={classes.title}>{title}</Typography>
		</Grid>
	);
};


GridItem.propTypes = {
	item: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	activeItem: PropTypes.object.isRequired,
	onItemChange: PropTypes.func.isRequired,
	imgSrc: PropTypes.any.isRequired,
	imageStyle: PropTypes.any,
};

export default GridItem;