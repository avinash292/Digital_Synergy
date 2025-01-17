import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	root: {},
	formContainer: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
		maxWidth: 500,
		margin: `0 auto`,
	},
	section: {
		paddingTop: 0,
		paddingBottom: 0,
	},
	signupLink: {
		padding: theme.spacing(2, 0),
	},
	cursorPointer: {
		cursor: 'pointer',
	},
	form: {
		width: '100%',
	},
	errorAlert: {
		marginBottom: theme.spacing(4),
		width: '100%',
	}
}));
