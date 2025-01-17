import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	root: {
		borderRadius: 0,
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
	activeItem: {
		// border: '1px solid gray',
		// backgroundColor: 'gray',
	},
	designAccordion: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	colorsConatiner: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		[theme.breakpoints.down('xs')]: {
			flexWrap: 'nowrap',
			overflowX: 'auto',
		},
	},
	containerGrid: {
		padding: theme.spacing(3),
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			flexWrap: 'nowrap',
			overflowX: 'auto',
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
	elementContainer: {
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		cursor: 'pointer',
		border: '1px solid gray',
		// margin: theme.spacing(1),
		borderRadius: theme.spacing(0.5),
		height: '100%',
		padding: theme.spacing(1),
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
		borderRadius: '50%',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		position: 'relative',
		overflow: 'hidden',
	},
	secondaryColorView: {
		width: '50%',
		height: '50%',
		backgroundColor: 'gray',
		borderRadius: 0,
		border: '1px solid rgba(0, 0, 0, 0.1)',
		position: 'absolute',
		top: theme.spacing(3),
    left: 0,
		overflow: 'hidden',
	},
	tertiaryColorView: {
		width: '50%',
		height: '50%',
		backgroundColor: 'gray',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		position: 'absolute',
		top: theme.spacing(3),
    right: 0,
		overflow: 'hidden',
	},
	activeBtn: {
		backgroundColor: theme.palette.colors.grey[300] + ' !important',
	},
	btnGrp: {
		marginTop: theme.spacing(2),
	},
	tabHandle: {
		minWidth: 0,
	},
	elementImg: {
		width: theme.spacing(7),
	}
}));