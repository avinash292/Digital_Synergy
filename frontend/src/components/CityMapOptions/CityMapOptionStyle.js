import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	root: {
	},
	header: {
		paddingTop: theme.spacing(1),
	},
	heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: 'bold',
  },
	gridItem: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer',
	},
	badgeIcon: {
		backgroundColor: theme.palette.success.main,
		color: '#fff',
		borderRadius: 50,
		padding: 0
	},
	designAccordion: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	colorsContainer: {
		[theme.breakpoints.down('sm')]: {
			maxHeight: '200px',
			overflowY: 'auto',
			alignItems: 'start',
		},
	},
	optionsTab: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	switchControlLabel: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginRight: 0,
	},
	gridElement: {
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer',
		border: '1px solid gray',
		// margin: theme.spacing(1),
		borderRadius: theme.spacing(0.5),
		height: '100%',
		padding: theme.spacing(2),
	},
	elementImage: {
		height: theme.spacing(10),
		width: theme.spacing(10),
	},
	autocompleteStyle: {
		border: '1px solid rgba(0, 0, 0, 0.23)',
		padding: '12px 10px',
		borderRadius: '5px',
		outline: 'none',
		width: '100%',
	},
	locationwrap: {
		position: 'relative',
		marginBottom: theme.spacing(2),
	},
	locationtitle: {
		fontSize: '12px',
		position: 'absolute',
		left: theme.spacing(1),
		background: theme.palette.background.paper,
		top: theme.spacing(-1),
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
		color: theme.palette.text.secondary,
	},
	colorView: {
		width: theme.spacing(6),
		height: theme.spacing(6),
		backgroundColor: 'gray',
		borderRadius: 30,
	},
	colorImg: {
		borderRadius: theme.spacing(5),
		height: theme.spacing(8),
		border: '3px solid rgba(0, 0, 0, 0.23)',
		[theme.breakpoints.down('xs')]: {
			height: theme.spacing(5),
			borderWidth: '1px',
		},
	},
	iconPanelAccordion: {
		flexDirection: 'column',
		width: '100%',
	},
	activeItem: {
		border: '1px solid gray',
	},
	sliderContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingLeft: theme.spacing(2)
	},
	removeBtn: {
		backgroundColor: theme.palette.white,
		borderRadius: '100%',
		// marginLeft: theme.spacing(1),
	},
	colorName: {
		textAlign: 'center',
		[theme.breakpoints.down('xs')]: {
			fontSize: 12,
			marginTop: 5,
		},
	},
	tabBtns: {
		padding: theme.spacing(0, 1),
		minWidth: 0,
		[theme.breakpoints.down('xs')]: {
			fontSize: 12,
		},
	},
	tabHandle: {
		minWidth: 0,
		[theme.breakpoints.down('xs')]: {
			fontSize: 12,
		},
	},
	selecticonbtn: {
		padding: 7,
		marginTop: theme.spacing(1),
	},
	colorsConatinerwrap: {
		margin: 0,
	},
	shapeSize: {
		maxWidth: '60px !important',
	},
	containerGrid: {
		padding: theme.spacing(3, 1),
		width: '100%',
		margin: '0',
		[theme.breakpoints.down('sm')]: {
			flexWrap: 'nowrap',
			overflowX: 'auto',
		},
	},
	selectedMarkerContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.spacing(2),

	},
	removeContainer: {
		position: 'absolute',
		top: theme.spacing(-2),
		right: theme.spacing(-2),
	},
	markerContainer: {
		position: 'relative',
		marginBottom: theme.spacing(2),
		[theme.breakpoints.down('sm')]: {
			margin: '20px auto',
			width: 'calc(100% - 50px)',
		},
	},
	iconRangeWidth: {
		width: 'calc(100% - 80px)',
	},
}));