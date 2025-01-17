import React from 'react';
import { FP_POSTER_SIZES } from '../../config';

const calculatePercentReduction = (width, percent) => {
	return width - ((width * percent) /100)
};

const evalauteWidthAsPerSize = (width, isLandscape, size) => {
	let percentReducution = 0;
	if (size === "xs") {
		percentReducution = isLandscape ? 40 : 55;
	} else if (size === "s") {
		percentReducution = isLandscape ? 30 : 45;
	} else if (size === "m") {
		percentReducution = isLandscape ? 20 : 35;
	} else if (size === "l") {
		percentReducution = isLandscape ? 15 : 24;
	} else if (size === "xl") {
		percentReducution = isLandscape ? 8 : 10;
	}
	return calculatePercentReduction(width, percentReducution);
};

const FPPet = ({ options: { size, label, charsCount, isLandscape, isDownXSS, isDownXS, isDownLG } }) => {
	// console.log("FPPet options : ", { accessory, beard, hairColor, hairStyle, size, label, isCombo, type });
	let svgWidth = isLandscape ? 40 : 80;
	svgWidth = evalauteWidthAsPerSize(svgWidth, isLandscape, size);


	if (isDownXSS) { svgWidth = (FP_POSTER_SIZES.frameWidthMobile / FP_POSTER_SIZES.frameWidthLG) * svgWidth; }
	else if (isDownXS) { svgWidth = (FP_POSTER_SIZES.frameWidthTablet / FP_POSTER_SIZES.frameWidthLG) * svgWidth; }
	else if (isDownLG) { svgWidth = (FP_POSTER_SIZES.frameWidth / FP_POSTER_SIZES.frameWidthLG) * svgWidth; }

	/* let perWidth = 80;
	if (size === "xs")
		perWidth = perWidth - 6;
	else if (size === "s")
		perWidth = perWidth - 3;
	else if (size === "l")
		perWidth = perWidth + 3;
	else if (size === "xl")
		perWidth = perWidth + 6;
	else if (size === "xxl")
		perWidth = perWidth + 12; */

	return (
		<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="128.837 332.182 231.926 294.357" enableBackground="new 128.837 332.182 231.926 294.357" style={{ width: svgWidth, maxWidth: svgWidth }}>
			<g id="Dog" display={label === 'dog' ? "block" : "none"}>
				<g>
					<path d="M147.512,551.063c11.613,18.333,14.245,40.607,32.199,55.563c5.613-59.357,27.156-112.972,46.861-168.619
						c21.221,6.963,41.794,13.396,62.031,20.752c2.568,0.933,4.378,6.573,4.843,10.247c3.302,26.109,6.194,52.27,9.153,78.422
						c2.249,19.874,4.416,39.757,6.594,59.64c0.868,7.923-2.586,11.223-10.688,11.963c-20.483,1.872-40.847,5.111-61.343,6.751
						c-13.488,1.079-27.122,0.344-40.69,0.386c-1.695,0.005-3.429-0.49-5.08-0.267c-20.011,2.692-32.395-2.885-38.992-21.532
						c-4.683-13.239-5.795-27.813-7.754-41.895C144.145,558.873,146.48,554.877,147.512,551.063z"/>
					<path d="M290.163,447.398c-19.202-6.712-36.435-12.475-53.396-18.953c-2.452-0.937-5.647-5.902-5.034-7.981
						c7.417-25.13,15.079-50.208,23.712-74.94c1.814-5.198,7.817-8.934,11.89-13.343c1.995,5.562,4.166,11.07,5.899,16.714
						c0.683,2.223,0.387,4.747,0.573,7.713c2.499,0.248,4.529,0.746,6.511,0.597c11.19-0.842,18.945,3.843,23.148,14.213
						c2.226,5.493,5.704,8.268,12.006,7.52c3.41-0.404,6.995,0.31,10.459,0.811c7.797,1.127,16.903,0.269,18.735,11.292
						c1.881,11.318-3.82,24.179-13.333,28.461c-6.665,3-13.664,5.596-20.779,7.176C299.902,429.043,290.888,432.527,290.163,447.398z"
						/>
				</g>
			</g>
			<g id="Cat" display={label === 'cat' ? "block" : "none"}>
				<g display="inline">
					<path d="M163.235,482.817c14.945-7.016,29.757-12.907,43.431-20.776c8.558-4.925,14.926-4.304,22.574,0.773
						c42.174,27.998,73.281,64.569,87.254,113.91c3.025,10.682,8.1,8.831,14.23,4.949c17.087-10.819,17.307-31.686,0.385-42.787
						c-11.796-7.738-18.689-18.067-16.187-32.142c3.113-17.516,7.539-35.263,27.011-42.082c4.109-1.439,9.894,1.906,14.907,3.047
						c-1.926,4.394-3.252,9.195-5.903,13.095c-5.305,7.802-13.708,14.398-16.251,22.867c-1.756,5.849,2.164,16.061,7.001,20.794
						c29.452,28.825,24.271,61.803-11.881,81.537c-37.323,20.373-76.134,24.336-117.177,17.348c-11.594-1.974-23.53-1.876-35.285-2.986
						c-7.305-0.689-14.18-2.005-14.154-11.925C163.297,566.622,163.235,524.803,163.235,482.817z"/>
					<path d="M160.622,465.125c-7.101-6.013-13.867-12.487-21.376-17.936c-12.609-9.148-14.022-27.052-2.815-38.379
						c3.662-3.702,7.587-7.86,9.349-12.574c3.419-9.145,9.829-13.185,18.817-14.021c9.091-0.845,14.426-5.124,18.404-13.766
						c3.056-6.64,9.791-11.586,14.89-17.286c4.099,6.847,9.542,13.239,12.041,20.626c7.166,21.187,13.724,42.766,5.932,65.371
						c-1.305,3.785-2.939,8.933-5.927,10.416c-16.012,7.946-32.502,14.931-48.826,22.248
						C160.947,468.259,160.785,466.692,160.622,465.125z"/>
				</g>
			</g>
		</svg>
	);
};

export default FPPet;