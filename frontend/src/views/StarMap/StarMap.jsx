import React, { useEffect, useState, useMemo, useRef } from 'react';
import * as celestial from "d3-celestial";
import moment from 'moment';
import clsx from 'clsx';
// import html2canvas from 'html2canvas';
// import jsPDF from "jspdf";
import { connect } from 'react-redux';
import { drawDOM, exportPDF, exportImage } from "@progress/kendo-drawing";

// import d3 from "d3-celestial/lib/d3";
// import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import InfoIcon from '@material-ui/icons/Info';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import useStyles from './StarMapStyle';
// import StarMapOptions from '../../components/StarMapOptions';
import { SMCircle, SMHeart, SMStar, SMHome } from '../../components/StarMapShapes';
import ConfirmProductDialog from '../../components/ConfirmProductDialog';
import { convertDMS, dataURIToBlob } from '../../utils/formatter';
import API from '../../axios/axiosApi';
import { STAR_MAP_LABEL, COMMON_ERR_MSG } from '../../config';
import { StarMapOptionsDesktop, StarMapOptionsMobile } from '../../components/StarMapOptions';
import AddToCartButton from '../../components/AddToCartButton';
// import EditorRight from '../../components/EditorRight';
import AuthService from '../../services/authService';
import { updateLoginCart, incrementCartCount } from '../../redux/actions';
import EditorInfoGuideDialog from '../../components/EditorInfoGuideDialog';

// Map projection used: airy, aitoff, armadillo, august, azimuthalEqualArea, azimuthalEquidistant, baker, berghaus, boggs, bonne, bromley, cassini, collignon, craig, craster, cylindricalEqualArea, cylindricalStereographic, eckert1, eckert2, eckert3, eckert4, eckert5, eckert6, eisenlohr, equirectangular, fahey, foucaut, ginzburg4, ginzburg5, ginzburg6, ginzburg8, ginzburg9, gringorten, hammer, hatano, healpix, hill, homolosine, kavrayskiy7, lagrange, larrivee, laskowski, loximuthal, mercator, miller, mollweide, mtFlatPolarParabolic, mtFlatPolarQuartic, mtFlatPolarSinusoidal, naturalEarth, nellHammer, orthographic, patterson, polyconic, rectangularPolyconic, robinson, sinusoidal, stereographic, times, twoPointEquidistant, vanDerGrinten, vanDerGrinten2, vanDerGrinten3, vanDerGrinten4, wagner4, wagner6, wagner7, wiechel, winkel3

const config = {
	width: 360, 		// 360	0
	// projectionRatio: null, 
	projection: 'airy', // airy	aitoff 	cassini	orthographic
	// transform: "equatorial",
	center: null, // center: [10,10,10], // TODO : Fix it to const ID
	orientationfixed: true,
	adaptable: true,
	interactive: false,
	disableAnimations: true,
	// form: false,
	controls: false,
	container: "celestial-map",
	datapath: 'data/',
	zoomlevel: 1,
	zoomextend: 2,
	formFields: {
		"location": false,  // Set visiblity for each group of fields with the respective id
		"general": false,  
		"stars": false,  
		"dsos": false,  
		"constellations": false,  
		"lines": false,  
		"other": false,  
		"download": false
	},
	advanced: false,
	// STARS
	stars: {
		show: true,    // Show stars
		limit: 6,      // Show only stars brighter than limit magnitude
		colors: false,  // Show stars in spectral colors, if not use default color
		style: { fill: "#ffffff", opacity: 1 }, // Default style for stars
		designation: false, // Show star names (Bayer, Flamsteed, Variable star, Gliese or designation, 
											 // i.e. whichever of the previous applies first); may vary with culture setting
		designationType: "desig",  // Which kind of name is displayed as designation (fieldname in starnames.json)
		designationStyle: { fill: "#ddddbb", font: "11px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif", align: "left", baseline: "top" },
		designationLimit: 2.5,  // Show only names for stars brighter than nameLimit
		propername: false,   // Show proper name (if present)
		propernameType: "name", // Languge for proper name, default IAU name; may vary with culture setting 
														// (see list below of languages codes available for stars)
		propernameStyle: { fill: "#ddddbb", font: "13px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif", align: "right", baseline: "bottom" },
		propernameLimit: 1.5,  // Show proper names for stars brighter than propernameLimit
		size: 4,       // Maximum size (radius) of star circle in pixels // 7
		exponent: -0.28, // Scale exponent for star size, larger = more linear
		data: 'stars.6.json' // Data source for stellar data, 
												 // number indicates limit magnitude
	},
	dsos: {
		show: false,    // Show Deep Space Objects 
	},
	planets: {  //Show planet locations, if date-time is set
		show: false,
	},
	constellations: {
		names: false,      // Show constellation names 
		namesType: "iau", // Type of name Latin (iau, default), 3 letter designation (desig) or other language (see list below)
		nameStyle: { fill:"#cccc99", align: "center", baseline: "middle", 
								 font: ["14px Helvetica, Arial, sans-serif",  // Style for constellations
												"12px Helvetica, Arial, sans-serif",  // Different fonts for diff.
												"11px Helvetica, Arial, sans-serif"]},// ranked constellations
		lines: true,   // Show constellation lines, style below
		lineStyle: { stroke: "#cccccc", width: 1.2, opacity: 0.6 },
		bounds: false, // Show constellation boundaries, style below
		boundStyle: { stroke: "#cccc00", width: 0.5, opacity: 0.8, dash: [2, 4] }
	},  
	mw: {
		show: true,     // Show Milky Way as filled multi-polygon outlines 
		style: { fill: "#ffffff", opacity: 0.15 }  // Style for MW layers
	},
	lines: {  // Display & styles for graticule & some planes
		graticule: {
			show: false, stroke: "#cccccc", width: 0.6, opacity: 0.8,   
			// grid values: "outline", "center", or [lat,...] specific position
			lon: {pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif"}, 
			// grid values: "outline", "center", or [lon,...] specific position
			lat: {pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif"}
		},
		equatorial: { show: false, stroke: "#aaaaaa", width: 1.3, opacity: 0.7 },  
		ecliptic: { show: false, stroke: "#66cc66", width: 1.3, opacity: 0.7 },     
		galactic: { show: false, stroke: "#cc6666", width: 1.3, opacity: 0.7 },    
		supergalactic: { show: false, stroke: "#cc66cc", width: 1.3, opacity: 0.7 }
	},
	background: {        // Background style
		fill: '#000000',   // Area fill
		opacity: 1, 
		stroke: 'transparent', // Outline
		width: 1.5
	}, 
	horizon: {  //Show horizon marker, if location is set and map projection is all-sky
		show: false, 
		stroke: "#cccccc", // Line
		width: 1.0, 
		fill: "#000000",   // Area below horizon
		opacity: 0.5
	},  
	daylight: {  //Show day sky as a gradient, if location is set and map projection is hemispheric
		show: false
	}
};

const includesTitle = ['layout_1'];
const frameWidthLG = 500, frameWidth = 430, frameWidthTablet = 400, frameWidthMobile = 300;


const StarMap = ({ history, updateLoginCart, incrementCartCount }) => {
	const classes = useStyles();

	const defaultSizes = [
		{ id: 1, label: "size_30_40", title: "30x40cm / 12x16inch / €39", price: '39', currency: 'EUR', class: 'size_30_40' },
		{ id: 2, label: "size_50_70", title: "50x70cm / 20x28inch / €49", price: '49', currency: 'EUR', class: 'size_50_70' },
		{ id: 3, label: "size_70_100", title: "70x100cm / 28x40inch / €69", price: '69', currency: 'EUR', class: 'size_70_100' },
	];
	const defaultShapes = [
		{ id: 1, image: "smCircle.png", is_active: true, label: "smCircle", name: "Circle", product_id: 2 },
		{ id: 2, image: "smHeart.png", is_active: true, label: "smHeart", name: "Heart", product_id: 2 },
	];
	const defaultLayouts = [
		{ id: 1, image: "star-map-layout-1.png", is_active: true, label: "layout_1", name: "Layout 1", product_id: 2 },
	];
	const defaultColors = [
		{ id: 1, primary_color: "#000000", secondary_color: "#000000", tertiary_color: "#ffffff", outline_color: "#cccccc", text_color: "#ffffff", is_active: true, label: "black", name: "Black", product_id: 2 },
		{ id: 2, primary_color: "#0f1d42", is_active: true, label: "midnightblue", name: "Midnight Blue", product_id: 2 },
	];

	const defautCelestialConfig = {
		location: {
			lat: 25.7616798,
			lng: -80.1917902,
			place: 'Miami',
		}, // [31.1471, 75.3412]
		elements: {
			grid: false,
			constellations: true,
			milkyWay: true,
		},
		date: moment(),		
		color: defaultColors[0],
	};
	const defaultOptions = {
		shape: defaultShapes[0],
		layout: defaultLayouts[0],
		size: 0,
		purchaseType: 'print',
		text: {
			title: 'THE BIRTH OF A STAR',
			subTitle: 'Laura Julia Watson',
			message: 'When the stars aligned',
			placeText: 'Miami'
		},
	};


	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
	const [celestialConfig, setCelestialConfig] = useState(defautCelestialConfig);
	const [d3Celestial, setD3Celestial] = useState(null);
	const [confirmProductDialog, setConfirmProductDialog] = useState({ open: false, data: {} });
	const [productDetails, setProductDetails] = useState({
		shapes: defaultShapes,
		layouts: defaultLayouts,
		colors: defaultColors,
		sizes: defaultSizes,
	});
	const [loading, setLoading] = useState(false);
	const [posterLoading, setPosterLoading] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [zoomFactor, setZoomFactor] = useState(1);
	const [openBottombar, setOpenBottombar] = useState(false);
	const [snack, setSnack] = useState({ open: false, message: '' });
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);

	const posterRef = useRef(null);

	const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'), { defaultMatches: true });
	const isDownLG 	= useMediaQuery(theme => theme.breakpoints.down('lg'), { defaultMatches: true });
	const isDownXS 	= useMediaQuery(theme => theme.breakpoints.down('xs'), { defaultMatches: true });
  const isDownXSS = useMediaQuery('(max-width: 430px)');

	let canvasWidth = 375;
	if (isDownXSS) { canvasWidth = (frameWidthMobile / frameWidthLG) * canvasWidth; }
	else if (isDownXS) { canvasWidth = (frameWidthTablet / frameWidthLG) * canvasWidth; }
	else if (isDownLG) { canvasWidth = (frameWidth / frameWidthLG) * canvasWidth; }
	else { canvasWidth = 375; }

	const configuration = useMemo(() => ({
		...config,
		width: canvasWidth
	}), [canvasWidth]);

	useEffect(() => {
		const fetchStarMapElements = async () => {
			try {
				setLoading(true);
				setPosterLoading(true);
				const response = await API.get('products/' + STAR_MAP_LABEL);
				if (response.data.success && response.data.data && response.data.data.product_details) {
					const product = response.data.data.product_details;
					setSelectedOptions(selectedOptions => ({
						...selectedOptions,
						shape: product.shapes.length ? product.shapes[0] : selectedOptions.shape,
						layout: product.layouts.length ? product.layouts[0] : selectedOptions.layout,
						color: product.colors.length ? product.colors[0] : selectedOptions.color,
					}));
					setTimeout(() => { setProductDetails(product); }, 2000);
					setLoading(false);
					setPosterLoading(false);
				} else if (response.data.success && !response.data.data.product_details) {
					setLoading(false);
					setPosterLoading(false);
					// handleSnackToogle("Product don't exists!");
					return history.push('/');
				} else {
					setLoading(false);
					setPosterLoading(false);
				}
			} catch (error) {
				console.log("ERROR in fetchStarMapElements : ", error);
				setLoading(false);
				setPosterLoading(false);
				// const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
				// handleSnackToogle(errorMsg);
			}
		};
		fetchStarMapElements();
	}, [history]);

	useEffect(() => {
		const renderStarMap = () => {
			const celestialD3 = celestial.Celestial();
			celestialD3.display(configuration);
			setD3Celestial(celestialD3);
			const form = document.getElementById("celestial-form");
			const children = form.children;
			if (children.length) {
				for (const key in children) {
					if (Object.hasOwnProperty.call(children, key)) {
						const element = children[key];
						if (key > 1) { 
							document.getElementById("celestial-form").removeChild(element);
							document.getElementById("celestial-form").removeChild(children[2]);
						}						
					}
				}
			}
		};
		renderStarMap();
	}, [configuration]);	

	useEffect(() => {
		if (d3Celestial) {
			d3Celestial.apply({
				...configuration,
				background: {
					...configuration.background,
					fill: celestialConfig.color.secondary_color,
				},
				stars: {
					...configuration.stars,
					style: { ...configuration.stars.style, fill: celestialConfig.color.tertiary_color },
				},
				constellations: {
					...configuration.constellations,
					lines: celestialConfig.elements.constellations,
					lineStyle: { ...configuration.constellations.lineStyle, stroke: celestialConfig.color.outline_color },
				},
				mw: {
					...configuration.mw,
					show: celestialConfig.elements.milkyWay,
					style: { ...configuration.mw.style, fill: celestialConfig.color.tertiary_color },
				},
				lines: {
					...config.lines,
					graticule: {
						...config.lines.graticule,
						show: celestialConfig.elements.grid,
						// stroke: celestialConfig.color.outline_color,
					}
				},
			});
			// d3Celestial.date(celestialConfig.date.toDate());
			// d3Celestial.location([celestialConfig.location.lat, celestialConfig.location.lng]);
			// const selectedDate = moment(celestialConfig.date);
			const selectedDate = moment(celestialConfig.date).startOf('day').add(12, 'hours').toDate();
			d3Celestial.skyview({ date: selectedDate, location: [celestialConfig.location.lat, celestialConfig.location.lng] }) // timezone: offsets
		}
	}, [d3Celestial, celestialConfig, configuration]);


	const handleOptionChange = (options) => {
		setSelectedOptions(options);
	};

	const handleCelestialConfigChange = (config) => {
		setCelestialConfig(config);
	};

	const handleLayoutChange = (selectedLayout) => {
		const zoomBy = (selectedLayout && selectedLayout.label === 'layout_4') ? 1.85 : -1.85;
		let canvasWidth = (selectedLayout && selectedLayout.label === 'layout_4') ? 690 : 375;

		if (isDownXSS) { canvasWidth = (frameWidthMobile / frameWidthLG) * canvasWidth; }
		else if (isDownXS) { canvasWidth = (frameWidthTablet / frameWidthLG) * canvasWidth; }
		else if (isDownLG) { canvasWidth = (frameWidth / frameWidthLG) * canvasWidth; }

		// console.log("canvasWidth : ", canvasWidth);
		// const projection = (selectedLayout && selectedLayout.label === 'layout_4') ? 'cassini' : 'airy';
		// const projectionRatio = (selectedLayout && selectedLayout.label === 'layout_4') ? 0.7 : 1;
		if (zoomBy !== zoomFactor) {
			// console.log("projectionRatio : ", projectionRatio);
			// console.log(d3Celestial.metrics());
			// d3Celestial.reproject({ projectionRatio });
			/* d3Celestial.apply({
				...config,
				projectionRatio: projectionRatio
			}); */
			d3Celestial.resize({ width: canvasWidth });
			d3Celestial.zoomBy(zoomBy);
			d3Celestial.redraw();
			// d3Celestial.reload(config);
			/* setTimeout(() => {
				// d3Celestial.resize({ width: 0 });
				// d3Celestial.redraw();
				// d3Celestial.reload({
				// 	...config,
				// 	projectionRatio: projectionRatio
				// });
				// d3Celestial.resize({ width: canvasWidth })
			}, 1000); */
		}
		setZoomFactor(zoomBy);
	};

	const setShape = () => {
		switch (selectedOptions.shape.label) {
			case 'smCircle'	: return <SMCircle bgColor={celestialConfig.color.primary_color} outlineColor={celestialConfig.color.tertiary_color} />;
			case 'smHeart'	:	return <SMHeart bgColor={celestialConfig.color.primary_color} outlineColor={celestialConfig.color.tertiary_color} />;
			case 'smStar'		:	return <SMStar bgColor={celestialConfig.color.primary_color} outlineColor={celestialConfig.color.tertiary_color} />;
			case 'smHome'		:	return <SMHome bgColor={celestialConfig.color.primary_color} outlineColor={celestialConfig.color.tertiary_color} />;
			default					: return <SMCircle bgColor={celestialConfig.color.primary_color} outlineColor={celestialConfig.color.tertiary_color} />
		}
	};

	const evaluatePrice = () => {
		let price = 69;
		if (productDetails.sizes[selectedOptions.size]) {
			switch (selectedOptions.purchaseType) {
				case 'print'	: price = productDetails.sizes[selectedOptions.size].price;				break;
				case 'pdf'		: price = productDetails.sizes[selectedOptions.size].pdf_price;		break;
				default				: price = productDetails.sizes[selectedOptions.size].price;				break;
			}
		}
		return price;
	};

	/**
	 * Open product confirm dialog
	 * 
	 * @param {*} index 
	 */
	const openConfirmProductDialog = () => {
		setConfirmProductDialog({ open: true, data: {
			size: productDetails.sizes[selectedOptions.size],
			text: selectedOptions.text,
			date: moment(celestialConfig.date).format('LL'),
			purchaseType: selectedOptions.purchaseType,
			price: evaluatePrice(),
			type: STAR_MAP_LABEL,
		}});
	};

	/**
	 * Generate a PDF of poster preview
	 */
 	const generatePdf = async () => {
		const group = await drawDOM(posterRef.current, {
			/* paperSize: "A4" */
			scale: isDesktop ? 1 : 2,
			keepTogether: true,
			// _destructive: true
		});
		const pdfDataUri = await exportPDF(group, { imgDPI: 400 });
		const imgDataUri = await exportImage(group);
		return { pdfDataUri, imgDataUri };
	};

	/**
	 * Add product to cart
	 * 
	 * @param {String} dataUrls 
	 */
	 const addToCart = async (dataUrls) => {
		const pdfFile = dataURIToBlob(dataUrls.pdfDataUri);
		const imageFile = dataURIToBlob(dataUrls.imgDataUri);
		const formData = new FormData();
		formData.append('file', pdfFile, 'pdf_file.pdf');
		formData.append('image_file', imageFile, 'image_file.png');
		const postData = {
			product_id		: productDetails.id,
			product_label	: productDetails.label,
			color					: selectedOptions.color,
			layout				: selectedOptions.layout,
			purchaseType	: selectedOptions.purchaseType,
			shape					: selectedOptions.shape,
			size					: productDetails.sizes[selectedOptions.size],
			text					: selectedOptions.text,
			elements			: celestialConfig.elements,
			location			: celestialConfig.location,
			date					: moment(celestialConfig.date).format('LL'),
		};
		formData.append('data', JSON.stringify(postData));
		// console.log("postData : ", postData);
		try {
			const isLoggedIn = AuthService.getAuth();
			if (!isLoggedIn) {
				updateLoginCart({ forCart: true, cart: formData });
				history.push('/signin');
				return false;
			}
			// setLoading(true);
			const response = await API.post('cart', formData, { headers: {'Content-Type': 'multipart/form-data'} });
			// const response = await API.post('cart', postData);
			setProcessing(false);
			if (response.data.success) {
				incrementCartCount();
				handleSnackToogle(response.data.message);
				history.push('/cart');
			}
		} catch (error) {
			console.log(dataUrls);
			console.log("ERROR in addToCart : ", error);
			setProcessing(false);
			const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
			handleSnackToogle(errorMsg);
		}
	};

	/**
	 * Handle Product Confirm dialog
	 * 
	 * @param {*} data 
	 */
	const handleProductConfirmClose = async (proceed) => {
		setConfirmProductDialog({ open: false, data: {} });
		if (proceed) {
			try {
				setProcessing(true);
				const dataUrls = await generatePdf();
				// console.log(dataUrls.pdfDataUri);
				addToCart(dataUrls);
			} catch (error) {
				setProcessing(false);
				console.log('ERROR in handleProductConfirmClose : ', error)
			}
		}
	};

	const setContainerClass = () => {
		// console.log(selectedOptions.layout);
		let classNames = classes.posterPreviewContainer;
		if (productDetails.sizes[selectedOptions.size]) {
			classNames = clsx(classes.posterPreviewContainer, classes[productDetails.sizes[selectedOptions.size].class], classes[selectedOptions.layout.label]);
		}
		return classNames;
	};
	
	const setLayoutClass = (orginalClass, suffix) => {
		// console.log(selectedOptions.layout);
		if (selectedOptions.layout) {
			if (suffix === 'celestialmap' && selectedOptions.layout.label === 'layout_4') {
				return clsx(orginalClass, classes[`${selectedOptions.layout.label}_${suffix}`], 'full-poster-map');
			}
			return clsx(orginalClass, classes[`${selectedOptions.layout.label}_${suffix}`]);
		}
		return orginalClass;
	};

	/**
	 * Handle info dialog toggle
	 */
	const handleInfoDialogToogle = () => {
		setInfoDialogOpen(infoDialogOpen => !infoDialogOpen);
	};

	const handleBottombarToogle = () => {
		setOpenBottombar(openBottombar => !openBottombar);
	};

	const handleSnackToogle = (message) => {
		setSnack(snack => ({ open: !snack.open, message: message || '' }));
	};

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<div className={classes.container}>
					{isDesktop ? (
						<div className={classes.editingOptionsColumn}>
							<Button
								variant="outlined"
								startIcon={<InfoIcon className={classes.infoIcon} />}
								onClick={handleInfoDialogToogle}
								className={classes.guideBtn}
							>
								Guide
							</Button>
							{!loading ? (
								<StarMapOptionsDesktop
									defautCelestialConfig={celestialConfig}
									defaultOptions={selectedOptions}
									onOptionChange={handleOptionChange}
									onCelestialConfigChange={handleCelestialConfigChange}
									productDetails={productDetails}
									onLayoutChange={handleLayoutChange}
								/>
							) : (
								<div className={classes.skeletonConatiner}>
									<Skeleton variant="rect" className={classes.topSkeleton} animation="wave" />
									<Skeleton variant="rect" className={classes.bottomSkeleton} animation="wave" />
								</div>
							)}
							<div className={classes.addToCartContainer}>
								<AddToCartButton
									openConfirmProductDialog={openConfirmProductDialog}
									evaluatePrice={evaluatePrice}
									processing={processing}
								/>
							</div>
						</div>
					) : (
						<div className={classes.bottomSidebar}>
							{openBottombar ? (
								<StarMapOptionsMobile
									defautCelestialConfig={celestialConfig}
									defaultOptions={selectedOptions}
									onOptionChange={handleOptionChange}
									onCelestialConfigChange={handleCelestialConfigChange}
									productDetails={productDetails}
									onLayoutChange={handleLayoutChange}
								/>
							) : null}
							<Paper className={classes.addToCartContainer}>
								<AddToCartButton
									openConfirmProductDialog={openConfirmProductDialog}
									evaluatePrice={evaluatePrice}
									processing={processing}
								/>
							</Paper>
						</div>
					)}

					<div className={classes.posterPreviewColumn}>
						{posterLoading && <Skeleton variant="rect" className={classes[productDetails.sizes[selectedOptions.size].class]} animation="wave" />}
						<Paper
							ref={posterRef}
							id="starmap-poster-preview"
							className={setContainerClass()}
							style={{
								backgroundColor: celestialConfig.color.primary_color,
								color: celestialConfig.color.text_color,
								display: loading ? 'none' : 'block'
							}}
							elevation={3}
						>
							<div className={setLayoutClass(classes.posterframe, 'frame')}></div>
							{selectedOptions.layout.label === 'layout_2' && 
								<div className={classes.shapeMask} style={{ backgroundColor: celestialConfig.color.primary_color }} />
							}
							{includesTitle.includes(selectedOptions.layout.label) &&
								<TitleComponent
									className={setLayoutClass(classes.infoTitles, 'title')}
									selectedOptions={selectedOptions}
									setLayoutClass={setLayoutClass}
									isDownXS={isDownXS}
									isDownXSS={isDownXSS}
									isDownLG={isDownLG}
								/>}
							<div className={setLayoutClass(classes.choosenShape, 'choosenShape')}>
								<div className={classes.dynamicShape}>
										{selectedOptions.layout.label === 'layout_4' ? null : setShape()}
								</div>
								{celestialConfig.color.label === 'white_multicolor_white' && <div className={selectedOptions.layout.label === "layout_4" ? "star-editor-gradient gradient-layout-4" : 'star-editor-gradient'} />}
								<div className={setLayoutClass(classes.celestialmap, 'celestialmap')} id="celestial-map"></div>
							</div>
							<div className={setLayoutClass(classes.infobox, 'infobox')}>
								<div className={selectedOptions.layout.label === "layout_2" && selectedOptions.text.message ? clsx(classes.textWrapLeft, classes.layout_2_textWrapLeft) : classes.textWrapLeft}>
									<Typography  className={setLayoutClass(classes.cityText, 'cityText')} variant="inherit">{selectedOptions.text.placeText}</Typography>
									<Typography className={classes.dateText}>{moment(celestialConfig.date).format('LL')}</Typography>
									<Typography className={classes.dirText}>{convertDMS(celestialConfig.location.lat, celestialConfig.location.lng)}</Typography>
								</div>

								{(selectedOptions.layout.label === "layout_2" && selectedOptions.text.message) && 
									<div className={setLayoutClass(classes.textWrapRight, 'textWrapRight')}>
										<Typography className={classes.customMessage}>{selectedOptions.text.message}</Typography>
									</div>
								}
							</div>
						</Paper>

						{!isDesktop &&
								<div className={classes.toggleBtns}>
									<IconButton aria-label="guide" onClick={handleInfoDialogToogle} className={classes.guideIcon}>
										<InfoIcon />
									</IconButton>
									<Button
										variant="outlined"
										startIcon={openBottombar ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
										onClick={handleBottombarToogle}
										className={classes.guideBtn}
									>
										Show Editor
									</Button>
								</div>
							}
					</div>
				</div>
				{/* <Divider className={classes.sectionDivider} orientation="horizontal" variant="middle" /> */}
			</div>

			<EditorInfoGuideDialog
				open={infoDialogOpen}
				onClose={handleInfoDialogToogle}
			/>
			<ConfirmProductDialog
				open={confirmProductDialog.open}
				onClose={handleProductConfirmClose}
				dialogData={confirmProductDialog.data}
			/>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={snack.open}
				onClose={() => handleSnackToogle()}
				message={snack.message}
				autoHideDuration={2000}
			/>
		</div>
	);
};

const TitleComponent = ({ className, selectedOptions, isDownXS, isDownXSS, isDownLG }) => {
	const classes = useStyles();

	const setFontSize = (length) => {
		let fontSize = 26;
		if (length > 30 && length < 40) { fontSize = 19; }
		else if (length >= 40) { fontSize = 16; }

		if (isDownXSS) { fontSize = (frameWidthMobile / frameWidthLG) * fontSize; }
		else if (isDownXS) { fontSize = (frameWidthTablet / frameWidthLG) * fontSize; }
		else if (isDownLG) { fontSize = (frameWidth / frameWidthLG) * fontSize; }
		return fontSize;
	};

	const setSubTitleFontSize = (length) => {
		let fontSize = 24;
		if (length > 40 && length < 55) { fontSize = 20; }
		else if (length >= 55) { fontSize = 16; }

		if (isDownXSS) { fontSize = (frameWidthMobile / frameWidthLG) * fontSize; }
		else if (isDownXS) { fontSize = (frameWidthTablet / frameWidthLG) * fontSize; }
		else if (isDownLG) { fontSize = (frameWidth / frameWidthLG) * fontSize; }
		return fontSize;
	};

	return (
		<div className={className}>
			<Typography
				className={classes.subtitleFirst}
				variant="subtitle1"
				style={{ fontSize: setSubTitleFontSize(selectedOptions.text.subTitle.length) }}
				>
					{selectedOptions.text.subTitle}
				</Typography>
			<Typography
				variant="h5"
				className={classes.maintitle}
				style={{ fontSize: setFontSize(selectedOptions.text.title.length) }}
			>
				{selectedOptions.text.title}
			</Typography>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateLoginCart: cart => dispatch(updateLoginCart(cart)),
		incrementCartCount: cart => dispatch(incrementCartCount(cart)),
	}
};

export default connect(null, mapDispatchToProps)(StarMap);
