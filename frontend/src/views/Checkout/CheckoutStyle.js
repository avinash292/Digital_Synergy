import { makeStyles } from '@material-ui/core/styles';


export default makeStyles(theme => ({
  root: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme.palette.background.default,
	},
	pageTitle: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing(3),
		paddingBottom: 0,
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
			paddingBottom: 0,
		},
	},
	spacer: {
		width: 170,
		[theme.breakpoints.down('sm')]: {
			width: 20,
		},
	},
	container: {
		width: '100%',
		minHeight: '100%',
		padding: theme.spacing(4, 6),
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
		},
	},
	skeletonLoader: {
		width: '100%',
		height: 250,
		borderRadius: theme.spacing(0.5),
	},
	content: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
		},
	},
	stepperContainer: {
		borderRadius: theme.spacing(0.5),
	},
	orderSummary: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2),
		display: 'flex',
		flexDirection: 'column',
	},
	orderSummaryTitle: {
		textAlign: 'center',
		paddingBottom: theme.spacing(1),
	},
	item: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing(1),
	},
	priceContent: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing(1),
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
	}
}));
