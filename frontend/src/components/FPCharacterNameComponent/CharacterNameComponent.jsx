import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import useStyles from './CharacterNameStyle';
import { FP_POSTER_SIZES } from '../../config';


const CharacterNameComponent = ({ name, isDownXSS, isDownXS, isDownLG, isLandscape, charsCount, classStyle }) => {
	const classes = useStyles();

	const setSubtitleFontSize = (length) => {
		length = length || 1;
		let fontSize = isLandscape ? 14 : 16;
		if (charsCount > 3 && charsCount < 8)
			fontSize = isLandscape ? 13 : 16;
		else if (charsCount >= 8)
			fontSize = isLandscape ? 13 : 14;

		/* if (length > 10 && length < 18) { fontSize = 14; }
		else if (length >= 18) { fontSize = 12; } */

		if (isDownXSS) { fontSize = (FP_POSTER_SIZES.frameWidthMobile / FP_POSTER_SIZES.frameWidthLG) * fontSize; }
		else if (isDownXS) { fontSize = (FP_POSTER_SIZES.frameWidthTablet / FP_POSTER_SIZES.frameWidthLG) * fontSize; }
		else if (isDownLG) { fontSize = (FP_POSTER_SIZES.frameWidth / FP_POSTER_SIZES.frameWidthLG) * fontSize; }
		return fontSize;
	};

	return (
		<Typography className={clsx(classes.characterName, classStyle)} style={{ fontSize: setSubtitleFontSize(name.length) }}>{name}</Typography>
	);
}
CharacterNameComponent.propTypes = {
	name				: PropTypes.string.isRequired,
	charsCount	: PropTypes.number.isRequired,
	isDownXSS		: PropTypes.bool,
	isDownXS		: PropTypes.bool,
	isDownLG		: PropTypes.bool,
	isLandscape	: PropTypes.bool,
};

export default CharacterNameComponent;