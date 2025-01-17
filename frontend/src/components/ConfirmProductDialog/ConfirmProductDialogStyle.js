import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	inputField: {
		marginTop: 0,
		marginBottom: theme.spacing(2),
	},
	dialogHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing(1),
	},
	dialogContent: {
		padding: theme.spacing(3),
	},
	dialogActions: {
		padding: theme.spacing(0, 3, 3, 3),
	},
	dialogTitle: {
		textTransform: 'capitalize',
		paddingLeft: theme.spacing(2),
	},
	contentBox: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: theme.palette.background.default,
		borderRadius: theme.spacing(1),
		padding: theme.spacing(2),
		margin: theme.spacing(2, 0),
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
	previewImg: {
		border: '1px solid rgba(0, 0, 0, 0.2)',
		marginTop: theme.spacing(1),
		width: '100%',
	},
}));