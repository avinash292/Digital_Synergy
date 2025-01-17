import { makeStyles } from '@material-ui/core/styles';

const frameWidthLG = 500, frameWidth = 430, frameWidthTablet = 390, frameWidthMobile = 280; // 480 300;
const subtitleFontSize = 14, cordinatesFontSize = 13, messageFontSize = 13;

const calculateReducedSize = (currentWidth, size) => {
	return (currentWidth / frameWidthLG) * size;
};

export default makeStyles(theme => ({
  root: {
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		minHeight: 'calc(100vh - 184px)',
		// padding: theme.spacing(2),
		backgroundColor: theme.palette.background.default,
	},
	content: {
		width: '100%',
		minHeight: '100%',
		padding: theme.spacing(4, 0),
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(4, 0, 0 , 0),
		},
	},
	container : {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column-reverse',
			height: '100%',
		},
	},
	sectionNoPaddingTop: {
		paddingTop: 0,
	},
	shape: {
		background: theme.palette.alternate.main,
		borderBottomRightRadius: '50%',
	},
	editingOptionsColumn: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%',
		maxWidth: 500,
		[theme.breakpoints.down('md')]: {
			maxWidth: theme.spacing(55),
		}
	},
	guideBtn: {
		marginBottom: theme.spacing(2),
	},
	posterPreviewGrid: {
		borderLeft:'1px solid #ddd',
		display: 'flex',
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			borderLeft: 'unset',
			flexDirection: 'column',
			alignItems: 'center',
		},
	},
	posterPreviewContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		// alignItems: 'center',
		//padding: theme.spacing(2),
		border: '1px solid #fff',
		backgroundColor: '#fff',
		margin: '0 auto',
		textAlign: 'center',
		color: theme.palette.text.primary,
		transition: 'all 0.5s ease',
		position: 'relative',
		borderRadius: 0,
		// boxShadow: '0 0 0 10px #000',
		overflow: 'hidden',
	},
	infotitles: {
		position: 'absolute',
		left: 0,
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
		width: '75%',
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
			width: 210,
			height: 210,
			position: 'absolute',
			transform: 'translate(-50%,0)',
		},
	},
	title :{
		// fontSize: '3vw',
	},
	subtitleFirst: {
		fontSize: subtitleFontSize,
		lineHeight: 'normal',
		margin: '1.5% 0',
		padding: theme.spacing(0, 1),
		maxWidth: '100%',
		wordBreak: 'break-all',
		[theme.breakpoints.down('lg')]: {
			fontSize: calculateReducedSize(frameWidth, subtitleFontSize),
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: calculateReducedSize(frameWidthTablet, subtitleFontSize),
		},
		'@media (max-width: 430px)': {
			fontSize: calculateReducedSize(frameWidthMobile, subtitleFontSize),
		},
	},
	cortext: {
		wordBreak: 'break-all',
		fontSize: cordinatesFontSize,
		[theme.breakpoints.down('lg')]: {
			fontSize: calculateReducedSize(frameWidth, cordinatesFontSize),
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: calculateReducedSize(frameWidthTablet, cordinatesFontSize),
		},
		'@media (max-width: 430px)': {
			fontSize: calculateReducedSize(frameWidthMobile, cordinatesFontSize),
		},
	},
	message: {
		fontSize: messageFontSize,
		[theme.breakpoints.down('lg')]: {
			fontSize: calculateReducedSize(frameWidth, messageFontSize),
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: calculateReducedSize(frameWidthTablet, messageFontSize),
		},
		'@media (max-width: 430px)': {
			fontSize: calculateReducedSize(frameWidthMobile, messageFontSize),
		},
	},
	subtitleSecond: {
		padding: theme.spacing(0, 1),
		wordBreak: 'break-all',
		fontWeight: 'bold',
		lineHeight: 'normal',
	},
	infobox: {
		width: '100%',
		position: 'absolute',
		bottom: 0,
		left: 0,
		zIndex: 12,
		paddingLeft: '10px',
		paddingRight: '10px',
		paddingTop: theme.spacing(15),
		paddingBottom: theme.spacing(3),
		// background: '-webkit-gradient(linear,left top,left bottom,color-stop(0,rgba(255,255,255,0)),color-stop(50%,#fff),color-stop(0,#fff))',
		// background: '-webkit-linear-gradient(top,rgba(255,255,255,0) 0,#fff 50%,#fff 0)',
		// background: '-o-linear-gradient(top,rgba(255,255,255,0) 0,#fff 50%,#fff 0)',
		background: 'linear-gradient(180deg,rgba(255,255,255,0) 0,#fff 100%,#fff 0)',
		pointerEvents: 'none',
	},
	size_30_40: {
		// maxWidth: 400,
		width: frameWidthLG,
		height: (4 / 3) * frameWidthLG,
		[theme.breakpoints.down('lg')]: {
			width: frameWidth,
			height: (4 / 3) * frameWidth,
		},
		[theme.breakpoints.down('xs')]: {
			width: frameWidthTablet,
			height: (4 / 3) * frameWidthTablet,
		},
		'@media (max-width: 430px)': {
			width: frameWidthMobile,
			height: (4 / 3) * frameWidthMobile,
		},
	},
	size_50_70: {
		// maxWidth: 415,
		width: frameWidthLG,
		height: (7 / 5) * frameWidthLG,
		[theme.breakpoints.down('lg')]: {
			width: frameWidth,
			height: (7 / 5) * frameWidth,
		},
		[theme.breakpoints.down('xs')]: {
			width: frameWidthTablet,
			height: (7 / 5) * frameWidthTablet,
		},
		'@media (max-width: 430px)': {
			width: frameWidthMobile,
			height: (7 / 5) * frameWidthMobile,
		},
	},
	size_70_100: {
		// maxWidth: 430,
		width: frameWidthLG,
		height: (10 / 7) * frameWidthLG,
		[theme.breakpoints.down('lg')]: {
			width: frameWidth,
			height: (10 / 7) * frameWidth,
		},
		[theme.breakpoints.down('xs')]: {
			width: frameWidthTablet,
			height: (10 / 7) * frameWidthTablet,
		},
		'@media (max-width: 430px)': {
			width: frameWidthMobile,
			height: (10 / 7) * frameWidthMobile,
		},
	},
	skeletonConatiner: {
		width: '100%',
		padding: theme.spacing(0, 3),
	},
	topSkeleton: {
		width: '100%',
		height: 150,
	},
	bottomSkeleton: {
		marginTop: theme.spacing(2),
		width: '100%',
		height: 195,
	},
	addToCartContainer: {
		padding: theme.spacing(2),
		position: 'fixed',
		left: 0,
		bottom: 0,
		zIndex: 50,
		width: '100%',
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
		[theme.breakpoints.up('md')]: {
			padding: theme.spacing(3),
			width: '100%',
			borderRadius: 0,
			zIndex: 'unset',
			position: 'unset',
		},
		[theme.breakpoints.down('md')]: {
			position: 'unset',
		},
	},
	addToCartBtn: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cartLogo: {
		margin: theme.spacing(1),
	},
	cityMapContainer: {
		position: 'absolute',
		top: '1.5%',
		right: 0,
		left: '2%',
		bottom: 0,
		height: 'calc(100% - 3%)' ,
		width: 'calc(100% - 4%)' ,
		// width: '100%',
	},
	layout_1_cityMapContainer: {
		height: 'calc(100% - 3%)' ,
		width: 'calc(100% - 4%)' ,
	},
	layout_2_cityMapContainer: {
		height: 'calc(100% - 3%)' ,
		width: 'calc(100% - 4%)' ,
	},
	posterframe: {
		position: 'absolute' ,
		height: '100%' ,
		width: '100%' ,
		left: '0' ,
		top: '0' ,
		transition: 'all .2s ease',
		zIndex: '20',
		pointerEvents: 'none',
		border: '1px solid transparent',
		boxShadow: '0 0 0 20px #fff',
	},
	layout_2_frame: {
		borderColor: '#000',
		height: 'calc(100% - 3%)' ,
		width: 'calc(100% - 4%)' ,
		left: '2%' ,
		top: '1.5%' ,
	},
	layout_1_infobox: {
		paddingTop: theme.spacing(2),
		paddingBottom: '4%',
		background: '#fff',
		display: 'flex',
		// flexWrap: 'wrap',
		alignItems: 'center',
		bottom: '8px',
		[theme.breakpoints.down('xs')]: {
			bottom: '0',
		},
	},
	layout_2_infobox: {
		paddingBottom: '7%',
		paddingTop: theme.spacing(8),
		background: 'linear-gradient(180deg,rgba(255,255,255,0) 0,#fff 100%,#fff 0)',
	},
	layout_3_infobox: {
		width: 'auto',
		left: '50%' ,
		transform: 'translate(-50%,0)' ,
		background: '#fff' ,
		paddingLeft: theme.spacing(3) ,
		paddingRight: theme.spacing(3) ,
		paddingTop: theme.spacing(1) ,
		paddingBottom: theme.spacing(1) ,
		bottom: '6%',
		border: '1px solid #000000' ,
	},
	layout_4_infobox: {
		display: 'none',
	},
	layout_3_subtitlesecond: {
		lineHeight: 'normal',
	},
	layout_2_subtitleFirst: {
		display: 'table',
		position: 'relative',
		margin: '1.5% auto',
		'&:before': {
			content: "''",
			backgroundColor: '#263238' ,
			position: 'absolute' ,
			width: '35px' ,
			height: '2px' ,
			top: '50%' ,
			transform: 'translateY(-50%)' ,
			left: '-45px',
		},
		'&:after': {
			content: "''",
			backgroundColor: '#263238' ,
			position: 'absolute' ,
			width: '35px' ,
			height: '2px' ,
			top: '50%' ,
			transform: 'translateY(-50%)' ,
			right: '-45px',
		},
	},
	iconwrap: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
	},
	markerIcon: {
		display: 'none',
		position: 'absolute',
	},
	activeIcon: {
		display: 'block !important',
	},
	svgshape: {
		maxHeight: '420px',
		maxWidth: '420px',
		position: 'absolute',
		left: '50%',
		top: '8%',
		pointerEvents: 'none',
		height: '100%',
		width: '80%',
		transform: 'translate(-50%,0)',
		'-o-transform': 'translate(-50%,0)',
		'-moz-transform': 'translate(-50%,0)',
		'-webkit-transform': 'translate(-50%,0)',
		zIndex: '234',
	},
	noShape: {		
	},
	maskLeft: {
		position: 'absolute',
		left: '0',
		top: '0',
		background: '#fff',
		height: '100%',
		width: '11%',
		zIndex: '12',
		[theme.breakpoints.down('xs')]: {
			// width: '50px',
		},
		'@media (max-width: 430px)': {
			// width: '38px',
		},
	},
	maskRight: {
		position: 'absolute',
		right: '0',
		top: '0',
		background: '#fff',
		height: '100%',
		width: '11%',
		zIndex: '12',
		[theme.breakpoints.down('xs')]: {
			// width: '50px',
		},
		'@media (max-width: 430px)': {
			// width: '38px',
		},
	},
	maskTop: {
		position: 'absolute',
		right: 0,
		top: 0,
		background: '#fff',
		width: '100%',
		zIndex: 12,
		height: '8.5%',

		// [theme.breakpoints.up('xl')]: {
		// 	height: 'calc(100% - 624px)',
		// },
		// [theme.breakpoints.down('xs')]: {
		// 	height: 'calc(100% - 477px)',
		// },
		// '@media (max-width: 430px)': {
		// 	height: 'calc(100% - 331px)',
		// },
	},
	maskTop_30_40: {

	},
	// maskTop_50_70: {
	// 	[theme.breakpoints.up('lg')]: {
	// 		height: 'calc(100% - 560px)',
	// 	},
	// 	[theme.breakpoints.up('xl')]: {
	// 		height: 'calc(100% - 655px)',
	// 	},
	// 	[theme.breakpoints.down('md')]: {
	// 		height: 'calc(100% - 560px)',
	// 	},
		
	// 	[theme.breakpoints.down('xs')]: {
	// 		height: 'calc(100% - 504px)',
	// 	},
	// 	'@media (max-width: 430px)': {
	// 		height: 'calc(100% - 350px)',
	// 	},
	// },
	// maskTop_70_100: {
	// 	[theme.breakpoints.up('lg')]: {
	// 		height: 'calc(100% - 570px)',
	// 	},
	// 	[theme.breakpoints.up('xl')]: {
	// 		height: 'calc(100% - 667px)',
	// 	},
	// 	[theme.breakpoints.down('md')]: {
	// 		height: 'calc(100% - 570px)',
	// 	},
	// 	[theme.breakpoints.down('xs')]: {
	// 		height: 'calc(100% - 512px)',
	// 	},

	// 	'@media (max-width: 430px)': {
	// 		height: 'calc(100% - 355px)',
	// 	},
	// },
	maskBottom: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		background: '#fff',
		height: 'calc(100% - 451px)',
		width: '100%',
		zIndex: 12,
		[theme.breakpoints.down('lg')]: {
			height: 'calc(100% - 387px)',
		},
		[theme.breakpoints.down('xs')]: {
			height: 'calc(100% - 351px)',
		},
		'@media (max-width: 430px)': {
			height: 'calc(100% - 251px)',
		},
	},
	textWrapLeft: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		[theme.breakpoints.down('xs')]: {
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1),
			fontSize: '12px',
		},
		// borderRight: '1px solid #e3e3e3',
		wordBreak: 'break-word',
	},
	textWrapRight: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		overflow: 'hidden',
	},
	rightBorder: {
		borderLeft: '1px solid #e3e3e3',
	},
	mapboxLogo: {
		width: theme.spacing(8),
	},
	copyRightContainer: {
		display: 'flex',
		position: 'absolute',
		right: '-150px',
		transform: 'rotate(90deg)',
		top: '270px',
		opacity: '.4',
	},
	toggleBtns: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',	
		padding: theme.spacing(2, 1, 0, 1),
		position: 'relative',
		width: '100%',
	},
	guideIcon: {
		position: 'absolute',
		right: 10,
		top: 10,
	},
	infoIcon: {
		paddingRight: theme.spacing(0.5),
	},
	emptySpacer: {
		width: theme.spacing(10),
		[theme.breakpoints.down('xs')]: {
			width: theme.spacing(6),
		},
	},
	sectionDivider: {
		marginTop: theme.spacing(4),
		[theme.breakpoints.down('xs')]: {
			marginTop: theme.spacing(1),
		},
	},
}));
