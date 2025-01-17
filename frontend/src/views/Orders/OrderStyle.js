import { makeStyles } from '@material-ui/core/styles';


export default makeStyles(theme => ({
  root: {
		minHeight: 'calc(100vh - 184px)',
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
		padding: theme.spacing(2),
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
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 400,
	},
	rowHover: {
		cursor: 'pointer',
	},
	statusChip: {
		color: theme.palette.text.contrastText,
	}
}));
