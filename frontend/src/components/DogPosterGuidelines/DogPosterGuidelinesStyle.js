import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	dialogHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing(1),
	},
	dialogContent: {
		// padding: theme.spacing(3),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		minHeight: 360,
	},
	dialogActions: {
		padding: theme.spacing(3, 2),
		width: '100%',
	},
	dialogTitle: {
		textTransform: 'capitalize',
		paddingLeft: theme.spacing(2),
	},
	heading: {
		textAlign: 'center',
	},
	divider: {
		width: '100%',
		margin: theme.spacing(1, 0),
	},
	btnLabel: {
		width: '100%',
	},
	fileInput: {
		display: 'none',
	},
	previewContainer: {
		padding: theme.spacing(2, 0),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		minHeight: 360,
	},
	previewImg: {
		maxWidth: '100%',
		maxHeight: '100%',
		border: '1px solid rgba(0, 0, 0, 0.2)',
	},
	dialogPreviewActions: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		padding: theme.spacing(1, 0, 0, 0),
	}
}));