import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Snackbar from '@material-ui/core/Snackbar';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import useStyles from './DogPosterGuidelinesStyle';
import useCommonStyles from '../../common/style';
import GuideImage from './dog-poster-guide.jpg';



const DogPosterGuidelines = ({ open, onClose }) => {
	const classes = useStyles();
	const commonClasses = useCommonStyles();
	const fullScreen = useMediaQuery(theme => theme.breakpoints.down('xs'));
	const [previewFile, setPreviewFile] = useState({ file: null, imageSource: null });
	const [snack, setSnack] = useState({ open: false, message: '' });

	useEffect(() => {
		setPreviewFile({ file: null, imageSource: null });
	}, [open]);
   
	/**
	 * Close and pass data on close
	 */
	const handleProceed = (event) => {
		onClose(event, previewFile);  
	};

	/**
	 * Handle file change
	 * 
	 * @param {*} e 
	 */
	const handleFileChange = (e) => {
		const maxUploadSize = 15; // In MB
		const byteToMb = 1000000; //  1MB = 1000000 Bytes = 1000 * 1000 (in decimal format)
		const file = e.target.files[0];

		if ( !file ) { return; }
		const fileSize = parseInt(file.size);

		if(fileSize > maxUploadSize * byteToMb) { // Number of MegaBytes;
			return handleSnackToogle("Image Size Shouldn't Exceed " + maxUploadSize + "MB");
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			setPreviewFile({ file: file, imageSource: reader.result })
			// console.log(`data:${file.type};base64,${btoa(reader.result)}`);
			// uploadProfileImage(file);
		};
		reader.onerror = function () {
			handleSnackToogle("Error in loading image");
		};
	};

	/**
	 * Remove preview image
	 */
	const removeImage = () => {
		setPreviewFile({ file: null, imageSource: null });
	};


	const handleSnackToogle = (message) => {
		setSnack(snack => ({ open: !snack.open, message: message || '' }));
	};

	return (
		<Dialog
			classes={{ paper: commonClasses.dialogueFullwidth }}
			onClose={() => onClose()}
			aria-labelledby="dog-image-upload-guidelines-dialog"
			open={open}
			fullScreen={fullScreen}
			maxWidth={previewFile.imageSource ? 'md' : 'sm'}
			// scroll="body"
		>
			<AppBar position="static" className={classes.dialogHeader} elevation={2}>
				<Typography variant="h6" color="inherit" className={classes.dialogTitle}>
					Upload your dog photo
				</Typography>
				<IconButton aria-label="delete" onClick={onClose} color="inherit">
					<CloseIcon />
				</IconButton>
			</AppBar>

			<DialogContent className={classes.dialogContent}>
			{!previewFile.imageSource ? (
				<div>
					<DialogActions className={classes.dialogActions}>
						<input
							accept="image/*"
							className={classes.fileInput}
							id="button-file"
							type="file"
							multiple={false}
							onChange={handleFileChange}
						/>
						<label className={classes.btnLabel} htmlFor="button-file">
							<Button
								component="span"
								autoFocus
								variant="outlined"
								fullWidth
								color="primary"
								startIcon={<CloudUploadIcon />}
							>
								Choose photo
							</Button>
						</label>
					</DialogActions>
					<Typography variant="h6" className={classes.heading}>Photo guidelines</Typography>
					<Divider className={classes.divider} />
					<img src={GuideImage} alt="GuideImage" />
				</div>
			): (
				<Container className={classes.previewContainer}>
					<img className={classes.previewImg} src={previewFile.imageSource} alt="GuideImage" />
					<DialogActions className={classes.dialogPreviewActions}>
							<Button color="secondary" size="large" onClick={removeImage}>Try Another</Button>
							<Button
								autoFocus
								color="primary"
								size="large"
								onClick={handleProceed}
							>
								Add
							</Button>
					</DialogActions>
				</Container>
			)}
			</DialogContent>

			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={snack.open}
				onClose={() => handleSnackToogle()}
				message={snack.message}
				autoHideDuration={2000}
			/>
		</Dialog>
	);
};


DogPosterGuidelines.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	// onFileChange: PropTypes.func.isRequired,
};

export default DogPosterGuidelines;