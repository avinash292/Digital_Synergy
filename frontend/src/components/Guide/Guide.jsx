import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Image } from 'components/atoms';

import useStyles from './GuideStyle';
import PosterImage from './material-poster-paper.jpg';

const Guide = ({ className, ...rest }) => {
	const classes = useStyles();


	const theme = useTheme();
	const isMd = useMediaQuery(theme.breakpoints.up('md'), { defaultMatches: true });

	return (
		<div className={clsx(classes.root, className)} {...rest}>
			<Typography variant="h4" align="center" className={classes.title}>
				<b>Enjoy custom wall art in a space that is personal to you</b>
			</Typography>
			<Grid container spacing={isMd ? 6 : 2}>
				<Grid item xs={12} sm={6} className={classes.sectionItem}>
					<Image
						src={PosterImage}
						alt="TheFront Company"
						data-aos="fade-up"
						className={classes.sectionImg}
					/>
					<Typography variant="h6" align="center"><b>Material</b></Typography>
					<Typography variant="subtitle2" align="center">
						Enhanced Matte Art 200gsm premium-quality heavyweight fine art paper gentle textured surface. Brilliant vibrant colours, deep blacks and almost three dimensional depth. Perfect for fine art.
					</Typography>
				</Grid>

				<Grid item xs={12} sm={6} className={classes.sectionItem}>
					<Image
						src={PosterImage}
						alt="TheFront Company"
						data-aos="fade-up"
						className={classes.sectionImg}
					/>
					<Typography variant="h6" align="center"><b>How it works</b></Typography>
					<Typography variant="subtitle2" align="center">
						Design your own unique personalised custom poster easily with our poster editor by getting an instant preview each time you add a personal touch.
					</Typography>
					<Typography variant="subtitle2" align="center">
						Click your way through each tab where you can change almost every part of the poster. Depending on the poster there are different choices to be made.
					</Typography>
				</Grid>

			</Grid>
		</div>
	);
};

Guide.propTypes = {
	/**
	 * External classes
	 */
	 className: PropTypes.string,
};

export default Guide;