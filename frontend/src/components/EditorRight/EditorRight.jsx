import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';

import useStyles from './EditorRightStyle';
import FscImage from './fsc.png';
// import useCommonStyles from '../../common/style';


const EditorRight = ({ title }) => {
	const classes = useStyles();
	// const commonClasses = useCommonStyles();
	// const formRef = useRef(null);

	/* useEffect(() => {
				setFormState(formState => ({
						...formState,
						values: {
								name: (dialogData && dialogData.name) ? dialogData.name : '',
								label: (dialogData && dialogData.label) ? dialogData.label : '',
						},
						touched: {}
				}));
	}, [open, dialogData]); */


	return (
			<Container className={classes.root}>
				<Typography variant="h3">{title}</Typography>
				<Typography>Using our custom-built map editor, choose from a wide variety of themes, colours and sizes. Whether you want to decorate your home/office, or create a piece of art for a loved one - our editor has endless possibilities.</Typography>
				<Typography variant="h6" className={classes.header}>Production Process</Typography>
				<Typography>Advanced Lichee Printing <br/> using HP Indigo 12000 Press</Typography>
				<Typography variant="h6" className={classes.header}>Paper Stock</Typography>
				<Typography>250 GSM Matte Paper <br/> Acid Free / Archival Quality</Typography>
				<Typography variant="h6" className={classes.header}>Inks</Typography>
				<Typography>HP Indigo Pigment Inks <br/> 30-60 years before colour fading</Typography>
				<Typography variant="h6" className={classes.header}>Parcel Weight</Typography>
				<Typography>0.95 kg</Typography>
				<Typography variant="h6" className={classes.header}>Hanging Instructions</Typography>
				<Typography>Best hung indoors or shaded area away from direct contact with sunlight</Typography>
				<img src={FscImage} alt="Responsible Forestry" width="160" />
			</Container>
	);
};

EditorRight.propTypes = {
	title: PropTypes.string.isRequired,
};

export default EditorRight;