/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import CloseIcon from '@material-ui/icons/Close';

import AuthService from 'services/authService';
import history from "utils/history";

const useStyles = makeStyles(theme => ({
	root: {
	},
	listItem: {
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	listItemIcon: {
		minWidth: 'auto',
	},
	listItemLink: {
		textDecoration: 'none',
	},
	closeIcon: {
		justifyContent: 'flex-end',
		cursor: 'pointer',
	},
	divider: {
		width: '100%',
	},
	countCircle: {
		background: theme.palette.secondary.main,
		borderRadius: '50%',
		marginLeft: theme.spacing(1),
		padding: theme.spacing(0.3, 1),
	},
}));

const SidebarNav = ({ pages, onClose, className, cartCount, products }) => {
	// const { pages, onClose, className, cartCount, ...rest } = props;
	const classes = useStyles();

	const logoutUser = () => {
		AuthService.logout();
	};

	const handleNavigation = (product) => {
		onClose();
		if (product) {
			switch (product.label) {
				case "star_map"						:	return history.push('/starmap');
				case "city_map"						:	return history.push('/citymap');
				case "coordinate_poster"	:	return history.push('/coordinate-poster');
				case "family_poster"			:	return history.push('/family-poster');
				case "dog_poster"					:	return history.push('/dog-poster');
				default										:	return history.push('/starmap');
			}
		}
	};

	// <List {...rest} className={clsx(classes.root, className)}>

	return (
		<List className={clsx(classes.root, className)}>
			<ListItem className={classes.closeIcon} onClick={onClose}>
				<ListItemIcon className={classes.listItemIcon}>
					<CloseIcon fontSize="small" />
				</ListItemIcon>
			</ListItem>
			<ListItem className={classes.listItem}>
				<Typography
					variant="h6"
					color="primary"
					component="a"
					href="/home"
					className={classes.listItemLink}
				>
					Home
				</Typography>
			</ListItem>

			{products.map((singleProduct, index) => (
				<ListItem className={classes.listItem} key={index}>
					<Typography						
						variant="h6"
						color="primary"
						component="a"
						// href="/home"
						className={classes.listItemLink}
						onClick={() => handleNavigation(singleProduct)}
					>
						{singleProduct.name}
					</Typography>
				</ListItem>
			))}
			<Divider />

			{AuthService.checkToken() ? (
				<div>
					<ListItem className={classes.listItem} onClick={onClose}>
						<Typography
							variant="h6"
							color="primary"
							className={classes.listItemLink}
							component={Link}
							to="/profile"
						>
							My Profile
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem} onClick={onClose}>
						<Typography
							variant="h6"
							color="primary"
							className={classes.listItemLink}
							component={Link}
							to="/cart"
						>
							My Cart <span className={classes.countCircle}>{cartCount}</span>
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem} onClick={onClose}>
						<Typography
							variant="h6"
							color="primary"
							className={classes.listItemLink}
							component={Link}
							to="/orders"
						>
							My Orders
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem}>
						<Typography
							variant="h6"
							color="primary"
							component="a"
							// href="/signin"
							className={classes.listItemLink}
							onClick={logoutUser}
						>
							Logout
						</Typography>
					</ListItem>
				</div>
			) : (
				<ListItem className={classes.listItem}>
					<Typography
						variant="h6"
						color="primary"
						// component="a"
						// href="/signin"
						className={classes.listItemLink}
						component={Link}
						to="/signin"
					>
						Sign In
					</Typography>
				</ListItem>
			)}

		</List>
	);
};

SidebarNav.propTypes = {
	className: PropTypes.string,
	pages: PropTypes.object.isRequired,
	onClose: PropTypes.func,
	products: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
	return { cartCount: state.cartCount };
};

export default connect(mapStateToProps)(SidebarNav);
