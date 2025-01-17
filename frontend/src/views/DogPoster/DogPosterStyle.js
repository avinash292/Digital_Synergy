import { makeStyles } from '@material-ui/core/styles';

const frameWidth = 480;
const frameWidthXS = 300;

export default makeStyles(theme => ({
  root: {
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		// padding: theme.spacing(2),
		backgroundColor: theme.palette.background.default,
	},
	content: {
		width: '100%',
		minHeight: '100%',
		padding: theme.spacing(4),
		/* [theme.breakpoints.down('md')]: {
			flexDirection: 'column',
		}, */
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
	},
	guideBtn: {
		marginBottom: theme.spacing(2),
	},
	posterframe: {
		position: 'absolute' ,
		height: 'calc(100% - 20px)' ,
		width: 'calc(100% - 20px)' ,
		left: '10px' ,
		top: '10px' ,
		// border: '1px solid #fff' ,
	},
	posterPreviewColumn: {
		borderLeft:'1px solid #ddd',
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
		backgroundColor: '#000',
		margin: '0 auto',
		textAlign: 'center',
		color: '#fff',
		transition: 'all 0.5s ease',
		position: 'relative',
		// boxShadow: '0 0 0 10px #000',
		borderRadius: 0,
	},
	infoTitles: {
		position: 'absolute',
		left: '0',
		bottom: '3%',
		width: '100%',
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	},
	coordinateContainer: {
		display: 'flex',
		flexDirection: 'column',
	},
	coordinateContent: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	coordinateText: {
		fontSize: '3.5rem',
		fontWeight: 'bold',
		[theme.breakpoints.down('xs')]: {
			fontSize: '2.1875rem',
		},
		// width: '100%',
		// position: 'absolute',
		// bottom: '3%',
		// left: '0',
		// paddingLeft: theme.spacing(1),
		// paddingRight: theme.spacing(1),
	},
	title :{
		// fontSize: '3vw',
	},
	subtitlefirst: {
		minHeight: 30,
		fontSize: '1rem'
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
	},
	addToCartBtn: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cartLogo: {
		margin: theme.spacing(1),
	}
}));
