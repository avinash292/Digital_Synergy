import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	root: {
		padding: theme.spacing(4),
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
		},
	},
	image: {
		boxShadow:
			'25px 60px 125px -25px rgba(80,102,144,.1), 16px 40px 75px -40px rgba(0,0,0,.2)',
		borderRadius: theme.spacing(2),
		[theme.breakpoints.down('sm')]: {
			maxWidth: 500,
		},
	},
	lastGrid: {
		[theme.breakpoints.up('sm')]: {
			marginTop: '40%',
		},
	},
	title: {
		paddingBottom: theme.spacing(4),
		[theme.breakpoints.down('sm')]: {
			paddingBottom: theme.spacing(2),
		},
	},
	sectionItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	sectionImg: {
		width: 300,
	}
}));