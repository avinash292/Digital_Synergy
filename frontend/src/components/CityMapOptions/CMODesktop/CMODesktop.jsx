import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import clsx from 'clsx';
import Container from "@material-ui/core/Container";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStyles from "../CityMapOptionStyle";
import { formatCoordinates } from "../../../utils/formatter";
import {
  PlacesAutocomplete,
  DesignSection,
  TextSection,
  IconSection,
} from "../sections";
import SizeSection from "../../SizeSection";
const CMODesktop = ({
  defaultOptions,
  defautMapConfig,
  onOptionChange,
  onMapConfigChange,
  productDetails,
  markerIcons,
  onSizeChange,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState("placePanel");
  const [mapConfiguration, setMapConfiguration] = useState(defautMapConfig);
  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
  useEffect(() => {
    // console.log("defautMapConfig : ", defautMapConfig);
    setMapConfiguration(defautMapConfig);

    setSelectedOptions((selectedOptions) => ({
      ...selectedOptions,
      text: selectedOptions.text.updateCoordinates
        ? {
            ...selectedOptions.text,
            coordinates: formatCoordinates(
              defautMapConfig.location.lat,
              defautMapConfig.location.lng
            ),
          }
        : selectedOptions.text,
    }));
  }, [defautMapConfig]);
  useEffect(() => {
    onOptionChange(selectedOptions);
  }, [selectedOptions, onOptionChange]);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleShapeChange = (shape) => {
    setSelectedOptions((selectedOptions) => ({ ...selectedOptions, shape }));
  };
  const handleLayoutChange = (layout) => {
    setSelectedOptions((selectedOptions) => ({ ...selectedOptions, layout }));
  };
  const handleSizeChange = (event) => {
    setSelectedOptions((selectedOptions) => ({
      ...selectedOptions,
      size: event.target.value,
    }));
    onSizeChange();
  };
  const handlePlaceSelection = (place) => {
    // console.log("place : ",place);
    const lat = place.geometry.location.lat(),
      lng = place.geometry.location.lng();
    const location = { lat, lng };
    let title = mapConfiguration.location.title,
      subtitle = mapConfiguration.location.subtitle;
    if (place.address_components && place.address_components.length) {
      place.address_components.forEach((component, index) => {
        if (index === 0) {
          title =
            component && component.long_name
              ? component.long_name
              : component.short_name
              ? component.short_name
              : mapConfiguration.location.title;
        }
        if (component.types.includes("country")) {
          subtitle =
            component && component.long_name
              ? component.long_name
              : component.short_name
              ? component.short_name
              : mapConfiguration.location.subtitle;
        }
      });
    } else if (place.formatted_address) {
      title = place.formatted_address;
      subtitle = place.formatted_address;
    }
    onMapConfigChange(
      {
        ...mapConfiguration,
        location,
      },
      "map"
    );
    setMapConfiguration((mapConfiguration) => ({
      ...mapConfiguration,
      location,
    }));

    setSelectedOptions((selectedOptions) => ({
      ...selectedOptions,
      text: {
        ...selectedOptions.text,
        title: title,
        subtitle: subtitle,
        coordinates: formatCoordinates(lat, lng),
      },
    }));
  };
  const handleColorChange = (color) => {
    onMapConfigChange({ ...mapConfiguration, color }, "map");
    setMapConfiguration((mapConfiguration) => ({ ...mapConfiguration, color }));
  };
  const handlePurchaseTypeChange = (type) => {
    setSelectedOptions((selectedOptions) => ({
      ...selectedOptions,
      purchaseType: type,
    }));
  };
  /**
   * Handle input change
   *
   * @param {*} event
   */
  const handleInputChange = (event) => {
    setSelectedOptions((selectedOptions) => ({
      ...selectedOptions,
      text: {
        ...selectedOptions.text,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
    }));
  };
  /**
   * Handle marker icon change
   *
   * @param {*} iconIndex
   * @param {*} type
   */
  const handleIconChange = (iconIndex, type) => {
    // console.log("mapConfiguration : ", mapConfiguration);
    if (type === "remove") {
      let configIcons = mapConfiguration.icons;
      configIcons.splice(iconIndex, 1);
      onMapConfigChange(
        { ...mapConfiguration, icons: configIcons },
        "remove_marker_icon",
        iconIndex
      );
    } else {
      const newIndex = mapConfiguration.icons.length;
      onMapConfigChange(
        {
          ...mapConfiguration,
          icons: [
            ...mapConfiguration.icons,
            {
              ...markerIcons[iconIndex],
              size: 30,
              color: mapConfiguration.color.secondary_color,
            },
          ],
        },
        "add_marker_icon",
        newIndex
      );
    }
    // onMapConfigChange({ ...mapConfiguration, icon: { ...mapConfiguration.icon, key: iconKey  } }, 'marker_icon');
  };
  /**
   * Handle marker size change
   *
   * @param {*} newValue
   * @param {*} index
   */
  const handleSliderChange = (newValue, index) => {
    let markerIcons = mapConfiguration.icons;
    markerIcons[index].size = newValue;
    onMapConfigChange(
      { ...mapConfiguration, icons: markerIcons },
      "marker_size"
    );
    // onMapConfigChange({ ...mapConfiguration, icon: { ...mapConfiguration.icon, size: newValue } }, 'marker_size');
  };
  /**
   * Handle marker color change
   *
   * @param {*} color
   * @param {*} index
   */
  const handleIconColorChange = (color, index) => {
    const newColor =
      color.css && color.css.backgroundColor
        ? color.css.backgroundColor
        : "#" + color.hex;
    let markerIcons = mapConfiguration.icons;
    markerIcons[index].color = newColor;
    onMapConfigChange(
      { ...mapConfiguration, icons: markerIcons },
      "marker_color"
    );
    // onMapConfigChange({ ...mapConfiguration, icon: { ...mapConfiguration.icon, color: newColor } }, 'marker_color');
  };
  return (
    <Container className={classes.root}>
      <Accordion
        expanded={expanded === "placePanel"}
        onChange={handleChange("placePanel")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="placePanel-content"
          id="placePanel-header"
        >
          <Typography className={classes.heading}>Enter place</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.designAccordion}>
          <PlacesAutocomplete onPlaceSelection={handlePlaceSelection} />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "designPanel"}
        onChange={handleChange("designPanel")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="designPanel-content"
          id="designPanel-header"
        >
          <Typography className={classes.heading}>Choose Design</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.designAccordion}>
          <DesignSection
            productDetails={productDetails}
            selectedOptions={selectedOptions}
            mapConfiguration={mapConfiguration}
            onColorChange={handleColorChange}
            onShapeChange={handleShapeChange}
            onLayoutChange={handleLayoutChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "textPanel"}
        onChange={handleChange("textPanel")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="textPanel-content"
          id="textPanel-header"
        >
          <Typography className={classes.heading}>Change Text</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextSection
            selectedOptions={selectedOptions}
            onInputChange={handleInputChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "iconPanel"}
        onChange={handleChange("iconPanel")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="iconPanel-content"
          id="iconPanel-header"
        >
          <Typography className={classes.heading}>Choose Icon</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <IconSection
            mapConfiguration={mapConfiguration}
            markerIcons={markerIcons}
            onSliderChange={handleSliderChange}
            onIconChange={handleIconChange}
            onIconColorChange={handleIconColorChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "sizePanel"}
        onChange={handleChange("sizePanel")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="sizePanel-content"
          id="sizePanel-header"
        >
          <Typography className={classes.heading}>Choose size</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.designAccordion}>
          <SizeSection
            selectedOptions={selectedOptions}
            productDetails={productDetails}
            onSizeChange={handleSizeChange}
            onPurchaseTypeChange={handlePurchaseTypeChange}
          />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};
CMODesktop.propTypes = {
  defaultOptions: PropTypes.object.isRequired,
  defautMapConfig: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  onMapConfigChange: PropTypes.func.isRequired,
  productDetails: PropTypes.object.isRequired,
  markerIcons: PropTypes.array.isRequired,
  onSizeChange: PropTypes.func.isRequired,
};
export default CMODesktop;
