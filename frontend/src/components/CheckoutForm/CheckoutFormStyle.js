import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	root: {},
  payBtn: {
    margin: theme.spacing(3, 0, 2, 0),
  },
  errorMsg: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: theme.spacing(1),
  },
  cardInput: {

  },
  formGroup: {
    borderRadius: 4,
    padding: '18.5px 14px',
    border: '1px solid #d1d1d1',
  }
}));