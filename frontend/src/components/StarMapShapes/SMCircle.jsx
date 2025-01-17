import React from 'react';

const SMCircle = ({ bgColor, outlineColor }) => {
	bgColor = bgColor || '#000000';
	outlineColor = outlineColor || '#ffffff';
	return (
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="svgLayer" x="0px" y="0px" viewBox="0 0 400 400" xml="preserve" className="editor-color-11" shapeRendering="geometricPrecision">
			<g>
				<path className="st1" fill={bgColor} d="M0,0v400h400V0H0z M199.9,393.7C93,393.7,6.3,307,6.3,200.1S93,6.6,199.9,6.6s193.6,86.7,193.6,193.6   S306.8,393.7,199.9,393.7z"/>
			</g>
			<g>
				<path className="st0" fill={outlineColor} d="M199.9,394.9C92.5,394.9,5.1,307.5,5.1,200.1S92.5,5.3,199.9,5.3c107.4,0,194.8,87.4,194.8,194.8   S307.3,394.9,199.9,394.9z M199.9,7.8C93.9,7.8,7.6,94.1,7.6,200.1c0,106,86.3,192.3,192.3,192.3s192.3-86.3,192.3-192.3   C392.2,94.1,305.9,7.8,199.9,7.8z"/>
			</g>
		</svg>
	);
};

export default SMCircle;