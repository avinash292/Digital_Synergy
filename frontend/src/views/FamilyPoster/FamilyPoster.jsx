import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { connect } from "react-redux";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Skeleton from "@material-ui/lab/Skeleton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
// import Divider from '@material-ui/core/Divider';
import IconButton from "@material-ui/core/IconButton";

import InfoIcon from "@material-ui/icons/Info";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import useStyles from "./FamilyPosterStyle";
import {
  FamilyPosterOptionsDesktop,
  FamilyPosterOptionsMobile,
} from "../../components/FamilyPosterOptions";
import ConfirmProductDialog from "../../components/ConfirmProductDialog";
import API from "../../axios/axiosApi";
import {
  FAMILY_POSTER_LABEL,
  COMMON_ERR_MSG,
  FP_POSTER_SIZES,
} from "../../config";
import AddToCartButton from "../../components/AddToCartButton";
import AuthService from "../../services/authService";
import { updateLoginCart, incrementCartCount } from "../../redux/actions";
import {
  FPMan,
  FPPet,
  FPBanners,
} from "../../components/FamilyPosterCharacters";
import { drawDOM, exportPDF, exportImage } from "@progress/kendo-drawing";
// import { drawDOM, exportImage } from "@progress/kendo-drawing";
import { dataURIToBlob } from "../../utils/formatter";
import EditorInfoGuideDialog from "../../components/EditorInfoGuideDialog";
import FPCharacterNameComponent from "../../components/FPCharacterNameComponent";
import { characters } from "./CharacterData";

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

const defaultSelectedCharacter = {
  characterIndex: 0,
  size: "m",
  hairStyle: "bald",
  hairColor: "#000000",
  beard: "none",
  accessory: "none",
  name: "",
  type: 0,
  position: 0,
  skinColor: "#e5a477",
};

const defaultOptions = {
  text: {
    title: "The Jones",
    subtitle: "Family is the heart of a home",
  },
  layout: defaultLayouts[0],
  size: 0,
  purchaseType: "print",
  characters: [defaultSelectedCharacter],
};

const frameWidthLG = FP_POSTER_SIZES.frameWidthLG,
  frameWidth = FP_POSTER_SIZES.frameWidth,
  frameWidthTablet = FP_POSTER_SIZES.frameWidthTablet,
  frameWidthMobile = FP_POSTER_SIZES.frameWidthMobile;
const landscapeSizes = ["40_30", "70_50", "100_70"];

const FamilyPoster = ({ history, updateLoginCart, incrementCartCount }) => {
  const classes = useStyles();

  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [confirmProductDialog, setConfirmProductDialog] = useState({
    open: false,
    data: {},
  });
  const [productDetails, setProductDetails] = useState({
    layouts: defaultLayouts,
    // colors: defaultColors,
    sizes: defaultSizes,
    characters,
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [openBottombar, setOpenBottombar] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "" });

  const posterRef = useRef(null);
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
  });
  const isDownLG = useMediaQuery((theme) => theme.breakpoints.down("lg"), {
    defaultMatches: true,
  });
  const isDownXS = useMediaQuery((theme) => theme.breakpoints.down("xs"), {
    defaultMatches: true,
  });
  const isDownXSS = useMediaQuery("(max-width: 430px)");

  useEffect(() => {
    const fetchCoordinatePosterOptions = async () => {
      try {
        setLoading(true);
        const response = await API.get("products/" + FAMILY_POSTER_LABEL);
        if (
          response.data.success &&
          response.data.data &&
          response.data.data.product_details
        ) {
          const product = response.data.data.product_details;
          //console.log("PROD", product, selectedOptions);
          setSelectedOptions((selectedOptions) => ({
            ...selectedOptions,
            layout: product.layouts.length
              ? product.layouts[0]
              : selectedOptions.layout,
            color: product.layouts.length
              ? product.colors[0]
              : selectedOptions.color,
          }));
          setProductDetails({ ...product, characters });
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
    // console.log("options : ", options);
    setSelectedOptions(options);
  };

  /**
   * Handle info dialog toggle
   */
  const handleInfoDialogToogle = () => {
    setInfoDialogOpen((infoDialogOpen) => !infoDialogOpen);
  };

  const setContainerClass = () => {
    let classNames = classes.posterPreviewContainer;
    if (productDetails.sizes[selectedOptions.size]) {
      classNames = clsx(
        classes.posterPreviewContainer,
        classes[productDetails.sizes[selectedOptions.size].class]
      );
    }
    // console.info("SCC", classNames);
    return classNames + " k-pdf-export";
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
        text: selectedOptions.text,
        purchaseType: selectedOptions.purchaseType,
        price: evaluatePrice(),
        type: FAMILY_POSTER_LABEL,
        layout: selectedOptions.layout.label,
      },
    });
  };

  /**
   * Generate a PDF of poster preview
   */
  const generatePdf = async () => {
    const input = document.getElementById("coordinate-poster-preview");
    const posterHeight = input.clientHeight;
    const posterWidth = input.clientWidth;

    const isLandscape =
      productDetails.sizes[selectedOptions.size] &&
      landscapeSizes.includes(productDetails.sizes[selectedOptions.size].label)
        ? true
        : false;
    let scale = 1;
    if (isDesktop) {
      scale = isLandscape ? 2 : 1;
    } else {
      scale = isLandscape ? 3 : 2;
    }
    const group = await drawDOM(input, {
      scale: scale,
      keepTogether: true,
      // fit: false,
      // _destructive: true
    });
    const pdfDataUri = await exportPDF(group, { imgDPI: 400 });
    const imgDataUri = await exportImage(group, { imgDPI: 400 });

    return { pdfDataUri, imgDataUri, posterHeight, posterWidth, scale };
  };

  /**
   * Add product to cart
   *
   * @param {String} dataUrls
   */
  const addToCart = async (dataUrls) => {
    const formData = new FormData();
    const pdfFile = dataURIToBlob(dataUrls.pdfDataUri);
    const imageFile = dataURIToBlob(dataUrls.imgDataUri);
    formData.append("file", pdfFile, "pdf_file.pdf");
    formData.append("image_file", imageFile, "image_file.png");

    const postData = {
      product_id: productDetails.id,
      product_label: productDetails.label,
      layout: selectedOptions.layout,
      purchaseType: selectedOptions.purchaseType,
      size: productDetails.sizes[selectedOptions.size],
      text: selectedOptions.text,
      generate_pdf: false,
      poster_height: dataUrls.posterHeight,
      poster_width: dataUrls.posterWidth,
      scale: dataUrls.scale,
    };
    // console.log("postData :", postData); return;
    formData.append("data", JSON.stringify(postData));

    try {
      const isLoggedIn = AuthService.getAuth();
      if (!isLoggedIn) {
        setProcessing(false);
        updateLoginCart({ forCart: true, cart: formData });
        history.push("/signin");
        return false;
      }
      // console.log("API CART POST DATA", postData);
      const response = await API.post("cart", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // const response = await API.post('cart', postData);
      // console.log("API CART RES", response);
      setProcessing(false);
      if (response.data.success) {
        incrementCartCount();
        handleSnackToogle(response.data.message);
        history.push("/cart");
      }
    } catch (error) {
      // console.log(dataUrls);
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
        const dataUrls = await generatePdf();
        // console.log(dataUrls.pdfDataUri);
        // console.log(dataUrls.imgDataUri);
        addToCart(dataUrls);
      } catch (error) {
        setProcessing(false);
        console.log("ERROR in handleProductConfirmClose : ", error);
      }
    }
  };

  const handleBottombarToogle = () => {
    setOpenBottombar((openBottombar) => !openBottombar);
  };

  const exists = (prop, value, data) => {
    if (data === undefined) return false;

    return data.some(function(obj) {
      return prop in obj && obj[prop] === value;
    });
  };

  const isCombo = (value, data) => {
    if (!data) {
      return false;
    }

    return data.some((obj) => {
      return obj.label === value ? obj.isCombo : false;
    });
  };

  const setFontSize = (length) => {
    let fontSize = selectedOptions.layout.label === "layout_2" ? 60 : 50;
    if (length >= 18 && length < 20) {
      fontSize = selectedOptions.layout.label === "layout_2" ? 57 : 45;
    } else if (length >= 20) {
      fontSize = selectedOptions.layout.label === "layout_2" ? 50 : 40;
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

  const setLayoutClass = (orginalClass, suffix) => {
    if (selectedOptions.layout) {
      return clsx(
        orginalClass,
        classes[`${selectedOptions.layout.label}_${suffix}`]
      );
    }
    return orginalClass;
  };

  /**
   * Render member character
   *
   * @returns JSX
   */
  const renderCharacters = () => {
    const charsCount = selectedOptions.characters.length;
    const isLandscape =
      productDetails.sizes[selectedOptions.size] &&
      landscapeSizes.includes(productDetails.sizes[selectedOptions.size].label)
        ? true
        : false;

    return selectedOptions.characters.map((char, index) => {
      if (!characters[char.characterIndex]) {
        return null;
      }
      const member = characters[char.characterIndex];

      let accessoryCombo = isCombo(char.accessory, member.accessories);
      let hairStyle = "";
      if (
        member.accessories &&
        exists("label", char.hairStyle, member.comboHairStyles)
      ) {
        hairStyle =
          member.comboHairStyles &&
          exists("label", char.hairStyle, member.comboHairStyles)
            ? char.hairStyle
            : null;
      } else {
        hairStyle =
          member.hairstyles &&
          exists("label", char.hairStyle, member.hairstyles)
            ? char.hairStyle
            : null;
      }
      const options = {
        accessory: exists("label", char.accessory, member.accessories)
          ? char.accessory
          : null,
        isCombo: accessoryCombo ? accessoryCombo : false,
        size: exists("label", char.size, member.sizes) ? char.size : null,
        // hairStyle		: exists("label", char.hairStyle, member.hairstyles) ? char.hairStyle : null,
        hairStyle: hairStyle,
        hairColor: exists("primary_color", char.hairColor, member.hairColors)
          ? char.hairColor
          : null,
        beard: exists("label", char.beard, member.beards) ? char.beard : null,
        name: char.name ? char.name : null,
        label: member.label ? member.label : null,
        type:
          member.types && member.types[char.type]
            ? member.types[char.type].label
            : null,
        skinColor: exists("primary_color", char.skinColor, member.skinColors)
          ? char.skinColor
          : null,
        charsCount,
        isLandscape,
        isDownXSS,
        isDownXS,
        isDownLG,
      };
      let charSvg = (
        <FPMan className={classes.memberCharacter} options={options} />
      );
      //console.info(" BEFORE SVG: ", options, member);
      //console.info(" CHAR EFORE SVG: ", selectedOptions.layout.label);
      switch (member.label) {
        case "man":
          charSvg = (
            <FPMan className={classes.memberCharacter} options={options} />
          );
          break;
        case "dog":
          charSvg = (
            <FPPet className={classes.memberCharacter} options={options} />
          );
          break;
        case "cat":
          charSvg = (
            <FPPet className={classes.memberCharacter} options={options} />
          );
          break;
        default:
          charSvg = (
            <FPMan className={classes.memberCharacter} options={options} />
          );
          break;
      }

      const containerClass =
        options.label === "dog" || options.label === "cat"
          ? classes.petColLayout
          : classes.charColLayout;
      /* style={{ maxWidth: svgContainerWidth }} */
      return (
        <div
          className={setLayoutClass(containerClass, "svgContainer")}
          key={index}
        >
          {options.name && selectedOptions.layout.label === "layout_1" && (
            <FPCharacterNameComponent
              name={options.name}
              isDownXSS={isDownXSS}
              isDownXS={isDownXS}
              isDownLG={isDownLG}
              isLandscape={isLandscape}
              charsCount={charsCount}
              classStyle={
                selectedOptions.layout.label === "layout_1"
                  ? classes.charNameLayout1
                  : classes.charNameLayout2
              }
            />
          )}
          {charSvg}
        </div>
      );
    });
  };

  const handleSnackToogle = (message) => {
    setSnack((snack) => ({ open: !snack.open, message: message || "" }));
  };

  const setSubtitleFontSize = (length) => {
    length = length || 1;
    let fontSize = 34;
    if (length > 10 && length < 20) {
      fontSize = 32;
    } else if (length >= 20 && length < 27) {
      fontSize = 30;
    } else if (length >= 27) {
      fontSize = 28;
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

  /**
   * Set classes for landscape sizes
   *
   * @param {*} orginalClass
   * @param {*} suffix
   */
  const setLandscapeClass = (orginalClass, suffix) => {
    if (
      productDetails.sizes[selectedOptions.size] &&
      landscapeSizes.includes(productDetails.sizes[selectedOptions.size].label)
    ) {
      return clsx(orginalClass, classes[`landscape_${suffix}`]);
    }
    return orginalClass;
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
                <FamilyPosterOptionsDesktop
                  defaultOptions={selectedOptions}
                  onOptionChange={handleOptionChange}
                  productDetails={productDetails}
                  handleSnackToogle={handleSnackToogle}
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
                <FamilyPosterOptionsMobile
                  defaultOptions={selectedOptions}
                  onOptionChange={handleOptionChange}
                  productDetails={productDetails}
                  handleSnackToogle={handleSnackToogle}
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
            {/* style={setColorScheme()}  */}
            <Paper
              ref={posterRef}
              id="coordinate-poster-preview"
              className={setContainerClass()}
              elevation={3}
            >
              <div
                className={setLandscapeClass(
                  classes.posterTopBanner,
                  "posterTopBanner"
                )}
              >
                <FPBanners
                  className={classes.topBanner}
                  topText={selectedOptions.text.title}
                  layout={selectedOptions.layout.label}
                  posterSize={selectedOptions.size}
                  setFont={setFontSize}
                />
              </div>
              <div
                className={
                  classes.memberContainer +
                  " mem_" +
                  selectedOptions.layout.label
                }
              >
                {renderCharacters()}
              </div>
              {selectedOptions.layout.label === "layout_2" &&
              selectedOptions.text.subtitle ? (
                <Typography
                  className={classes.familyQuote}
                  style={{
                    fontSize: setSubtitleFontSize(
                      selectedOptions.text.subtitle.length
                    ),
                  }}
                >
                  {selectedOptions.text.subtitle}
                </Typography>
              ) : null}
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
      <EditorInfoGuideDialog
        open={infoDialogOpen}
        onClose={handleInfoDialogToogle}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginCart: (cart) => dispatch(updateLoginCart(cart)),
    incrementCartCount: (cart) => dispatch(incrementCartCount(cart)),
  };
};

export default connect(null, mapDispatchToProps)(FamilyPoster);
