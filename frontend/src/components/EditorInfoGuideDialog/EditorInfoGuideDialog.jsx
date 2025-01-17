import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
// import AppBar from '@material-ui/core/AppBar';
// import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import useStyles from './EditorInfoGuideDialogStyle';
import useCommonStyles from '../../common/style';
import TabPanel from '../TabPanel';
import PosterImage from './material-poster-paper.jpg';

const EditorInfoGuideDialog = ({ open, onClose }) => {
	const classes = useStyles();
	const commonClasses = useCommonStyles();
	const [tabValue, setTabValue] = useState(0);
	const fullScreen = useMediaQuery(theme => theme.breakpoints.down('xs'));

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	/* useEffect(() => {
		console.log("dialogData : ", dialogData);
	}, [open, dialogData]); */


	return (
		<Dialog
			fullScreen={fullScreen}
			classes={{ paper: commonClasses.dialogueFullwidth }}
			onClose={() => onClose()}
			aria-labelledby="guide-dialog"
			open={open}
		>
			{/* <AppBar position="static" className={classes.dialogHeader} elevation={2}>
				<Typography variant="h5" color="inherit" className={classes.dialogTitle}>
					Edit Task Title
				</Typography>
				<IconButton aria-label="delete" onClick={() => onClose()} color="inherit">
					<CloseIcon />
				</IconButton>
			</AppBar> */}
			{/* <AppBar position="static" className={classes.dialogHeader} elevation={2}> */}
			<div className={classes.dialogHeader}>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="primary"
					// variant="fullWidth"
					variant="scrollable"
					scrollButtons="auto"
				>
					<Tab label="Material" />
					<Tab label="How it works" />
				</Tabs>
				<IconButton aria-label="delete" onClick={() => onClose()} color="inherit">
					<CloseIcon />
				</IconButton>
			</div>
			<Divider />
			<DialogContent className={classes.dialogContent}>
				<TabPanel value={tabValue} index={0} padding={0}>
					<img className={classes.posterImage} src={PosterImage} alt={'PosterImage'} />
					<Typography variant="h6">Fine art paper</Typography>
					<Typography>
						Enhanced Matte Art 200gsm premium-quality heavyweight fine art paper gentle textured surface. Brilliant vibrant colours, deep blacks and almost three dimensional depth. Perfect for fine art.
					</Typography>
				</TabPanel>
				<TabPanel value={tabValue} index={1} padding={0}>
					<img className={classes.posterImage} src={PosterImage} alt={'PosterImage'} />
					<Typography>Design your own unique personalised custom poster easily with our poster editor by getting an instant preview each time you add a personal touch.</Typography>
					<Typography>Click your way through each tab where you can change almost every part of the poster. Depending on the poster there are different choices to be made.</Typography>
				</TabPanel>
			</DialogContent>
			{/* <DialogActions className={classes.dialogActions}>
				<Button autoFocus onClick={onClose} color="primary" >
					Save
				</Button>
			</DialogActions> */}
		</Dialog>
	);
};

EditorInfoGuideDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default EditorInfoGuideDialog;