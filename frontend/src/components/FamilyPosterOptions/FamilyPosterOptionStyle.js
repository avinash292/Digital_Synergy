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
	memberImage: {
		height: theme.spacing(8),
	},
	smallerMemberImage: {
		height: theme.spacing(5),
	},
	memberCharacter: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		border: '1px solid',
		borderColor: theme.palette.outline,
		borderRadius: theme.spacing(0.5),
		padding: theme.spacing(2, 0),
	},
	characterContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	memberInfo: {
		width: '100%',
		paddingTop: '0 !important',
	},
	addBtn: {
		marginTop: theme.spacing(2),
	},
	gridItem: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	layoutImgSize: {
		maxWidth: '60px !important',
	},
	tabHandle: {
		minWidth: 0,
		fontSize: 11.5,
		[theme.breakpoints.down('xs')]: {
			fontSize: 12,
		},
	},
	memberNameContainer: {
		display: 'flex',
		flexDirection: 'row',
		// justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	actionContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',	
	},
	memberContainer: {
		border: '1px solid rgba(0, 0, 0, 0.1)',
		padding: theme.spacing(1),
		marginBottom: theme.spacing(2),
		borderRadius: theme.spacing(1),
	},
	input: {
		flexGrow: 1,
		margin: 0,
		marginLeft: theme.spacing(2),
	},
	removeMemberBtn: {
		marginLeft: 10,
		padding: 9,
		marginTop: 5,
	},
	positionLabel : {
		backgroundColor: '#ffffff',
		padding: 0,
		width: '30%'
	},
	sizeImage: {
		height: theme.spacing(8),
		// width: theme.spacing(8)
	},
	hairSizeImage: {
		height: theme.spacing(7),
	},
	colorGridItem: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer',
	},
	colorView: {
		width: theme.spacing(6),
		height: theme.spacing(6),
		backgroundColor: 'gray',
		borderRadius: '50%',
		border: '2px solid rgba(0, 0, 0, 0.1)',
		position: 'relative',
	},
	secondaryColorView: {
		width: theme.spacing(3),
		height: theme.spacing(3),
		backgroundColor: 'gray',
		borderRadius: '50%',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		position: 'absolute',
		top: 2,
    	right: 3,
		overflow: 'hidden',
	},
	topBannerText: {
		fontSize:'60px',
		fontWeight: 'bold',
	},
	resetAccessoryBtn: {
		float: 'right',
		width: '10%',
	},
	memberLabel: {
		width: 100,
	},
	colorItem: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer',
	},
	badgeIcon: {
		backgroundColor: theme.palette.success.main,
		color: '#fff',
		borderRadius: 50,
		padding: 0
	},
	swatchTitle:{
		textAlign: 'center',
		fontSize: 14,
	},
	containerGrid: {
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			flexWrap: 'nowrap',
			overflowX: 'auto',
		},
	},
}));