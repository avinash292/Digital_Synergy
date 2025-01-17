import * as moment from 'moment';

const formatDate = (date, format) => {
	if (!date || date === '') { return date };
	format = format || 'YYYY-MM-DD hh:mm:ss A';
	return moment(date).format(format);
};

const formatUnderscore = (text) => {
	if (!text || text === '') { return text };
	let splitText = text.split('_');
	return splitText.map((word) => word.charAt(0).toUpperCase() +  word.slice(1)).join(' ');
};

const formatCurrency = (value, deciamalPlaces) => {
	if (!value || value === '') { return value };
	deciamalPlaces = deciamalPlaces || 2;
	return value.toFixed(deciamalPlaces);
};

const formatUnixDate = (date, format) => {
	if (!date || date === '') { return date };
	format = format || 'YYYY-MM-DD hh:mm:ss A';
	return moment.unix(date).format(format);
};

/**
 * To convert deciamal coordinates to Degrees, Minutes & Seconds
 * 
 * @param {Number} coordinate 
 * @param {String} returnType 
 */
const toDegreesMinutesAndSeconds = (coordinate, returnType) => {
	const absolute = Math.abs(coordinate);
	let degrees = Math.floor(absolute);
	const minutesNotTruncated = (absolute - degrees) * 60;
	let minutes = Math.floor(minutesNotTruncated);
	let seconds = Math.floor((minutesNotTruncated - minutes) * 60);

	// After rounding, the seconds might become 60. These two
	// if-tests are not necessary if no rounding is done.
	if (seconds === 60) { minutes++; seconds = 0; }
	if (minutes === 60) { degrees++; minutes = 0; }

	if (returnType === 'object') {
		return { degrees, minutes, seconds };
	}
	return `${degrees}° ${minutes}' ${seconds}"`
};

const convertDMS = (lat, lng) => {
	const latitude = toDegreesMinutesAndSeconds(lat);
	const latitudeCardinal = lat >= 0 ? "N" : "S";

	const longitude = toDegreesMinutesAndSeconds(lng);
	const longitudeCardinal = lng >= 0 ? "E" : "W";

	return latitude + " " + latitudeCardinal + " / " + longitude + " " + longitudeCardinal;
};

const formatCoordinates = (lat, lng, decimalPlaces) => {
	decimalPlaces = decimalPlaces || 3;
	const latitude = Math.abs(lat).toFixed(decimalPlaces);
	const latitudeCardinal = lat >= 0 ? "N" : "S";

	const longitude = Math.abs(lng).toFixed(decimalPlaces);
	const longitudeCardinal = lng >= 0 ? "E" : "W";

	return latitude + "°" + latitudeCardinal + " / " + longitude + "°" + longitudeCardinal;
};

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
const b64toBlob = (b64Data, contentType, sliceSize) => {
	contentType = contentType || '';
	sliceSize = sliceSize || 512;

	const byteCharacters = atob(b64Data);
	let byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		let byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, {type: contentType});
	return blob;
};


const dataURIToBlob = (dataURI) => {
	const splitDataURI = dataURI.split(',')
	const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
	const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

	const ia = new Uint8Array(byteString.length)
	for (let i = 0; i < byteString.length; i++)
			ia[i] = byteString.charCodeAt(i)

	return new Blob([ia], { type: mimeString })
};

export { formatDate, formatUnderscore, formatCurrency, formatUnixDate, convertDMS, formatCoordinates, toDegreesMinutesAndSeconds, b64toBlob, dataURIToBlob };