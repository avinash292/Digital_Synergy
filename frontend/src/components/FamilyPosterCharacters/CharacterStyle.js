import { makeStyles } from '@material-ui/core/styles';

// const frameWidthLG = 500, frameWidth = 430, frameWidthTablet = 400, frameWidthMobile = 300; // 480 300;
// const coordinateTextSize = 70, layout4CoordinateTextSize = 50, staticTextSize = 250, subtitleFontSize = 20, layout2FrameBorder = 10; 

/* const calculateReducedSize = (currentWidth, size) => {
	return (currentWidth / frameWidthLG) * size;
}; */

export default makeStyles(theme => ({
  root: {
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		// padding: theme.spacing(2),
		backgroundColor: theme.palette.background.default,
	},
}));
