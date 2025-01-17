import React from 'react';

const SMStar = ({ bgColor, outlineColor }) => {
	bgColor = bgColor || '#000000';
	outlineColor = outlineColor || '#ffffff';
	return (
		<svg version="1.1" id="svgLayer" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 400 400" >
			<g>
				<path className="st1" fill={bgColor} d="M0,0v400h400V0H0z M303.4,344.9L200,290.5L96.6,344.9l19.8-115.2l-83.7-81.5l115.6-16.7L200,26.7l51.7,104.8l115.6,16.7
					l-83.7,81.5L303.4,344.9z"/>
			</g>
			<g>
				<path className="st0" fill={outlineColor} d="M304.4,346.3L200,291.4L95.6,346.3L115.5,230l-84.5-82.3l116.7-16.9L200,25l52.2,105.8l116.7,16.9L284.5,230
					L304.4,346.3z M200,289.7l102.4,53.8l-19.6-114.1l0.3-0.3l82.6-80.5l-114.5-16.6l-0.2-0.4L200,28.4l-51.2,103.8L34.3,148.7
					l82.9,80.7l-0.1,0.4L97.6,343.5L200,289.7z"/>
			</g>
		</svg>
	);
};

export default SMStar;