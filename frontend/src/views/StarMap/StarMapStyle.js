import { makeStyles } from '@material-ui/core/styles';

const frameWidthLG = 500, frameWidth = 430, frameWidthTablet = 400, frameWidthMobile = 300; // 480 300;
const cityTextSize = 24, dateTextSize = 16, dirTextSize = 15, layout2FrameBorder = 10, messageFontSize = 15, layoutPosterFrameBorder = 2.5;

const calculateReducedSize = (currentWidth, size) => {
	return (currentWidth / frameWidthLG) * size;
};
export default makeStyles(theme => ({
  root: {
		height: '100%',
		width: '100%',
		minHeight: 'calc(100vh - 184px)',
		display: 'flex',
		justifyContent: 'center',
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
	posterPreviewContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		backgroundColor: '#000',
		margin: '0 auto',
		textAlign: 'center',
		color: '#fff',
		transition: 'all 0.5s ease',
		position: 'relative',
		borderRadius: 0,
		overflow: 'hidden',
		'&:before': {
			content: "''",
			height: '100%',
			width: '100%',
			position: 'absolute',
			left: '0',
			zIndex: '2'
		},
	},
	posterframe: {
		top: 0,
		left: 0,
		width: '100%',
		// border: '2px solid transparent',
		height: '100%',
		zIndex: '20',
		position: 'absolute',
		transition: 'all .2s ease',
		pointerEvents: 'none',
		border: `${layoutPosterFrameBorder}px solid #ffffff` ,
		[theme.breakpoints.down('lg')]: {
			border: `${calculateReducedSize(frameWidth, layoutPosterFrameBorder)}px solid #ffffff` ,
		},
		[theme.breakpoints.down('xs')]: {
			border: `${calculateReducedSize(frameWidthTablet, layoutPosterFrameBorder)}px solid #ffffff` ,
		},
		'@media (max-width: 430px)': {
			border: `${calculateReducedSize(frameWidthMobile, layoutPosterFrameBorder)}px solid #ffffff` ,
		},
	},
	posterPreviewColumn: {
		borderLeft:'1px solid #ddd',
		display: 'flex',
		justifyContent: 'center',
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			borderLeft: 'unset',
			flexDirection: 'column',
			alignItems: 'center',
		},
	},
	infoTitles: {
		position: 'absolute',
		left: 0,
		top: '5%',
		width: '100%',
		paddingLeft: '5%' ,
		paddingRight: '5%' ,
		transition: 'all .2s ease',
	},
	choosenShape: {
		overflow: 'hidden',
		position: 'absolute',
		left: 0,
		top: 0,
		width: '75%',
	},
	dynamicShape: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		zIndex: 123,
		pointerEvents: 'none',
		/* [theme.breakpoints.down('xs')]: {
			left: '50%',
			width: 190,
			height: 190,
			position: 'absolute',
			transform: 'translate(-50%,0)',
		}, */
	},
	maintitle :{
		fontFamily: 'open sans bolder',
		fontWeight: 'bold',
	},
	cityText: {
		fontFamily: 'open sans bolder',
		fontWeight: 'bold',
		textTransform: 'uppercase',
		fontSize: cityTextSize,
		lineHeight: '1',
		[theme.breakpoints.down('lg')]: {
			fontSize: calculateReducedSize(frameWidth, cityTextSize),
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: calculateReducedSize(frameWidthTablet, cityTextSize),
		},
		'@media (max-width: 430px)': {
			fontSize: calculateReducedSize(frameWidthMobile, cityTextSize),
		},
	},
	dateText: {
		fontFamily: 'Open Sans',
		margin: '2% 0',
		fontSize: dateTextSize,
		[theme.breakpoints.down('lg')]: {
			fontSize: calculateReducedSize(frameWidth, dateTextSize),
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: calculateReducedSize(frameWidthTablet, dateTextSize),
		},
		'@media (max-width: 430px)': {
			fontSize: calculateReducedSize(frameWidthMobile, dateTextSize),
		},
	},
	dirText: {
		// fontFamily: 'Open Sans',
		fontFamily: 'Allura',
		fontSize: dirTextSize,
		lineHeight: 'normal',
		whiteSpace: 'nowrap',
		[theme.breakpoints.down('lg')]: {
			fontSize: calculateReducedSize(frameWidth, dirTextSize),
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: calculateReducedSize(frameWidthTablet, dirTextSize),
		},
		'@media (max-width: 430px)': {
			fontSize: calculateReducedSize(frameWidthMobile, dirTextSize),
		},
	},
	customMessage: {
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
	subtitleFirst: {
		minHeight: 30,
		fontSize: 24,
		fontFamily: 'Allura',
		lineHeight: '1.5',
		wordBreak: 'break-word',

		'@media (max-width: 767px)': {
			minHeight: 20,
		},
	},
	infobox: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		position: 'absolute',
		bottom: '5%',
		left: '0',
		paddingLeft: '2%',
		paddingRight: '2%',
		pointerEvents: 'none',
		zIndex: '12',
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
		height: 315,
	},
	bottomSkeleton: {
		marginTop: theme.spacing(2),
		width: '100%',
		height: 150,
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
	layout_1_title: {
		display: 'flex',
		'-o-display': 'flex',
		'-moz-display': 'flex',
		'-webkit-display': 'flex',
		flexDirection: 'column',
		'-o-flexDirection': 'column',
		'-moz-flexDirection': 'column',
		'-webkit-flexDirection': 'column',
		justifyContent: 'flex-end',
		'-o-justifyContent': 'flex-end',
		'-moz-justifyContent': 'flex-end',
		'-webkit-justifyContent': 'flex-end',

		[theme.breakpoints.down('xl')]: {
			minHeight: '75px',
		},
		[theme.breakpoints.up('xl')]: {
			minHeight: '90px',
		},
		'@media (max-width: 430px)': {
			minHeight: '55px',
		},
		
	},
	layout_1_frame: {
		top: '1.5%' ,
		left: '2%' ,
		width: 'calc(100% - 4%)' ,
		height: 'calc(100% - 3%)' ,
	},
	layout_1_choosenShape: {
		transform: 'translate(-50%,-50%)',
		// transition: 'all .2s ease',
		left: '50%',
		top: '50%',
	},
	layout_2_frame: {
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
	layout_2_choosenShape: {
		marginTop: '-10%',
		transform: 'translate(-50%,-50%)',
		// transition: 'all .2s ease',
		left: '50%',
		top: '50%',
	},
	layout_2_infobox: {
		bottom:'0',
		background: '#fff',
		color: '#000',
		padding: '3% 2%',
	},
	shapeMask: {
		background: '#000',
		height: '100%',
	},
	layout_3_shape: {
		top: '10%',
		transform: 'translate(-50%, 0)',		
	},
	layout_3_choosenShape: {
		marginTop: '-10%',
		transform: 'translate(-50%,-50%)',
		// transition: 'all .2s ease',
		left: '50%',
		top: '50%',
	},
	layout_3_cityText: {
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	},
	layout_3_frame: {
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
	layout_4_frame: {
		top: '1.5%' ,
		left: '2%' ,
		width: 'calc(100% - 4%)' ,
		height: 'calc(100% - 3%)' ,
	},
	layout_4_infobox: {
		width: 'auto' ,
		left: '50%' ,
		transform: 'translate(-50%,0)' ,
		background: '#fff' ,
		color: '#000' ,
		padding: '2% 3%',

	},
	layout_4_shape: {
		top: '10%',
		transform: 'translate(-50%, 0)',		
	},
	layout_4_choosenShape: {
		top: '1.5%' ,
		left: '2%' ,
		width: 'calc(100% - 4%)' ,
		height: 'calc(100% - 3%)' ,
		// transition: 'none',
	},
	horizontalInfo: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	layout_4_cityText: {
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	},
	layout_5_cityText: {
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	},
	textWrapLeft: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		transition: 'all .2s ease',
		overflow: 'hidden',
	},
	layout_2_textWrapLeft: {
		paddingLeft: '2%',
		paddingRight: '2%',
		borderRight: '1px solid #e3e3e3',
		textAlign: 'left',
	},
	textWrapRight: {		
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: '2%',
		paddingRight: '2%',
		[theme.breakpoints.down('xs')]: {
			fontSize: '12px',
		},
		wordBreak: 'break-word',
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
	sectionDivider: {
		marginTop: theme.spacing(4),
		[theme.breakpoints.down('xs')]: {
			marginTop: theme.spacing(1),
		},
	},
}));
