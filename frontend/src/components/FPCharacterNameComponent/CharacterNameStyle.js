import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	characterName:{
		position: 'absolute' ,
		// fontSize: '100%' ,
		wordWrap: 'break-word' ,
		minHeight: 42,
		fontFamily: 'Roboto',
		alignSelf: 'center',
		overflow: 'hidden',
		width: '100%',
	},
}));