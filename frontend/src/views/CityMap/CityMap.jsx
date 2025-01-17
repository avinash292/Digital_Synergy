import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
// import html2canvas from 'html2canvas';
import { connect } from 'react-redux';
// import jsPDF from "jspdf";
import { drawDOM, exportPDF } from "@progress/kendo-drawing";

// import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Snackbar from '@material-ui/core/Snackbar';
// import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import InfoIcon from '@material-ui/icons/Info';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import StarIcon from '@material-ui/icons/Star';
import SchoolIcon from '@material-ui/icons/School';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import RingIcon from 'icons/Ring';
import PlaneIcon from 'icons/Plane';
import SkiIcon from 'icons/Ski';

import useStyles from './CityMapStyle';
import { CityMapOptionsDesktop, CityMapOptionsMobile } from '../../components/CityMapOptions';
// import { SMCircle, SMHeart } from '../../components/StarMapShapes';
import EditorInfoGuideDialog from '../../components/EditorInfoGuideDialog';
import ConfirmProductDialog from '../../components/ConfirmProductDialog';
import AddToCartButton from '../../components/AddToCartButton';
import API from '../../axios/axiosApi';
import { CITY_MAP_LABEL, MAPBOX_ACCESS_TOKEN, COMMON_ERR_MSG } from '../../config';
import AuthService from '../../services/authService';
import { updateLoginCart, incrementCartCount } from '../../redux/actions';
import { CMHeart, CMStar, CMHome, CMCircle } from '../../components/CityMapShapes';
// import Guide from '../../components/Guide';
import { dataURIToBlob } from '../../utils/formatter';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// mapbox://styles/lwel7/ck4ip452d0e3r1cmsr89dd75f
const defaultColors = [
	{ color_url: "mapbox://styles/lwel7/ck4ip452d0e3r1cmsr89dd75f", id: 7, image: "navy.png", is_active: true, label: "navy", name: "Navy", product_id: 1, primary_color: null, secondary_color: "#ffffff" },
];

const defautMapConfig = {
	location: {
		lat: 25.7616798,
		lng: -80.1917902,
	}, // [31.1471, 75.3412]
	color: defaultColors[0],
	// icon: { key: null, size: 30, color: '#000000' }
	icons: [],
};
const navControl = new mapboxgl.NavigationControl({ showCompass: false });

const frameWidthLG = 500, frameWidth = 430, frameWidthTablet = 390, frameWidthMobile = 280; // 480 300;

const markerIcons = [
	{ key: 'heart', Icon: FavoriteIcon },
	{ key: 'home', Icon: HomeRoundedIcon },
	{ key: 'star', Icon: StarIcon },
	{ key: 'rings', Icon: RingIcon },
	{ key: 'airplane', Icon: PlaneIcon },
	{ key: 'school', Icon: SchoolIcon },
	{ key: 'ski', Icon: SkiIcon },
];

const CityMap = ({ history, updateLoginCart, incrementCartCount }) => {
	const classes = useStyles();

	const defaultSizes = [
		{ id: 4, class: "size_30_40", currency: "USD", label: "30_40", name: "30x40cm / 12x16inch", pdf_price: 15, price: 39, product_id: 1 },
	];
	const defaultShapes = [
		{ id: 0, image: "no-shape.png", is_active: true, label: "cmNoShape", name: "No Shape" },
		{ id: 9, image: "cmCircle.png", is_active: true, label: "cmCircle", name: "Circle", product_id: 1 },
	];
	const defaultLayouts = [
		{ id: 6, image: "streetmap1.png", is_active: true, label: "layout_1", name: "Layout 1", product_id: 1 },
	];

	const defaultOptions = {
		shape: defaultShapes[0],
		layout: defaultLayouts[0],
		size: 0,
		purchaseType: 'print',
		text: {
			title: 'Miami',
			subtitle: 'United States',
			coordinates: `25.762°N / 80.192°W`,
			updateCoordinates: true,
			message: ''
		},
	};

	const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
	const [mapConfig, setMapConfig] = useState(defautMapConfig);
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const [confirmProductDialog, setConfirmProductDialog] = useState({ open: false, data: {} });
	const [productDetails, setProductDetails] = useState({
		shapes: defaultShapes,
		layouts: defaultLayouts,
		colors: defaultColors,
		sizes: defaultSizes,
	});
	const [loading, setLoading] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [mapState, setMapState] = useState(null);
	const [markerState, setMarkerState] = useState([]);
	const [navControlState, setNavControlState] = useState(null);
	const [openBottombar, setOpenBottombar] = useState(false);
	// const [scale, setScale] = useState(1);
	// const [scalePostion, setScalePostion] = useState({ left: 0, top: 0 });
	const [snack, setSnack] = useState({ open: false, message: '' });

	const mapRef 					= useRef(null);
	const heartIconRef 		= useRef(null);
	const homeIconRef 		= useRef(null);
	const starIconRef 		= useRef(null);
	const ringsIconRef 		= useRef(null);
	const airplaneIconRef = useRef(null);
	const schoolIconRef 	= useRef(null);
	const skiIconRef 			= useRef(null);
	const elementRef 			= useRef(null);
	const posterRef 			= useRef(null);

	const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'), { defaultMatches: true });
	const isDownLG 	= useMediaQuery(theme => theme.breakpoints.down('lg'), { defaultMatches: true });
	const isDownXS 	= useMediaQuery(theme => theme.breakpoints.down('xs'), { defaultMatches: true });
  const isDownXSS = useMediaQuery('(max-width: 430px)');


	useEffect(() => {
		const fetchCityMapOptions = async () => {
			try {
				setLoading(true);
				const response = await API.get('products/' + CITY_MAP_LABEL);
				if (response.data.success && response.data.data && response.data.data.product_details) {
					const product = response.data.data.product_details;
					setSelectedOptions(selectedOptions => ({
						...selectedOptions,
						shape: product.shapes.length ? product.shapes[0] : selectedOptions.shape,
						layout: product.layouts.length ? product.layouts[0] : selectedOptions.layout,
						color: product.colors.length ? product.colors[0] : selectedOptions.color,
					}));
					setMapConfig(mapConfig => ({
						...mapConfig,
						color: product.colors.length ? product.colors[0] : mapConfig.color,
						// icon: { ...mapConfig.icon, color: product.colors.length ? product.colors[0].secondary_color : mapConfig.icon.color },
					}));
					setProductDetails(product);
					setLoading(false);
				} else if (response.data.success && !response.data.data.product_details) {
					setLoading(false);
					// handleSnackToogle("Product don't exists!");
					return history.push('/');
				} else {
					setLoading(false);
				}
			} catch (error) {
				console.log("ERROR in fetchCityMapOptions : ", error);
				setLoading(false);
				const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
				handleSnackToogle(errorMsg);
			}
		};
		fetchCityMapOptions();

		const renderCityMap = () => {
			const map = new mapboxgl.Map({
				container: mapRef.current	, // container ID
				// style: 'mapbox://styles/mapbox/streets-v11', // style URL
				// style: 'mapbox://styles/lwel7/ckkcxqbih0kpg17nm7isz8hbw', // style URL
				style: defautMapConfig.color.color_url, // style URL
				center: [defautMapConfig.location.lng, defautMapConfig.location.lat], // starting position [lng, lat]
				zoom: 9, // starting zoom
				scrollZoom: false,
				minZoom: 2,
				maxZoom: 15,
				attributionControl: true,
				preserveDrawingBuffer: true,
				trackResize: true,
			});
			map.addControl(navControl, 'top-left');
			setNavControlState(navControl);
			map.on('moveend', () => {
				const lat = map.getCenter().lat.toFixed(4), lng = map.getCenter().lng.toFixed(4);			
				setMapConfig(mapConfig => ({
					...mapConfig,
					location: {
						...mapConfig.location,
						lng,
						lat,
						zoom: map.getZoom().toFixed(2)
					}
				}));
			});
			/* map.on('render', function() {
				console.log(map.getCanvas().toDataURL());
			}); */

			setMapState(map);
		};
		renderCityMap();
	}, [history]);


	const handleOptionChange = (options) => {
		// console.log("options : ", options);
		setSelectedOptions(options);		
	};

	const handleMapConfigChange = (config, action, iconIndex) => {
		setMapConfig(config);
		if (mapState) {
			if (action === 'map') {
				mapState.setCenter([config.location.lng, config.location.lat]);
				mapState.setStyle(config.color.color_url);
				// setMapConfig(config=> ({ ...config, icon: { ...config.icon, color: config.color.secondary_color } }));
			} else if (action === 'add_marker_icon') {
				// if (markerState) { markerState.remove(); }
				const newIcon = config.icons[iconIndex];
				if (newIcon.key) {
					let iconRef = null;
					switch (newIcon.key) {
						case 'heart'		: iconRef = heartIconRef;			break;
						case 'home'			: iconRef = homeIconRef;			break;
						case 'star'			: iconRef = starIconRef;			break;
						case 'rings'		: iconRef = ringsIconRef;			break;
						case 'airplane'	: iconRef = airplaneIconRef;	break;
						case 'school'		: iconRef = schoolIconRef;		break;
						case 'ski'			: iconRef = skiIconRef;				break;
						default					: iconRef = heartIconRef; 		break;
					}

					const marker = new mapboxgl.Marker({ element: iconRef.current, draggable: true, color: 'red' })
						.setLngLat([config.location.lng, config.location.lat])
						.addTo(mapState);
					setMarkerState(markerState => ([ ...markerState, marker ]));
				}
			} else if (action === 'remove_marker_icon') {
				// if (markerState) { markerState.remove(); }
				if (markerState.length) { markerState[iconIndex].remove(); }
				const iconMarkerState = markerState;
				iconMarkerState.splice(iconIndex, 1);
				setMarkerState(iconMarkerState);
			}
		}
	};

	const handleSizeChange = () => {
		if (mapState) {
			mapState.resize();
			mapState.triggerRepaint();
			setTimeout(() => {
				mapState.resize();
				mapState.triggerRepaint();
			}, 500);
		}
	};

	/**
	 * Handle info dialog toggle
	 */
	const handleInfoDialogToogle = () => {
		setInfoDialogOpen(infoDialogOpen => !infoDialogOpen);
	};

	/* const setShape = () => {
		switch (selectedOptions.shape) {
			case 'smCircle'	: return <SMCircle bgColor={mapConfig.color.primary_color} />;
			case 'smHeart'	:	return <SMHeart bgColor={mapConfig.color.primary_color} />;
			default					: return <SMCircle bgColor={mapConfig.color.primary_color} />
		}
	}; */

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
			purchaseType: selectedOptions.purchaseType,
			price: evaluatePrice(),
			type: CITY_MAP_LABEL,
			layout: selectedOptions.layout,
		}});
	};

	/**
	 * Generate a PDF of poster preview
	 */
	const generatePdf = async () => {
		await mapState.removeControl(navControlState);

		// console.log(mapState.getCanvas().toDataURL());
		const input = document.getElementById('citymap-poster-preview');
		const posterHeight = input.clientHeight;
		const posterWidth = input.clientWidth;

		const group = await drawDOM(posterRef.current, {
			/* paperSize: "A4" */
			scale: isDesktop ? 2 : 4,
			keepTogether: true,
			// _destructive: true
		});
		const pdfDataUri = await exportPDF(group, { imgDPI: 600 });
		// const imgDataUri = await exportImage(group, { imgDPI: 300 });
		// console.log(imgDataUri);
		setTimeout(() => {
			mapState.addControl(navControl, 'top-left');
		}, 1000);
		return { pdfDataUri, posterHeight, posterWidth };

		// const input = document.getElementById('citymap-poster-preview');
		// // console.log(input);
		// // console.log(mapState);
		// // console.log("==> ", mapState.getCanvas().toDataURL());
		// mapState.removeControl(navControlState);
		// html2canvas(input, { scrollY: -window.scrollY }).then((canvas) => { // mapRef.current
		// 	const imgData = canvas.toDataURL('image/png');
		// 	mapState.addControl(navControl, 'top-left');
		// 	resolve(imgData);
		// 	/* const pdf = new jsPDF();
		// 		// console.log("pdf : ", pdf);
		// 	const imgProps = pdf.getImageProperties(imgData);
		// 	const pdfWidth = pdf.internal.pageSize.getWidth();
		// 	const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

		// 	// const width = pdf.internal.pageSize.getWidth(), height = pdf.internal.pageSize.getHeight();
		// 	pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
		// 	// pdf.output('dataurlnewwindow');
		// 	pdf.save("download.pdf"); */
		// });
	};

	/**
	 * Add product to cart
	 * 
	 * @param {String} dataUrls 
	 */
	const addToCart = async (dataUrls) => {
		// console.log(dataUrls);
		// return false;
		const pdfFile = dataURIToBlob(dataUrls.pdfDataUri);
		// const imageFile = dataURIToBlob(dataUrls.imgDataUri);
		const formData = new FormData();
		formData.append('file', pdfFile, 'pdf_file.pdf');
		// formData.append('image_file', imageFile, 'image_file.png');
		const postData = {
			product_id		: productDetails.id,
			product_label	: productDetails.label,
			color					: selectedOptions.color,
			layout				: selectedOptions.layout,
			purchaseType	: selectedOptions.purchaseType,
			shape					: selectedOptions.shape,
			size					: productDetails.sizes[selectedOptions.size],
			text					: selectedOptions.text,
			icon					: mapConfig.icon,
			location			: mapConfig.location,
			generate_image: true,
			poster_height	: dataUrls.posterHeight,
			poster_width	: dataUrls.posterWidth,
			scale					: dataUrls.scale,
		};
		formData.append('data', JSON.stringify(postData));
		try {
			const isLoggedIn = AuthService.getAuth();
			if (!isLoggedIn) {
				setProcessing(false);
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
				// console.log(dataUrls.imgDataUri);
				addToCart(dataUrls);
			} catch (error) {
				setProcessing(false);
				console.log('ERROR in handleProductConfirmClose : ', error)
			}
		}
	};

	const setFontSize = (length) => {
		let fontSize = 22;
		if (length > 30 && length < 40) {
			fontSize = 19;
		} else if (length >= 40) {
			fontSize = 18;
		}

		if (isDownXSS) { fontSize = (frameWidthMobile / frameWidthLG) * fontSize; }
		else if (isDownXS) { fontSize = (frameWidthTablet / frameWidthLG) * fontSize; }
		else if (isDownLG) { fontSize = (frameWidth / frameWidthLG) * fontSize; }

		return fontSize;
	};

	const setContainerClass = () => {
		let classNames = classes.posterPreviewContainer;
		if (productDetails.sizes[selectedOptions.size]) {
			classNames = clsx(classes.posterPreviewContainer, classes[productDetails.sizes[selectedOptions.size].class], classes[selectedOptions.layout.label]);
		}
		return classNames;
	};

	const setLayoutClass = (orginalClass, suffix) => {
		if (selectedOptions.layout && selectedOptions.layout.label === 'layout_2' && suffix === 'infobox') {
			return clsx(orginalClass, classes[`${selectedOptions.layout.label}_${suffix}`], 'layout-grad');
		} else if (selectedOptions.layout) {
			return clsx(orginalClass, classes[`${selectedOptions.layout.label}_${suffix}`]);
		}
		return orginalClass;
	};

	const handleBottombarToogle = (event) => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
		setOpenBottombar(openBottombar => !openBottombar);
	};

	/**
	 * Set selected shape
	 * @returns Shape Component
	 */
	const setShape = () => {
		switch (selectedOptions.shape.label) {
			// case 'smCircle'	: return <SMCircle bgColor={celestialConfig.color.primary_color} />;
			case 'cmHeart'	:	return <CMHeart />;
			case 'cmStar'		:	return <CMStar />;
			case 'cmHome'		:	return <CMHome />;
			case 'cmCircle'	:	return <CMCircle />;
			default					: return null;
		}
	};

	const setShapeClass = (orginalClass, suffix) => {
		if (selectedOptions.shape) {
			return clsx(orginalClass, classes[`${selectedOptions.shape.label}_${suffix}`]);
		}
		return orginalClass;
	};

	const setSizeClass = (orginalClass, prefix) => {
		if (productDetails.sizes[selectedOptions.size]) {
			return clsx(orginalClass, classes[`${prefix}_${productDetails.sizes[selectedOptions.size].label}`]);
		}
		return orginalClass;
	};

	const handleSnackToogle = (message) => {
		setSnack(snack => ({ open: !snack.open, message: message || '' }));
	};

	/**
	 * Check if icon is already used
	 * 
	 * @param {*} name 
	 * @returns 
	 */
	const checkIfExists = (name) => {
		const exists = mapConfig.icons.filter(item => item.key === name);
		return exists.length ? true : false;
	};

	const setIconMarkerStyle = (name) => {
		let icon = mapConfig.icons.filter(item => item.key === name);
		let style = { fontSize: 30, color: null, height: 30, width: 30, fill: null };
		if (icon.length) {
			icon = icon[0];
			style = { fontSize: icon.size, color: icon.color ? icon.color : null, height: icon.size, width: icon.size, fill: icon.color ? icon.color : null };
		}
		return style;
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
							<CityMapOptionsDesktop
								defautMapConfig={mapConfig}
								defaultOptions={selectedOptions}
								onOptionChange={handleOptionChange}
								onMapConfigChange={handleMapConfigChange}
								productDetails={productDetails}
								markerIcons={markerIcons}
								onSizeChange={handleSizeChange}
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
							<CityMapOptionsMobile
								defautMapConfig={mapConfig}
								defaultOptions={selectedOptions}
								onOptionChange={handleOptionChange}
								onMapConfigChange={handleMapConfigChange}
								productDetails={productDetails}
								markerIcons={markerIcons}
								onSizeChange={handleSizeChange}
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
				
				<div className={classes.posterPreviewGrid} ref={elementRef} >
					<Paper
						ref={posterRef}
						id="citymap-poster-preview"
						className={setContainerClass()}
						elevation={3}
					>
						{selectedOptions.shape.label !== 'cmNoShape' && (
							<div>
								<div className={classes.maskLeft}/>
								<div className={classes.maskRight}/>
								<div className={setSizeClass(classes.maskTop, 'maskTop')}/>
								<div className={setSizeClass(classes.maskBottom, 'maskBottom')}/>
							</div>
						)}

						<div className={setLayoutClass(classes.posterframe, 'frame')}></div>
						<div className={setLayoutClass(classes.cityMapContainer, 'cityMapContainer')} ref={mapRef} />
						<div className={setShapeClass(classes.svgshape, 'shape')}>
							{setShape()}
						</div>
						<div className={setLayoutClass(classes.infobox, 'infobox')}>
							{(selectedOptions.layout.label === "layout_1" && selectedOptions.text.message) && 
								<div className={setLayoutClass(classes.textWrapLeft, 'textWrapLeft')}>
									<Typography className={classes.message}>{selectedOptions.text.message}</Typography>
								</div>
							}
							<div className={(selectedOptions.layout.label === "layout_1" && selectedOptions.text.message) ? clsx(classes.textWrapRight, classes.rightBorder) : classes.textWrapRight}>
								<Typography  className={classes.subtitleSecond}
									variant="h6"
									style={{ fontSize: setFontSize(selectedOptions.text.title.length) }}
								>
									{selectedOptions.text.title}
								</Typography>
								<Typography className={setLayoutClass(classes.subtitleFirst, 'subtitleFirst')} variant="subtitle1">{selectedOptions.text.subtitle}</Typography>
								<Typography className={classes.cortext}>{selectedOptions.text.coordinates}</Typography>
							</div>
						</div>

						<div className={classes.iconwrap}>
							<FavoriteIcon
								className={checkIfExists('heart') ? clsx(classes.activeIcon, classes.markerIcon) : classes.markerIcon}				
								ref={heartIconRef} color="error"
								style={setIconMarkerStyle('heart')}
								// style={{ fontSize: mapConfig.icons.size, color: mapConfig.icons.color ? mapConfig.icons.color : 'red' }}
							/>
							<HomeRoundedIcon
								className={checkIfExists('home') ? clsx(classes.activeIcon, classes.markerIcon) : classes.markerIcon}
								ref={homeIconRef}
								style={setIconMarkerStyle('home')}
								// style={{ fontSize: mapConfig.icons.size, color: mapConfig.icons.color ? mapConfig.icons.color : null }}
							/>
							<StarIcon
								className={checkIfExists('star') ? clsx(classes.activeIcon, classes.markerIcon) : classes.markerIcon}
								ref={starIconRef}
								style={setIconMarkerStyle('star')}
								// style={{ fontSize: mapConfig.icons.size, color: mapConfig.icons.color ? mapConfig.icons.color : null }}
							/>
							<RingIcon
								className={checkIfExists('rings') ? clsx(classes.activeIcon, classes.markerIcon) : classes.markerIcon}
								ref={ringsIconRef}
								style={setIconMarkerStyle('rings')}
								// style={{ fontSize: mapConfig.icons.size, color: mapConfig.icons.color ? mapConfig.icons.color : null }}
							/>
							<PlaneIcon
								className={checkIfExists('airplane') ? clsx(classes.activeIcon, classes.markerIcon) : classes.markerIcon}
								ref={airplaneIconRef}
								style={setIconMarkerStyle('airplane')}
								// style={{ fontSize: mapConfig.icons.size, color: mapConfig.icons.color ? mapConfig.icons.color : null }}
							/>
							<SchoolIcon
								className={checkIfExists('school') ? clsx(classes.activeIcon, classes.markerIcon) : classes.markerIcon}
								ref={schoolIconRef}
								style={setIconMarkerStyle('school')}
								// style={{ fontSize: mapConfig.icons.size, color: mapConfig.icons.color ? mapConfig.icons.color : null }}
							/>
							<SkiIcon
								className={checkIfExists('ski') ? clsx(classes.activeIcon, classes.markerIcon) : classes.markerIcon}
								ref={skiIconRef}
								style={setIconMarkerStyle('ski')}
								// style={{ fontSize: mapConfig.icons.size, color: mapConfig.icons.color ? mapConfig.icons.color : null }}
							/>
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
								{openBottombar ? 'Hide Editor' : 'Show Editor'}
							</Button>
							{/* <div className={classes.emptySpacer} /> */}
						</div>
					}
					{/* COPYRIGHTS */}
					<div className={classes.copyRightContainer}>
						<a className={classes.copyRightlogo} target="_blank" rel="noopener noreferrer nofollow" href="https://www.mapbox.com/" aria-label="Mapbox logo">
							<img className={classes.mapboxLogo} src="/images/logos/mapbox-logo-svg-black.svg" alt="mapbox" />
						</a>
						<div className="copyRightlinks">
							<a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noreferrer">© Mapbox</a>
							<a href="http://www.openstreetmap.org/about/" target="_blank" rel="noreferrer">© OpenStreetMap</a>
							<a href="https://apps.mapbox.com/feedback" target="_blank" rel="noopener nofollow noreferrer" title="Map feedback" aria-label="Map feedback">Improve this map</a>
						</div>
					</div>
					{/* COPYRIGHTS */}
				</div>
			</div>
			{/* <Divider className={classes.sectionDivider} orientation="horizontal" variant="middle" /> */}
			{/* <Guide /> */}

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

const mapDispatchToProps = (dispatch) => {
	return {
		updateLoginCart: cart => dispatch(updateLoginCart(cart)),
		incrementCartCount: cart => dispatch(incrementCartCount(cart)),
	}
};

export default connect(null, mapDispatchToProps)(CityMap);
