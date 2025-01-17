import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	root: {
	},
	header: {
		paddingTop: theme.spacing(1),
	},
	heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: 'bold',
  },
	designAccordion: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	activeBtn: {
		backgroundColor: theme.palette.colors.grey[300] + ' !important',
	},
	btnGrp: {
		marginTop: theme.spacing(2),
	},
	previewImg: {
		border: '1px solid rgba(0, 0, 0, 0.2)',
		margin: theme.spacing(1),
	},
	selectedImgContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	uploadInfo: {
		padding: theme.spacing(1),
	},
	materialItemContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	materialImage: {
		height: 110,
		width: 100,
	},
	content: {
		padding: theme.spacing(0, 1),
	},
	titlePriceContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontWeight: 'bold',
	},
	price: {
		fontSize: 14,
	},
	subtitle: {
		fontSize: 12,
		textAlign: 'left',
	},
}));