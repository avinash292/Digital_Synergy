import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// import Box from '@material-ui/core/Box';
import { Image } from "components/atoms";
// import { LearnMoreLink, Image } from 'components/atoms';
// import { SectionHeader } from 'components/molecules';
import { CardBase } from "components/organisms";

const useStyles = makeStyles((theme) => ({
  root: {},
  logo: {
    maxWidth: 50,
  },
  title: {
    textAlign: "center",
    paddingBottom: theme.spacing(2),
  },
  cardGrid: {
    textDecoration: "none",
  },
}));

const Posters = (props) => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  // const theme = useTheme();
  // const isMd = useMediaQuery(theme.breakpoints.up('md'), {
  // 	defaultMatches: true,
  // });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Typography className={classes.title} variant="h5" gutterBottom>
        Custom Posters
      </Typography>
      <Grid container spacing={2} data-aos="fade-up">
        {data.map((item, index) => (
          <Grid
            className={classes.cardGrid}
            item
            xs={3}
            key={index}
            component={Link}
            to={item.link}
          >
            <CardBase withShadow liftUp>
              <Image
                src={item.logo}
                alt={item.name}
                className={classes.logo}
                lazy={false}
              />
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {item.name}
              </Typography>
            </CardBase>
          </Grid>
        ))}
      </Grid>
      {/* <Grid container spacing={isMd ? 4 : 2}>
				<Grid item xs={12} md={6} data-aos="fade-up">
					<SectionHeader
						title="We love to explore new ways to engage with brands and reach"
						subtitle="Our mission is to help you to grow your design skills, meet and connect with professional dsigners who share your passions."
						align="left"
						label="100+ Integrations"
						ctaGroup={[
							<LearnMoreLink
								title="See all integrations"
								href="#"
								variant="h6"
							/>,
						]}
						disableGutter
					/>
				</Grid>
				<Grid item xs={12} md={6} data-aos="fade-up">
					<Grid container spacing={2}>
						{data.map((item, index) => (
							<Grid item xs={4} key={index}>
								<CardBase withShadow liftUp>
									<Image
										src={item.logo}
										alt={item.name}
										className={classes.logo}
										lazy={false}
									/>
								</CardBase>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid> */}
    </div>
  );
};

Posters.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Posters;
