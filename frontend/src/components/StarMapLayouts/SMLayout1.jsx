import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';

import { convertDMS } from '../../utils/formatter';
import useStyles from './StarMapLayoutStyle';
import { SMCircle, SMHeart } from '../StarMapShapes';

const SMLayout1 = ({ productDetails, selectedOptions, celestialConfig, children }) => {
	const classes = useStyles();
	const setContainerClass = () => {
		let classNames = classes.posterPreviewContainer;
		if (productDetails.sizes[selectedOptions.size]) {
			classNames = clsx(classes.posterPreviewContainer, classes[productDetails.sizes[selectedOptions.size].class])
		}
		return classNames;
	};

	const setShape = () => {
		switch (selectedOptions.shape) {
			case 'smCircle'	: return <SMCircle bgColor={celestialConfig.color.color} />;
			case 'smHeart'	:	return <SMHeart bgColor={celestialConfig.color.color} />;
			default					: return <SMCircle bgColor={celestialConfig.color.color} />
		}
	};

	return (
		<div className={setContainerClass()} style={{ backgroundColor: celestialConfig.color.color }} >
			<div className={classes.infoTitles}>
				<Typography variant="h5" className={classes.title}>{selectedOptions.text.title}</Typography>
				<Typography className={classes.subtitlefirst} variant="subtitle1">{selectedOptions.text.message}</Typography>
			</div>
			<div className={classes.choosenShape}>
				<div className={classes.dynamicShape}>
					{setShape()}
				</div>
				{children}
				{/* <div id="celestial-map"></div> */}
			</div>
			<div className={classes.infobox}>
				<Typography>{moment(celestialConfig.date).format('LL')}</Typography>
				<Typography variant="h6">{selectedOptions.text.placeText}</Typography>
				<Typography>{convertDMS(celestialConfig.location.lat, celestialConfig.location.lng)}</Typography>
			</div>
		</div>
	);
};

SMLayout1.propTypes = {
	productDetails: PropTypes.object.isRequired,
	selectedOptions: PropTypes.object.isRequired,
	celestialConfig: PropTypes.object.isRequired,
};

export default SMLayout1;