import { makeStyles } from '@material-ui/core/styles';

const frameWidth = 450;
const frameWidthXS = 300;

export default makeStyles(theme => ({
	posterPreviewContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		// alignItems: 'center',
		padding: theme.spacing(2),
		border: '1px solid #fff',
		backgroundColor: '#000',
		margin: '0 auto',
		textAlign: 'center',
		color: '#fff',
		transition: 'all 0.5s ease',
		position: 'relative',
		// boxShadow: '0 0 0 10px #000',
	},
	posterPreviewColumn: {
		borderLeft:'1px solid #ddd',
		[theme.breakpoints.down('sm')]: {
			borderLeft: 'unset',
		},
	},
	infoTitles: {
		position: 'absolute',
		left: '0',
		top: '3%',
		width: '100%',
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	},
	choosenShape: {
		overflow: 'hidden',
		position: 'absolute',
		left: '50%',
		top: '50%',
		width: '70%',
		transform: 'translate(-50%,-50%)',
	},
	dynamicShape: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		zIndex:1,
		[theme.breakpoints.down('xs')]: {
			left: '50%',
			width: '210px',
			height: '210px',
			position: 'absolute',
			transform: 'translate(-50%,0)',
		},
	},
	title :{
		// fontSize: '3vw',
	},
	subtitlefirst: {
		minHeight: 30,
		fontSize: '1rem'
	},
	infobox: {
		width: '100%',
		position: 'absolute',
		bottom: '3%',
		left: '0',
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	},
	size_30_40: {
		// maxWidth: 400,
		width: frameWidth,
		height: (4 / 3) * frameWidth,
		[theme.breakpoints.down('xs')]: {
			width: frameWidthXS,
			height: (4 / 3) * frameWidthXS,
		},
	},
	size_50_70: {
		// maxWidth: 415,
		width: frameWidth,
		height: (7 / 5) * frameWidth,
		[theme.breakpoints.down('xs')]: {
			width: frameWidthXS,
			height: (7 / 5) * frameWidthXS,
		},
	},
	size_70_100: {
		// maxWidth: 430,
		width: frameWidth,
		height: (10 / 7) * frameWidth,
		[theme.breakpoints.down('xs')]: {
			width: frameWidthXS,
			height: (10 / 7) * frameWidthXS,
		},
	},
}));
