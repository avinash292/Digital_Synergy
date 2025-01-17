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
    maxWidth: 600,
    margin: `0 auto`,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 0,
	},
	socialLogin: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: theme.spacing(2),
	},
	googleLoginBtn: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
	},
	signupLink: {
		padding: theme.spacing(2, 0),
	},
	forgotPass: {
		paddingTop: theme.spacing(1),
	},
	cursorPointer: {
		cursor: 'pointer',
	},
	fbBtn: {
		height: theme.spacing(5),
	},
	errorAlert: {
		marginBottom: theme.spacing(4),
		width: '100%',
	}
}));
