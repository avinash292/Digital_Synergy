import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	root: {},
	continueBtn: {
    marginTop: theme.spacing(2),
  },
  postalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: theme.spacing(0.5),
		border: '1px solid gray',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
  },
  postalTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.success.main,
  }
}));