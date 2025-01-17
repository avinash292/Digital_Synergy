import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";
// import html2canvas from 'html2canvas';
import { connect } from "react-redux";
// import jsPDF from "jspdf";
import { drawDOM, exportPDF, exportImage } from "@progress/kendo-drawing";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Skeleton from "@material-ui/lab/Skeleton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

import InfoIcon from "@material-ui/icons/Info";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import useStyles from "./CoordinatePosterStyle";
import {
  CoordinatePosterOptionsDesktop,
  CoordinatePosterOptionsMobile,
} from "components/CoordinatePosterOptions";
import ConfirmProductDialog from "components/ConfirmProductDialog";
import { toDegreesMinutesAndSeconds } from "utils/formatter";
import API from "../../axios/axiosApi";
import { COORDINATE_POSTER_LABEL, COMMON_ERR_MSG } from "config";
import { convertDMS, dataURIToBlob } from "utils/formatter";
import AddToCartButton from "components/AddToCartButton";
import AuthService from "services/authService";
import { updateLoginCart, incrementCartCount } from "redux/actions";
import EditorInfoGuideDialog from "../../components/EditorInfoGuideDialog";
// import Doc from 'services/docService';

const frameWidthLG = 500,
  frameWidth = 430,
  frameWidthTablet = 400,
  frameWidthMobile = 300;

const CoordinatePoster = ({ history, updateLoginCart, incrementCartCount }) => {
  const classes = useStyles();

  const defaultSizes = [
    {
      id: 7,
      class: "size_30_40",
      currency: "USD",
      label: "30_40",
      name: "30x40cm / 12x16inch",
      pdf_price: 15,
      price: 39,
      product_id: 3,
    },
  ];
  const defaultLayouts = [
    {
      id: 10,
      image: "coordinateLayout1.png",
      is_active: true,
      label: "layout_1",
      name: "Layout 1",
      product_id: 3,
    },
  ];
  const defaultColors = [
    {
      id: 26,
      color_url: null,
      image: null,
      is_active: true,
      label: "yellow_white_white",
      name: "Yellow/White/White",
      outline_color: null,
      primary_color: "#F8D148",
      product_id: 3,
      secondary_color: "#ffffff",
      tertiary_color: null,
      text_color: "#ffffff",
    },
    {
      id: 22,
      is_active: true,
      label: "black_white_white",
      name: "Black/White/White",
      outline_color: null,
      primary_color: "#000000",
      product_id: 3,
      secondary_color: "#ffffff",
      text_color: "#ffffff",
    },
    {
      id: 23,
      color_url: null,
      label: "blackaqua",
      name: "Black-aqua",
      primary_color: "#000000",
      product_id: 3,
      secondary_color: "#24b4be",
    },
  ];

  const defaultOptions = {
    location: {
      lat: 25.7616798,
      lng: -80.1917902,
      place: "Miami",
    }, // [31.1471, 75.3412]
    text: {
      title: "Miami",
      subtitle: "It's a unique experience",
    },
    color: defaultColors[0],
    layout: defaultLayouts[0],
    font: 0,
    size: 0,
    purchaseType: "print",
  };

  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
  const [confirmProductDialog, setConfirmProductDialog] = useState({
    open: false,
    data: {},
  });
  const [productDetails, setProductDetails] = useState({
    layouts: defaultLayouts,
    colors: defaultColors,
    sizes: defaultSizes,
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [openBottombar, setOpenBottombar] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "" });
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const posterRef = useRef(null);
  // const createPdf = (html) => Doc.createPdf(html);

  useEffect(() => {
    const fetchCoordinatePosterOptions = async () => {
      try {
        setLoading(true);
        const response = await API.get("products/" + COORDINATE_POSTER_LABEL);
        if (
          response.data.success &&
          response.data.data &&
          response.data.data.product_details
        ) {
          const product = response.data.data.product_details;
          setSelectedOptions((selectedOptions) => ({
            ...selectedOptions,
            layout: product.layouts.length
              ? product.layouts[0]
              : selectedOptions.layout,
            color: product.layouts.length
              ? product.colors[4]
                ? product.colors[4]
                : product.colors[0]
              : selectedOptions.color,
          }));
          setProductDetails(product);
          setLoading(false);
        } else if (
          response.data.success &&
          !response.data.data.product_details
        ) {
          setLoading(false);
          // handleSnackToogle("Product don't exists!");
          return history.push("/");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log("ERROR in fetchCoordinatePosterOptions : ", error);
        setLoading(false);
        // const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
        // handleSnackToogle(errorMsg);
      }
    };
    fetchCoordinatePosterOptions();
  }, [history]);

  const handleOptionChange = (options) => {
    setSelectedOptions(options);
  };

  const setContainerClass = () => {
    let classNames = classes.posterPreviewContainer;
    if (productDetails.sizes[selectedOptions.size]) {
      classNames = clsx(
        classes.posterPreviewContainer,
        classes[productDetails.sizes[selectedOptions.size].class]
      );
    }
    return classNames;
  };

  const evaluatePrice = () => {
    let price = 69;
    if (productDetails.sizes[selectedOptions.size]) {
      switch (selectedOptions.purchaseType) {
        case "print":
          price = productDetails.sizes[selectedOptions.size].price;
          break;
        case "pdf":
          price = productDetails.sizes[selectedOptions.size].pdf_price;
          break;
        default:
          price = productDetails.sizes[selectedOptions.size].price;
          break;
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
    setConfirmProductDialog({
      open: true,
      data: {
        size: productDetails.sizes[selectedOptions.size],
        text: {
          ...selectedOptions.text,
          coordinates: convertDMS(
            selectedOptions.location.lat,
            selectedOptions.location.lng
          ),
        },
        purchaseType: selectedOptions.purchaseType,
        price: evaluatePrice(),
        type: COORDINATE_POSTER_LABEL,
      },
    });
  };

  /**
   * Generate a PDF of poster preview
   */
  const generatePdf = async () => {
    const group = await drawDOM(posterRef.current, {
      /* paperSize: "A4" */
      scale: isDesktop ? 1 : 2,
      // keepTogether: true,
      // _destructive: true
    });
    const pdfDataUri = await exportPDF(group);
    const imgDataUri = await exportImage(group);
    return { pdfDataUri, imgDataUri };

    // createPdf(bodyRef.current);
    /* return new Promise((resolve, reject) => {
			drawDOM(posterRef.current, { }).then((group) => {
				return exportPDF(group);
			})
			.then((dataUri) => { resolve(dataUri); })
			.catch(err => { reject(err); });

			// const input = document.getElementById('coordinate-poster-preview');
			// html2canvas(input, { scrollY: -window.scrollY, backgroundColor: null, ignoreElements: null }).then((canvas) => {
			// 	const imgData = canvas.toDataURL('image/png');
			// 	resolve(imgData);
			// 	/* const pdf = new jsPDF();
			// 	// console.log("pdf : ", pdf);
			// 	const imgProps = pdf.getImageProperties(imgData);
			// 	const pdfWidth = pdf.internal.pageSize.getWidth();
			// 	const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

			// 	// const width = pdf.internal.pageSize.getWidth(), height = pdf.internal.pageSize.getHeight();
			// 	pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
			// 	// pdf.output('dataurlnewwindow');
			// 	pdf.save("download.pdf");
			// });
		}); */
  };

  /**
   * Add product to cart
   *
   * @param {String} dataUrls
   */
  const addToCart = async (dataUrls) => {
    const pdfFile = dataURIToBlob(dataUrls.pdfDataUri);
    const imageFile = dataURIToBlob(dataUrls.imgDataUri);
    // console.log("file : ", file);

    const formData = new FormData();
    formData.append("file", pdfFile, "pdf_file.pdf");
    formData.append("image_file", imageFile, "image_file.png");

    const postData = {
      product_id: productDetails.id,
      product_label: productDetails.label,
      color: selectedOptions.color,
      layout: selectedOptions.layout,
      purchaseType: selectedOptions.purchaseType,
      size: productDetails.sizes[selectedOptions.size],
      text: selectedOptions.text,
      location: selectedOptions.location,
    };
    formData.append("data", JSON.stringify(postData));
    try {
      const isLoggedIn = AuthService.getAuth();
      if (!isLoggedIn) {
        updateLoginCart({ forCart: true, cart: formData });
        history.push("/signin");
        return false;
      }
      // setProcessing(true);
      const response = await API.post("cart", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProcessing(false);
      if (response.data.success) {
        incrementCartCount();
        handleSnackToogle(response.data.message);
        history.push("/cart");
      }
    } catch (error) {
      console.log("ERROR in addToCart : ", error);
      setProcessing(false);
      const errorMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : COMMON_ERR_MSG;
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
        const dataUrl = await generatePdf();
        // console.log(dataUrl.pdfDataUri);
        // console.log(dataUrl);
        addToCart(dataUrl);
      } catch (error) {
        setProcessing(false);
        console.log("ERROR in handleProductConfirmClose : ", error);
      }
    }
  };

  const handleBottombarToogle = () => {
    setOpenBottombar((openBottombar) => !openBottombar);
  };

  const setLayoutClass = (orginalClass, suffix) => {
    // console.log(selectedOptions.layout);
    if (selectedOptions.layout) {
      return clsx(
        orginalClass,
        classes[`${selectedOptions.layout.label}_${suffix}`]
      );
    }
    return orginalClass;
  };

  const setColorScheme = () => {
    let colorScheme = {
      backgroundColor: selectedOptions.color.primary_color,
      color:
        selectedOptions.color.primary_color === "#000000"
          ? "#ffffff"
          : "#000000",
    };
    return colorScheme;
  };

  const convertDecimalToDMS = (coordinate, cardigan) => {
    const dms = toDegreesMinutesAndSeconds(coordinate, "object");
    let cardinal = "N";
    if (cardigan === "latitude") {
      cardinal = coordinate >= 0 ? "N" : "S";
    } else {
      cardinal = coordinate >= 0 ? "E" : "W";
    }
    return { ...dms, cardinal };
  };

  const renderLayout = () => {
    switch (selectedOptions.layout.label) {
      case "layout_1":
        return (
          <Layout1Component
            convertDecimalToDMS={convertDecimalToDMS}
            selectedOptions={selectedOptions}
          />
        );
      case "layout_2":
        return <Layout2Component selectedOptions={selectedOptions} />;
      case "layout_3":
        return <Layout3Component selectedOptions={selectedOptions} />;
      case "layout_4":
        return (
          <Layout4Component
            convertDecimalToDMS={convertDecimalToDMS}
            selectedOptions={selectedOptions}
          />
        );
      default:
        return (
          <Layout1Component
            convertDecimalToDMS={convertDecimalToDMS}
            selectedOptions={selectedOptions}
          />
        );
    }
  };

  /**
   * Handle info dialog toggle
   */
  const handleInfoDialogToogle = () => {
    setInfoDialogOpen((infoDialogOpen) => !infoDialogOpen);
  };

  const handleSnackToogle = (message) => {
    setSnack((snack) => ({ open: !snack.open, message: message || "" }));
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
                <CoordinatePosterOptionsDesktop
                  defaultOptions={selectedOptions}
                  onOptionChange={handleOptionChange}
                  productDetails={productDetails}
                />
              ) : (
                <div className={classes.skeletonConatiner}>
                  <Skeleton
                    variant="rect"
                    className={classes.topSkeleton}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rect"
                    className={classes.bottomSkeleton}
                    animation="wave"
                  />
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
                <CoordinatePosterOptionsMobile
                  defaultOptions={selectedOptions}
                  onOptionChange={handleOptionChange}
                  productDetails={productDetails}
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
            <Paper
              ref={posterRef}
              id="coordinate-poster-preview"
              className={setContainerClass()}
              style={setColorScheme()}
              elevation={3}
            >
              <div
                className={setLayoutClass(classes.posterframe, "posterframe")}
              ></div>
              <div
                className={setLayoutClass(
                  classes.posterframeDouble,
                  "posterframeDouble"
                )}
              ></div>
              {renderLayout()}
            </Paper>

            {!isDesktop && (
              <div className={classes.toggleBtns}>
                <IconButton
                  aria-label="guide"
                  onClick={handleInfoDialogToogle}
                  className={classes.guideIcon}
                >
                  <InfoIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  startIcon={
                    openBottombar ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
                  }
                  onClick={handleBottombarToogle}
                  className={classes.guideBtn}
                >
                  Show Editor
                </Button>
              </div>
            )}
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack.open}
        onClose={() => handleSnackToogle()}
        message={snack.message}
        autoHideDuration={2000}
      />
    </div>
  );
};

const Layout1Component = ({ convertDecimalToDMS, selectedOptions }) => {
  const classes = useStyles();

  const renderCoordinates = () => {
    const coordinatesDMS = [
      convertDecimalToDMS(selectedOptions.location.lat, "latitude"),
      convertDecimalToDMS(selectedOptions.location.lng, "longitude"),
    ];
    return (
      <div
        className={clsx(
          classes.coordinateContainer,
          classes.coordinateContainerLayout1
        )}
      >
        <DividerInBW
          styleClass={clsx(classes.topDivider, classes.topDividerOne)}
          color={selectedOptions.color.text_color}
        />
        {coordinatesDMS.map((coordinate, index) => (
          <div key={index} className={classes.coordinateContent}>
            <Typography
              className={classes.coordinateText}
              style={{
                color:
                  index === 0
                    ? selectedOptions.color.secondary_color
                    : selectedOptions.color.secondary_color,
              }}
            >
              {`${coordinate.degrees}°`}
            </Typography>
            <Typography
              className={classes.coordinateText}
              style={{
                color:
                  index === 0
                    ? selectedOptions.color.text_color
                    : selectedOptions.color.text_color,
              }}
            >
              {`${coordinate.minutes}'`}
            </Typography>
            <Typography
              className={classes.coordinateText}
              style={{
                color:
                  index === 0
                    ? selectedOptions.color.secondary_color
                    : selectedOptions.color.secondary_color,
              }}
            >
              {`${coordinate.seconds}"`}
            </Typography>
            <Typography
              className={classes.coordinateText}
              style={{
                color:
                  index === 0
                    ? selectedOptions.color.text_color
                    : selectedOptions.color.text_color,
              }}
            >
              {`${coordinate.cardinal}`}
            </Typography>
          </div>
        ))}
        <DividerInBW
          styleClass={clsx(classes.bottomDivider, classes.bottomDividerOne)}
          color={selectedOptions.color.text_color}
        />
      </div>
    );
  };

  return (
    <div>
      <TitleComponent
        selectedOptions={selectedOptions}
        styleClass={classes.titleLayout1}
      />
      {renderCoordinates()}
      <div className={classes.infoTitles}>
        <Typography
          className={classes.subtitleFirst}
          variant="subtitle1"
          style={{ color: selectedOptions.color.text_color }}
        >
          {selectedOptions.text.subtitle}
        </Typography>
      </div>
    </div>
  );
};

const Layout2Component = ({ selectedOptions }) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapLayoutTwo}>
      <TitleComponent
        selectedOptions={selectedOptions}
        styleClass={classes.titleLayout2}
      />
      <div className={classes.infoTitles}>
        <div className={classes.layout2infoTitles}>
          <DividerInBW
            styleClass={clsx(classes.topDivider, classes.topDividerOne)}
            color={selectedOptions.color.text_color}
          />
          <Typography
            className={classes.placeLetter}
            style={{ color: selectedOptions.color.secondary_color }}
          >
            {selectedOptions.location.place
              ? selectedOptions.location.place.charAt(0)
              : "M"}
          </Typography>
          <DividerInBW
            styleClass={clsx(
              classes.bottomDividerOne,
              classes.bottomDividerOne
            )}
            color={selectedOptions.color.text_color}
          />
        </div>
        <Typography
          className={clsx(classes.subtitleFirst, classes.subtitleFirstLayout2)}
          variant="subtitle1"
          style={{ color: selectedOptions.color.text_color }}
        >
          {convertDMS(
            selectedOptions.location.lat,
            selectedOptions.location.lng
          )}
        </Typography>
      </div>
    </div>
  );
};

const Layout3Component = ({ selectedOptions }) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapLayoutThree}>
      <div className={classes.infoTitles}>
        <Typography
          className={classes.placeLetter}
          style={{ color: selectedOptions.color.secondary_color }}
        >
          {selectedOptions.location.place
            ? selectedOptions.location.place.charAt(0)
            : "M"}
        </Typography>
        <div className={classes.layout3InfoWrap}>
          <DividerInBW
            styleClass={clsx(
              classes.topDividerOne,
              classes.topDividerOneMedium
            )}
            color={selectedOptions.color.text_color}
          />
          <TitleComponent
            selectedOptions={selectedOptions}
            styleClass={classes.titleLayout3}
          />
          <Typography
            className={clsx(
              classes.subtitleFirst,
              classes.subtitleFirstLayout3
            )}
            variant="subtitle1"
            style={{ color: selectedOptions.color.text_color }}
          >
            {convertDMS(
              selectedOptions.location.lat,
              selectedOptions.location.lng
            )}
          </Typography>
          <DividerInBW
            styleClass={clsx(
              classes.bottomDividerOne,
              classes.bottomDividerOneMedium
            )}
            color={selectedOptions.color.text_color}
          />
        </div>
      </div>
    </div>
  );
};

const Layout4Component = ({ convertDecimalToDMS, selectedOptions }) => {
  const classes = useStyles();
  const renderL4Coordinates = () => {
    const coordinatesDMS = [
      convertDecimalToDMS(selectedOptions.location.lat, "latitude"),
      convertDecimalToDMS(selectedOptions.location.lng, "longitude"),
    ];
    return (
      <div className={classes.coordinateContainerLayout1}>
        {coordinatesDMS.map((coordinate, index) => (
          <div key={index} className={clsx(classes.coordinateContentLayout4)}>
            <Typography
              className={classes.coordinateTextLayout4}
              style={{
                color:
                  index === 0
                    ? selectedOptions.color.secondary_color
                    : selectedOptions.color.text_color,
              }}
            >
              {`${coordinate.degrees}°`}
            </Typography>
            <Typography
              className={classes.coordinateTextLayout4}
              style={{
                color:
                  index === 0
                    ? selectedOptions.color.text_color
                    : selectedOptions.color.secondary_color,
              }}
            >
              {`${coordinate.minutes}'`}
            </Typography>
            <Typography
              className={classes.coordinateTextLayout4}
              style={{
                color:
                  index === 0
                    ? selectedOptions.color.secondary_color
                    : selectedOptions.color.text_color,
              }}
            >
              {`${coordinate.seconds}"${coordinate.cardinal}`}
            </Typography>
          </div>
        ))}
      </div>
    );
  };
  return <div>{renderL4Coordinates()}</div>;
};

const DividerInBW = ({ styleClass, color }) => {
  color = color || "#ffffff";
  const classes = useStyles();
  return (
    <Divider
      className={clsx(classes.dividerStyle, styleClass)}
      style={{ background: color }}
    />
  );
};

const TitleComponent = ({ selectedOptions, styleClass }) => {
  // const classes = useStyles();
  const isDownLG = useMediaQuery((theme) => theme.breakpoints.down("lg"), {
    defaultMatches: true,
  });
  const isDownXS = useMediaQuery((theme) => theme.breakpoints.down("xs"), {
    defaultMatches: true,
  });
  const isDownXSS = useMediaQuery("(max-width: 430px)");

  const setFontSize = (length) => {
    let fontSize = 28;
    if (length > 30 && length < 40) {
      fontSize = 21;
    } else if (length >= 40) {
      fontSize = 16;
    }

    if (isDownXSS) {
      fontSize = (frameWidthMobile / frameWidthLG) * fontSize;
    } else if (isDownXS) {
      fontSize = (frameWidthTablet / frameWidthLG) * fontSize;
    } else if (isDownLG) {
      fontSize = (frameWidth / frameWidthLG) * fontSize;
    }
    return fontSize;
  };

  return (
    <Typography
      variant="h6"
      className={styleClass}
      style={{
        fontSize: setFontSize(selectedOptions.text.title.length),
        color: selectedOptions.color.text_color,
      }}
    >
      {selectedOptions.text.title
        ? selectedOptions.text.title.toUpperCase()
        : ""}
    </Typography>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginCart: (cart) => dispatch(updateLoginCart(cart)),
    incrementCartCount: (cart) => dispatch(incrementCartCount(cart)),
  };
};

export default connect(null, mapDispatchToProps)(CoordinatePoster);
