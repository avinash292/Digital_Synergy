import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	inputField: {
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
        padding: 0,
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    dialogTitle: {
        textTransform: 'capitalize',
        paddingLeft: theme.spacing(2),
    }
}));