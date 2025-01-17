import { makeStyles } from '@material-ui/core/styles';

const frameWidthLG = 500, frameWidth = 430, frameWidthTablet = 400, frameWidthMobile = 300; // 480 300;
const coordinateTextSize = 70, layout4CoordinateTextSize = 50, staticTextSize = 250, subtitleFontSize = 20, layout2FrameBorder = 10; 

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
	posterframe: {
		top: 0,
		left: 0,
		width: '100%',
		border: '2px solid transparent',
		height: '100%',
		zIndex: '20',
		position: 'absolute',
		transition: 'all .2s ease',
		pointerEvents: 'none',
		borderColor: '#ffffff' ,
	},
	layout_1_posterframe: {
		border: `${layout2FrameBorder}px solid #fff` ,
		[theme.breakpoints.down('lg')]: {
			border: `${calculateReducedSize(frameWidth, layout2FrameBorder)}px solid #fff` ,
		},
		[theme.breakpoints.down('xs')]: {
			border: `${calculateReducedSize(frameWidthTablet, layout2FrameBorder)}px solid #fff` ,
		},
		'@media (max-width: 430px)': {
			border: `${calculateReducedSize(frameWidthMobile, layout2FrameBorder)}px solid #fff` ,
		},
	},
	layout_2_posterframe: {
		// borderStyle: 'single',
		// borderWidth: 3,
		// borderColor: '#ffffff',
		top: '1.5%' ,
		left: '2%' ,
		height: 'calc(100% - 3%)' ,
		width: 'calc(100% - 4%)' ,
	},
	layout_4_posterframe: {
		top: '1.5%' ,
		left: '2%' ,
		height: 'calc(100% - 3%)' ,
		width: 'calc(100% - 4%)' ,
	},
	layout_3_posterframe: {
		border: `${layout2FrameBorder}px solid #fff` ,
		[theme.breakpoints.down('lg')]: {
			border: `${calculateReducedSize(frameWidth, layout2FrameBorder)}px solid #fff` ,
		},
		[theme.breakpoints.down('xs')]: {
			border: `${calculateReducedSize(frameWidthTablet, layout2FrameBorder)}px solid #fff` ,
		},
		'@media (max-width: 430px)': {
			border: `${calculateReducedSize(frameWidthMobile, layout2FrameBorder)}px solid #fff` ,
		},
	},
	posterframeDouble: {
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		zIndex: '20',
		position: 'absolute',
		transition: 'all .2s ease',
		pointerEvents: 'none',
	},
	layout_2_posterframeDouble: {
		top: '2.2%' ,
		left: '3%' ,
		height: 'calc(100% - 4.4%)' ,
		width: 'calc(100% - 6%)' ,
		border: '2px solid transparent',
		borderColor: '#ffffff' ,
	},
	layout_4_posterframeDouble: {
		top: '2.2%' ,
		left: '3%' ,
		height: 'calc(100% - 4.4%)' ,
		width: 'calc(100% - 6%)' ,
		border: '2px solid transparent',
		borderColor: '#ffffff' ,
	},
	posterPreviewColumn: {
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
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing(2),
		backgroundColor: '#000',
		margin: '0 auto',
		textAlign: 'center',
		color: '#fff',
		transition: 'all 0.5s ease',
		position: 'relative',
		borderRadius: 0,
	},
	infoTitles: {
		width: '100%',
		paddingLeft: '2%',
		paddingRight: '2%',

	},
	coordinateContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	coordinateContainerLayout1: {
		padding: '10% 0',
		margin: '10% 0',
		position: 'relative',
		textAlign: 'left',
	},
	coordinateContent: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	coordinateContentLayout4: {
		flexDirection: 'column',
		alignItems: 'start',
	},
	coordinateText: {
		fontSize: coordinateTextSize,
		fontWeight: 'bold',
		[theme.breakpoints.down('lg')]: {
			fontSize: calculateReducedSize(frameWidth, coordinateTextSize),
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: calculateReducedSize(frameWidthTablet, coordinateTextSize),
		},
		'@media (max-width: 430px)': {
			fontSize: calculateReducedSize(frameWidthMobile, coordinateTextSize),
		},
	},
	coordinateTextLayout4: {
		fontSize: layout4CoordinateTextSize,
		fontWeight: 'bold',
		fontFamily: 'open sans',
		[theme.breakpoints.down('lg')]: {
			fontSize: calculateReducedSize(frameWidth, layout4CoordinateTextSize),
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: calculateReducedSize(frameWidthTablet, layout4CoordinateTextSize),
		},
		'@media (max-width: 430px)': {
			fontSize: calculateReducedSize(frameWidthMobile, layout4CoordinateTextSize),
		},
	},
	title :{
		// fontSize: '3vw',
	},
	subtitleFirst: {
		minHeight: 30,
		fontSize: subtitleFontSize,
		textTransform: 'uppercase',
		fontFamily: 'open sans',
		fontWeight: 'bold',
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
	size_30_40: {
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
		height: 382,
	},
	bottomSkeleton: {
		marginTop: theme.spacing(2),
		width: '100%',
		height: 95,
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
	placeLetter: {
		display: 'block',
		fontFamily: 'open sans bolder',
		lineHeight: 1 ,
		// fontWeight: 900,
		fontWeight: 'bold',
		padding: '10% 0',
		margin: '10% 0',
		position: 'relative',
		fontSize: staticTextSize,
		transition: 'all .2s ease',
		[theme.breakpoints.down('lg')]: {
			fontSize: calculateReducedSize(frameWidth, staticTextSize),
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: calculateReducedSize(frameWidthTablet, staticTextSize),
		},
		'@media (max-width: 430px)': {
			fontSize: calculateReducedSize(frameWidthMobile, staticTextSize),
		},

		/* '&:before': {
			content: "''",
			height: '1px',
			width: '13%',
			position: 'absolute',
			left: '50%',
			top: '0',
			background: '#ffffff',
			transform: 'translate(-50%,-0%)',
		},

		'&:after': {
			content: "''",
			height: '1px',
			width: '13%',
			position: 'absolute',
			left: '50%',
			bottom: '0',
			background: '#ffffff',
			transform: 'translate(-50%,-0%)',
		}, */
	},
	dividerStyle: {
		textAlign: 'center',
	},
	topDivider: {
		width: '100%'
	},
	bottomDivider: {
		width: '100%'
	},
	layout_1_topDivider: {
		width: '100%',
	},
	topDividerOne: {
		width: '13%',
		position: 'absolute',
		left: '50%',
		top: 0,
		transform: 'translate(-50%,-0%)',
	},
	wrapLayoutTwo: {
		width: '100%',
	},
	layout2infoTitles: {
		position: 'relative',
	},
	bottomDividerOne: {
		width: '13%',
		position: 'absolute',
		left: '50%',
		bottom: 0,
		transform: 'translate(-50%,-0%)',
	},
	wrapLayoutThree: {
		width: '100%',
	},
	layout3InfoWrap: {
		position: 'relative',
		padding: '10% 0',
		marginBottom: '10%',
	},
	topDividerOneMedium: {
		width: '20%',
	},
	bottomDividerOneMedium: {
		width: '20%',
	},
	titleLayout1: {
		fontWeight: 'bold',
	},
	titleLayout2: {
		fontFamily: 'Montserrat',
		fontWeight: 300,
	},
	titleLayout3: {
		fontFamily: 'Montserrat',
		fontWeight: 300,
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
			width: theme.spacing(7),
		},
	},
	subtitleFirstLayout2: {
		textTransform: 'uppercase',
		fontFamily: 'Montserrat',
		fontWeight: '300',
	},
	subtitleFirstLayout3: {
		textTransform: 'uppercase',
		fontFamily: 'Montserrat',
		fontWeight: '300',
	},
	sectionDivider: {
		marginTop: theme.spacing(4),
		[theme.breakpoints.down('xs')]: {
			marginTop: theme.spacing(1),
		},
	},
}));
