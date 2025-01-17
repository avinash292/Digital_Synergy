import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
// import useMediaQuery from '@material-ui/core/useMediaQuery';


import useStyles from '../FamilyPosterOptionStyle';
import GridItem from '../../GridItem';
import { SERVER_PATH, FAMILY_POSTER_PATH } from '../../../config';
import TextField from '@material-ui/core/TextField';

const DesignSection = ({ productDetails, selectedOptions, onLayoutLabelChange, onLayoutChange }) => {
	const classes = useStyles();

	const imageLayoutPath = SERVER_PATH + FAMILY_POSTER_PATH;
  // const isXs = useMediaQuery(theme => theme.breakpoints.down('sm'), { defaultMatches: true });
  const handleInputChange = (event) => {
    onLayoutLabelChange(event.target.value, event.target.name);
  };

	return (
		<Box>
      <Grid container spacing={1}>
        {productDetails.layouts.map((layout, index) => (
          <GridItem
            key={index}
            item={layout}
            title={layout.name}
            activeItem={selectedOptions.layout}
            onItemChange={onLayoutChange}
            imgSrc={imageLayoutPath + layout.image}
            imageStyle={classes.layoutImgSize}
          />
        ))}
        <TextField
          id="family-title-label"
          label="Family Name"
          name="title"
          value={selectedOptions.text.title || ''}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          margin="dense"
          inputProps={{ maxLength: 22 }}
        />
        {selectedOptions.layout.label === "layout_2" && 
          <TextField
            id="family-subtitle-label"
            label="Family Quote"
            name="subtitle"
            value={selectedOptions.text.subtitle || ''}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="dense"
            inputProps={{ maxLength: 30 }}
          />
        }
      </Grid>
		</Box>
	);
};


DesignSection.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	onLayoutChange: PropTypes.func.isRequired,
};
export default DesignSection;