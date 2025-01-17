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
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing(2, 6),
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
		},
	},
	spacer: {
		width: 30,
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
	skeletonLoaderLeft: {
		width: '100%',
		height: 500,
		borderRadius: theme.spacing(0.5),
	},
	skeletonLoader: {
		width: '100%',
		height: 200,
		borderRadius: theme.spacing(0.5),
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	cardTitle: {
		padding: theme.spacing(1, 2),
	},
	itemImage: {
		width: theme.spacing(15),
		marginRight: theme.spacing(1),
		[theme.breakpoints.down('sm')]: {
			width: theme.spacing(14),
		},
		border: '1px solid rgba(0, 0, 0, 0.1)',
	},
	productItem: {
		padding: theme.spacing(2),
		// marginBottom: theme.spacing(2),
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
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
	itemPriceDetails: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	}
}));
