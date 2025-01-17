import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';

const TabPanel = (props) => {
	const { children, value, index, padding = 3, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`custom-tabpanel-${index}`}
			aria-labelledby={`custom-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={padding}>
					{children}
				</Box>
			)}
		</div>
	);
};

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
	padding: PropTypes.number,
};

export default TabPanel;