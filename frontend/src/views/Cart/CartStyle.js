import { makeStyles } from '@material-ui/core/styles';


export default makeStyles(theme => ({
  root: {
		minHeight: 'calc(100vh - 184px)',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme.palette.background.default,
	},
	section: {
		display: 'flex',
		flexDirection: 'column',
	},
	pageTitle: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing(2, 6),
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
		},
	},
	spacer: {
		width: 170,
		[theme.breakpoints.down('sm')]: {
			width: 20,
		},
	},
	content: {
		width: '100%',
		minHeight: '100%',
		padding: theme.spacing(4, 6),
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
		},
	},
	skeletonLoader: {
		width: '100%',
		height: 200,
		borderRadius: theme.spacing(0.5),
	},
	cartItem: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2),
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		[theme.breakpoints.down('xs')]: {
			flexDirection: 'column',
		},
	},
	itemImage: {
		width: theme.spacing(15),
		[theme.breakpoints.down('sm')]: {
			width: theme.spacing(14),
		},
		border: '1px solid rgba(0, 0, 0, 0.1)',
	},
	itemDetails: {
		margin: 0
	},
	itemImageContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	removeBtn: {
		marginTop:  theme.spacing(1),
	},
	bottomContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	totalContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '50%',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
	},
	totalSpacer: {
		width: '50%',
		[theme.breakpoints.down('sm')]: {
			width: 0,
		},
	},
	priceContent: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(1),
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
    alignItems: 'center',
	},
	rowTitle: {
		paddingRight: theme.spacing(1),
	},
}));
