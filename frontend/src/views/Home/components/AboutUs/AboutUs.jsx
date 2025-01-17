import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	placementGrid: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	placementGridItemMiddle: {
		margin: `0 ${theme.spacing(3)}px`,
	},
	coverImage: {
		boxShadow:
			'25px 60px 125px -25px rgba(80,102,144,.1), 16px 40px 75px -40px rgba(0,0,0,.2)',
		borderRadius: theme.spacing(2),
		[theme.breakpoints.down('sm')]: {
			maxWidth: 500,
		},
	},
	topGrid: {
		paddingBottom: theme.spacing(6),
		[theme.breakpoints.down('sm')]: {
			paddingBottom: theme.spacing(2),
		},
	}
}));

const AboutUs = props => {
	const { className, ...rest } = props;
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, className)} {...rest}>
			<Grid container spacing={4} className={classes.topGrid}>
				<Grid
					item
					container
					justifyContent="center"
					alignItems="center"
					xs={12}
					md={6}
					data-aos="fade-up"
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<SectionHeader
								title={
									<span>
										About Us
									</span>
								}
								subtitle="Posteresque was founded out of a passion for Travel, Family, Friends and the need to celebrate life's best moments. We believe that there should be a unique way to commemorate some of the best moments in our lives, our favourite Places, People & much more. Having these memories and moments in the form of a uniquely designed Poster adds so much more sentiment and meaning versus an album on a phone. We wanted to give people a way to not only design a unique, meaningful design, but to completely brighten up their space too. "
								align="right"
								fadeUp
								// disableGutter
								titleVariant="h3"
								subtitleVariant="subtitle1"
							/>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.placementGrid}>
								<Button variant="outlined" color="primary">Contact</Button>
								<Button variant="contained" color="primary">Read More...</Button>
							</div>
						</Grid>
					</Grid>
				</Grid>

				<Grid
					item
					container
					justifyContent="flex-start"
					alignItems="center"
					xs={12}
					md={6}
					data-aos="fade-up"
				>
					<Image
						src="/images/illustrations/sample-3.webp"
						alt="..."
						className={classes.coverImage}
						data-aos="flip-left"
						data-aos-easing="ease-out-cubic"
						data-aos-duration="2000"
					/>
				</Grid>
			</Grid>

			<Grid container spacing={4}>
				<Grid
					item
					container
					justifyContent="flex-start"
					alignItems="center"
					xs={12}
					md={6}
					data-aos="fade-up"
				>
					<Image
						src="/images/illustrations/sample-3.webp"
						alt="..."
						className={classes.coverImage}
						data-aos="flip-left"
						data-aos-easing="ease-out-cubic"
						data-aos-duration="2000"
					/>
				</Grid>

				<Grid
					item
					container
					justifyContent="center"
					alignItems="center"
					xs={12}
					md={6}
					data-aos="fade-up"
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<SectionHeader
								title={
									<span>
										Fast & Efficient
									</span>
								}
								subtitle="Posteresque was founded in New Brighton, United Kingdom. We have our own printing facilities in the UK, and we have strategically placed printing partners across The United States & Europe. This allows us to offer quicker Worldwide shipping times with a reduced carbon footprint. Each print is thoroughly quality checked and safely packaged before we ship it out to you. "
								align="left"
								fadeUp
								// disableGutter
								titleVariant="h3"
								subtitleVariant="subtitle1"
							/>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.placementGrid}>
								<Button variant="contained" color="primary">Design Now !</Button>
							</div>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

AboutUs.propTypes = {
	/**
	 * External classes
	 */
	className: PropTypes.string,
};

export default AboutUs;
