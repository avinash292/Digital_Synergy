import { makeStyles } from '@material-ui/core/styles';

const frameWidthLG = 500, frameWidth = 430, frameWidthTablet = 400, frameWidthMobile = 300; // 480 300;
const posterBannerWidth = 220, posterBannerWidthLandscape = 170, charMinWidth = 36; 

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
	editingOptionsColumn: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%',
		maxWidth: 500,
	},
	guideBtn: {
		marginBottom: theme.spacing(2),
	},
	posterPreviewColumn: {
		borderLeft:'1px solid #ddd',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',			
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			borderLeft: 'unset',
		},
	},
	posterPreviewContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing(2),
		backgroundColor: '#ffffff',
		margin: '0 auto',
		textAlign: 'center',
		color: '#000000',
		transition: 'all 0.5s ease',
		position: 'relative',
		borderRadius: 0,
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
	size_40_30: {
		width: frameWidthLG,
		height: (3 / 4) * frameWidthLG,
		[theme.breakpoints.down('lg')]: {
			width: frameWidth,
			height: (3 / 4) * frameWidth,
		},
		[theme.breakpoints.down('xs')]: {
			width: frameWidthTablet,
			height: (3 / 4) * frameWidthTablet,
		},
		'@media (max-width: 430px)': {
			width: frameWidthMobile,
			height: (3 / 4) * frameWidthMobile,
		},
	},
	size_70_50: {
		width: frameWidthLG,
		height: (5 / 7) * frameWidthLG,
		[theme.breakpoints.down('lg')]: {
			width: frameWidth,
			height: (5 / 7) * frameWidth,
		},
		[theme.breakpoints.down('xs')]: {
			width: frameWidthTablet,
			height: (5 / 7) * frameWidthTablet,
		},
		'@media (max-width: 430px)': {
			width: frameWidthMobile,
			height: (5 / 7) * frameWidthMobile,
		},
	},
	size_100_70: {
		width: frameWidthLG,
		height: (7 / 10) * frameWidthLG,
		[theme.breakpoints.down('lg')]: {
			width: frameWidth,
			height: (7 / 10) * frameWidth,
		},
		[theme.breakpoints.down('xs')]: {
			width: frameWidthTablet,
			height: (7 / 10) * frameWidthTablet,
		},
		'@media (max-width: 430px)': {
			width: frameWidthMobile,
			height: (7 / 10) * frameWidthMobile,
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
	memberContainer: {
		display: 'flex',
		flexDirection: 'row',
		maxWidth: '100%',
		position: 'absolute',
		top: '50%',
		left: '0',
		transform: 'translate(0,-50%)',
		width: '100%',
		maxHeight: '55%',
		padding: theme.spacing(0, 2),
		justifyContent: 'center',
	},
	memberCharacter: {
		height: 300,
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
	posterTopBanner: {
		width: posterBannerWidth,
		marginBottom: theme.spacing(2),
		position: 'absolute',
		top: '10%',
		[theme.breakpoints.down('lg')]: {
			width: calculateReducedSize(frameWidth, posterBannerWidth),
		},
		[theme.breakpoints.down('xs')]: {
			width: calculateReducedSize(frameWidthTablet, posterBannerWidth),
		},
		'@media (max-width: 430px)': {
			width: calculateReducedSize(frameWidthMobile, posterBannerWidth),
		},
	},
	landscape_posterTopBanner: {
		width: posterBannerWidthLandscape,
		[theme.breakpoints.down('lg')]: {
			width: calculateReducedSize(frameWidth, posterBannerWidthLandscape),
		},
		[theme.breakpoints.down('xs')]: {
			width: calculateReducedSize(frameWidthTablet, posterBannerWidthLandscape),
		},
		'@media (max-width: 430px)': {
			width: calculateReducedSize(frameWidthMobile, posterBannerWidthLandscape),
		},
	},
	charColLayout: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-end',
		position: 'relative',
		minWidth: charMinWidth,
		[theme.breakpoints.down('lg')]: {
			minWidth: calculateReducedSize(frameWidth, charMinWidth),
		},
		[theme.breakpoints.down('xs')]: {
			minWidth: calculateReducedSize(frameWidthTablet, charMinWidth),
		},
		'@media (max-width: 430px)': {
			minWidth: calculateReducedSize(frameWidthMobile, charMinWidth),
		},
	},
	petColLayout: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column' ,
		position: 'relative' ,
		justifyContent: 'flex-end',
		minWidth: charMinWidth,
		[theme.breakpoints.down('lg')]: {
			minWidth: calculateReducedSize(frameWidth, charMinWidth),
		},
		[theme.breakpoints.down('xs')]: {
			minWidth: calculateReducedSize(frameWidthTablet, charMinWidth),
		},
		'@media (max-width: 430px)': {
			minWidth: calculateReducedSize(frameWidthMobile, charMinWidth),
		},
	},
	sectionDivider: {
		marginTop: theme.spacing(4),
		[theme.breakpoints.down('md')]: {
			marginTop:0,
		},
	},
	familyQuote: {
		position: 'absolute',
		bottom: '10%',
		margin: '20px auto 0',
		display: 'table',
		padding: theme.spacing(0, 4),
		fontSize: 26,
		fontFamily: 'Great Vibes',
	},
	charNameLayout1: {
		bottom: '-60px' ,
		left: 0,
		right: 0,
	},
	charNameLayout2: {
		// padding: theme.spacing(0, 1),
		left: 0,
		top: '-5%',
		[theme.breakpoints.down('sm')]: {
			top: 0,
		},
	},
	topCharacterName:{
		alignSelf: 'center',
		/*whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',*/
		overflow: 'hidden',
		width: '100%',
		padding: theme.spacing(0, 1),
		position: 'absolute',
		left: 0,
		top: '-5%',
		fontFamily: 'Roboto',
		[theme.breakpoints.down('sm')]: {
			top: 0,
		},
	},
}));
