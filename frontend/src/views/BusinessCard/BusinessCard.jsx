import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Grid,
  Button,
  Popover,
  CircularProgress,
} from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";
import Sidebar from "../BusinessCardSideBar/Sidebar";
import useStyles from "./BusinessCardStyle";
import MyModal from "../BusinessCardSideBar/modal";
import API from "../../axios/axiosApi";
import html2canvas from "html2canvas"; // Import html2canvas library
import QRCode from "react-qr-code";
import AWS from "aws-sdk";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  AccountCircle as AccountCircleIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Public as PublicIcon,
  Link as LinkIcon,
  LocationOn as LocationOnIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  WhatsApp as WhatsAppIcon,
  SingleBed as SingleBedIcon,
  Telegram as TelegramIcon,
  GitHub as GitHubIcon,
  AttachMoney as AttachMoneyIcon,
  Call as CallIcon,
  Language as LanguageIcon,
  LinkOff as LinkOffIcon,
  LocationCity as LocationCityIcon,
  Payment as PaymentIcon,
  Money as CashIcon,
  MonetizationOn as MonetizationOnIcon,
} from "@material-ui/icons";
const BusinessCard = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const [listData, setListData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [selectedThemeColor, setSelectedThemeColor] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [existProfileImage, setexistProfileImage] = useState(null);
  const [existLogoImage, setexistLogoImage] = useState(null);
  const [existCoverImage, setexistCoverImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [logoImageFile, setLogoImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [changeLayout, setChangeLayout] = useState(null);
  const [cardName, setCardName] = useState(null);
  const [cardImage, setCardImage] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "" });
  const [exportPopoverAnchorEl, setExportPopoverAnchorEl] = useState(null); // Anchor element for the export popover
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setshortenedUrl] = useState(null);
  const fileInputRef = useRef(null);
  const fileInputAvatar = useRef(null);
  const fileInputLogo = useRef(null);
  // Update AWS configuration
  AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region,
  });

  const uploadToS3 = (file, fileName, cardName) => {
    // Initialize S3 client
    const s3 = new AWS.S3();
    // Determine content type based on file extension
    let contentType;
    let key;
    if (fileName === "cardImage") {
      // For cardImage, assuming it's always PNG
      contentType = "image/png";
      key = `BusinessCard/${cardName}.png`;
    } else {
      // For other files, determine content type based on extension
      contentType = getFileContentType(file.name);
      key = `BusinessCard/${fileName}.${getFileExtension(file.name)}`;
    }

    // S3 Upload parameters
    const params = {
      Bucket: "austinairbnb",
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: "public-read",
    };

    // Upload to S3
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  };

  // Function to get file extension
  const getFileExtension = (fileName) => {
    return fileName.split(".").pop();
  };

  // Function to determine content type based on file extension
  const getFileContentType = (fileName) => {
    const extension = getFileExtension(fileName);
    switch (extension.toLowerCase()) {
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "gif":
        return "image/gif";
      case "svg":
        return "image/svg+xml";
      default:
        return "application/octet-stream"; // Default to binary data if content type is unknown
    }
  };

  const getIcon = (icon) => {
    switch (icon) {
      case "<AccountCircleIcon />":
        return <AccountCircleIcon />;
      case "<WorkIcon />":
        return <WorkIcon />;
      case "<BusinessIcon />":
        return <BusinessIcon />;
      case "<EmailIcon />":
        return <EmailIcon />;
      case "<PhoneIcon />":
        return <PhoneIcon />;
      case "<PublicIcon />":
        return <PublicIcon />;
      case "<LinkIcon />":
        return <LinkIcon />;
      case "<LocationOnIcon />":
        return <LocationOnIcon />;
      case "<InstagramIcon />":
        return <InstagramIcon />;
      case "<LinkedInIcon />":
        return <LinkedInIcon />;
      case "<FacebookIcon />":
        return <FacebookIcon />;
      case "<YouTubeIcon />":
        return <YouTubeIcon />;
      case "<WhatsAppIcon />":
        return <WhatsAppIcon />;
      case "<SingleBedIcon />":
        return <SingleBedIcon />;
      case "<TelegramIcon />":
        return <TelegramIcon />;
      case "<GitHubIcon />":
        return <GitHubIcon />;
      case "<AttachMoneyIcon />":
        return <AttachMoneyIcon />;
      case "<CallIcon />":
        return <CallIcon />;
      case "<LanguageIcon />":
        return <LanguageIcon />;
      case "<LinkOffIcon />":
        return <LinkOffIcon />;
      case "<LocationCityIcon />":
        return <LocationCityIcon />;
      case "<PaymentIcon />":
        return <PaymentIcon />;
      case "<CashIcon />":
        return <CashIcon />;
      case "<MonetizationOnIcon />":
        return <MonetizationOnIcon />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setRowData({});
  };

  const handleModal = (row) => {
    setRowData({ ...row });
    setShowModal(true);
  };

  const handleSubmit = (data) => {
    const count = data.filter((item) => !item.value).length;
    if (count) {
      alert("Fields are required.");
      return false;
    }

    const fieldsData = JSON.parse(JSON.stringify(data));
    const finalRowData = { ...rowData, fields: fieldsData };
    delete finalRowData.src;

    const itemIndex = listData.findIndex(
      (item) => item.title === rowData.title
    );
    if (itemIndex !== -1) {
      const updatedListData = [...listData];
      updatedListData[itemIndex] = finalRowData;
      setListData(updatedListData);
    } else {
      setListData((prev) => [...prev, finalRowData]);
    }
    // console.log("listData : " + JSON.stringify(listData));
    handleClose();
  };

  const deleteData = (data) => {
    setListData((prev) => prev.filter((item) => item.title !== data.title));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(listData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setListData(items);
  };

  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(-1);
  };

  const handleThemeChange = (themeColor) => {
    setSelectedThemeColor(themeColor);
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    // console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setProfileImageFile(file);
        // console.log(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target.result);
        setCoverImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setProfileImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target.result);
        setLogoImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeLayout = (layout) => {
    switch (layout) {
      case 1:
        setChangeLayout("flex");
        break;
      case 2:
        setChangeLayout("ruby");
        break;
      case 3:
        setChangeLayout("ruby-text");
        break;
      default:
        setChangeLayout("block");
        break;
    }
  };

  const handleSnackToogle = (message) => {
    setSnack((snack) => ({ open: !snack.open, message: message || "" }));
  };

  const exportCardAsImage = () => {
    handleExportPopoverClose();
    const cardElement = document.getElementById("business-card");
    console.log(cardElement);
    html2canvas(cardElement).then((canvas) => {
      const imageDataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageDataUrl;
      link.download = "business_card.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const exportCardAsQRCode = () => {
    handleExportPopoverClose();
    // You can perform further actions with the URL here
    setshortenedUrl(cardImage);
    if (shortenedUrl != null) {
      const cardElement = document.getElementById("qrCodeContainer");
      html2canvas(cardElement).then((canvas) => {
        const imageDataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageDataUrl;
        link.download = "business_card_QR.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }else{
      handleSnackToogle("Please Make Your card first!");
    }
  };

  const handleExportPopoverClose = () => {
    setExportPopoverAnchorEl(null);
  };

  const handleExportButtonClick = (event) => {
    setExportPopoverAnchorEl(event.currentTarget);
  };

  const cardData = async () => {
    setLoading(true);
    const cardData = [
      {
        listData,
        rowData,
        selectedThemeColor,
        profileImage,
        logoImage,
        coverImage,
        profileImageFile,
        logoImageFile,
        coverImageFile,
        changeLayout,
        cardName,
        cardImage,
      },
    ];
    // console.log(cardData);
    const user_data = JSON.parse(localStorage.getItem("user_data"));
    if (user_data) {
      if (cardName != null) {
        const cardExistResponse = await API.post("checkCardExist", {
          cardName,
        });

        if (cardExistResponse.data.success) {
          setLoading(false);
          handleSnackToogle(cardExistResponse.data.message);
          return;
        }
        if (cardData[0].listData.length > 0) {
          const user_id = user_data.user_id;
          const formData = new FormData();
          formData.append("user_id", user_id);
          formData.append("listData", JSON.stringify(listData));
          formData.append("rowData", JSON.stringify(rowData));
          formData.append("selectedThemeColor", selectedThemeColor);
          formData.append("cardName", cardName);
          formData.append("changeLayout", changeLayout);
          formData.append("type", "add");
          const cardElement = document.getElementById("business-card");

          // Convert card element to image
          const canvas = await html2canvas(cardElement);
          const imageDataUrl = canvas.toDataURL("image/png");
          const byteString = atob(imageDataUrl.split(",")[1]);
          const mimeString = imageDataUrl
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          const cardImage = "cardImage";

          // Upload image to S3
          const cardImageUrl = await uploadToS3(blob, cardImage, cardName);
          setCardImage(cardImageUrl);
          if (cardImageUrl) {
            formData.append("cardImage", cardImageUrl);
          }

          // Upload profile image to S3
          const profileImageFileURL = profileImageFile
            ? await uploadToS3(
                profileImageFile,
                cardName + "_profileImage",
                cardName
              )
            : null;
          if (profileImageFileURL) {
            formData.append("profileImageFile", profileImageFileURL);
          }

          // Upload logo image to S3
          const logoImageFileURL = logoImageFile
            ? await uploadToS3(logoImageFile, cardName + "_logoImage", cardName)
            : null;
          if (logoImageFileURL) {
            formData.append("logoImageFile", logoImageFileURL);
          }

          // Upload cover image to S3
          const coverImageFileURL = coverImageFile
            ? await uploadToS3(
                coverImageFile,
                cardName + "_coverImage",
                cardName
              )
            : null;
          if (coverImageFileURL) {
            formData.append("coverImageFile", coverImageFileURL);
          }

          // Save card data
          const response = await API.post("saveCard", formData, {});
          const success = response.data.success;
          if (success) {
            setLoading(false);
            console.log("Card data saved successfully:", response.data);
            handleSnackToogle(response.data.message);
          } else {
            setLoading(false);
            handleSnackToogle(response.data.message);
          }
        } else {
          setLoading(false);
          handleSnackToogle("At least one field in Personal is required!");
        }
      } else {
        setLoading(false);
        console.log("Card Name missing!");
        handleSnackToogle("Card Name missing!");
      }
    } else {
      setLoading(false);
      handleSnackToogle("You need to login!");
    }
  };

  // Function to convert image URL to base64
  async function imageUrlToBase64(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image URL to base64:", error);
      return null;
    }
  }

  useEffect(() => {
    const fetchBusinessCard = async () => {
      // If id is available in the URL, make API call to fetch business card data
      if (id) {
        setLoading(true);
        try {
          const response = await API.get(`/getBusinessCard/${id}`);
          const responseData = response.data;
          if (responseData.success) {
            setLoading(false);
            const cardData = responseData.result;
            localStorage.setItem("card_data", JSON.stringify(cardData));
            const listDataArray = JSON.parse(cardData.listData);
            if (listDataArray) {
              setListData(listDataArray);
            }
            setSelectedThemeColor(cardData.selectedThemeColor);
            // Convert image URLs to base64
            setexistProfileImage(cardData.profileImage);
            const profileImageBase64 = await imageUrlToBase64(
              cardData.profileImage
            );

            setexistLogoImage(cardData.logoImage);
            const logoImageBase64 = await imageUrlToBase64(cardData.logoImage);

            setexistCoverImage(cardData.coverImage);
            const coverImageBase64 = await imageUrlToBase64(
              cardData.coverImage
            );
            setProfileImage(profileImageBase64);
            setLogoImage(logoImageBase64);
            setCoverImage(coverImageBase64);
            setChangeLayout(cardData.changeLayout);
            setCardName(cardData.cardName);
            setCardImage(cardData.cardImage);
          } else {
            // history.push("/businessCard");
          }
        } catch (error) {
          console.error("Error fetching business card data:", error);
        }
      } else {
        const cardData = localStorage.getItem("card_data");
        if (cardData != null) {
          localStorage.removeItem("card_data");
        }
      }
    };

    // Call the fetchBusinessCard function
    
    fetchBusinessCard();
  }, [id, history]);
  // Run this effect whenever id changes

  const handleChangeinput = (e) => {
    setCardName(e.target.value);
  };

  const updateCardData = async (id) => {
    setLoading(true);
    const cardData = [
      {
        listData,
        rowData,
        selectedThemeColor,
        profileImage,
        logoImage,
        coverImage,
        profileImageFile,
        logoImageFile,
        coverImageFile,
        changeLayout,
        cardName,
        cardImage,
        id,
      },
    ];
    console.log(cardData);
    const user_data = JSON.parse(localStorage.getItem("user_data"));
    if (user_data) {
      if (cardName != null) {
        if (cardData[0].listData.length > 0) {
          const user_id = user_data.user_id;
          const formData = new FormData();
          formData.append("user_id", user_id);
          formData.append("listData", JSON.stringify(listData));
          formData.append("rowData", JSON.stringify(rowData));
          formData.append("selectedThemeColor", selectedThemeColor);
          formData.append("cardName", cardName);
          formData.append("changeLayout", changeLayout);
          formData.append("type", "edit");
          formData.append("cardId", id);
          const cardElement = document.getElementById("business-card");
          // Convert card element to image
          const canvas = await html2canvas(cardElement);
          const imageDataUrl = canvas.toDataURL("image/png");
          // Convert data URL to Blob
          const byteString = atob(imageDataUrl.split(",")[1]);
          const mimeString = imageDataUrl
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          const cardImage = "cardImage";
          // Upload image to S3
          const cardImageUrl = await uploadToS3(blob, cardImage, cardName);
          if (cardImageUrl) {
            formData.append("cardImage", cardImageUrl);
          }

          if (profileImageFile) {
            // console.log("Appending Profile Image");
            const profileImageFileURL = await uploadToS3(
              profileImageFile,
              cardName + "_profileImage",
              cardName
            );
            if (profileImageFileURL) {
              formData.append("profileImageFile", profileImageFileURL);
            }
          } else {
            formData.append("profileImageFile", existProfileImage);
          }
          if (logoImageFile) {
            // console.log("Appending Logo Image");
            const logoImageFileURL = await uploadToS3(
              logoImageFile,
              cardName + "_logoImage",
              cardName
            );
            if (logoImageFileURL) {
              formData.append("logoImageFile", logoImageFileURL);
            }
          } else {
            formData.append("logoImageFile", existLogoImage);
          }
          if (coverImageFile) {
            // console.log("Appending Cover Image");
            const coverImageFileURL = await uploadToS3(
              coverImageFile,
              cardName + "_coverImage",
              cardName
            );
            if (coverImageFileURL) {
              formData.append("coverImageFile", coverImageFileURL);
            }
          } else {
            formData.append("coverImageFile", existCoverImage);
          }
          // console.log(formData);
          const response = await API.post("saveCard", formData, {});
          const success = await response.data.success;
          if (success) {
            setLoading(false);
            console.log("Card data saved successfully:", response.data);
            handleSnackToogle(response.data.message);
            // history.push("/userBusinessCardList");
          } else {
            setLoading(false);
            // console.error("Error saving card data:");
            handleSnackToogle(response.data.message);
          }
        } else {
          setLoading(false);
          handleSnackToogle("In Personal At least One fiels Is required!");
        }
      } else {
        setLoading(false);
        console.log("Card Name missing!");
        handleSnackToogle("Card Name missing!");
      }
    } else {
      setLoading(false);
      handleSnackToogle("You need to login!");
    }
  };

  // Function to add or update card data
  const handleSaveOrUpdate = async () => {
    if (id) {
      // If id is available, update card data
      await updateCardData(id);
    } else {
      // If id is not available, add new card data
      await cardData();
    }
  };

  // JSX for the Save/Update button
  const renderSaveOrUpdateButton = () => {
    if (id) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveOrUpdate}
        >
          Update
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveOrUpdate}
        >
          Save
        </Button>
      );
    }
  };

  return (
    <div className={classes.root}>
      {loading && <CircularProgress className={classes.loading} />}
      <Grid className={classes.cardContainer}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snack.open}
          onClose={() => handleSnackToogle()}
          message={snack.message}
          autoHideDuration={2000}
        />
        <Grid item xs={4}>
          <Sidebar
            handleModal={handleModal}
            handleThemeChange={handleThemeChange}
            handleProfileImageUpload={handleProfileImageUpload}
            handleLogoImageUpload={handleLogoImageUpload}
            handleCoverImageUpload={handleCoverImageUpload}
            handleChangeLayout={handleChangeLayout}
            handleChangeinput={handleChangeinput}
          />
        </Grid>
        <h3>{cardName}</h3>
        <Grid item xs={8} className={classes.centerCard}>
          <Card
            id="business-card"
            className={classes.card}
            style={{ borderColor: selectedThemeColor }}
          >
            <div
              className={classes.cardheader}
              style={{
                backgroundImage: coverImage ? `url(${coverImage})` : "none",
                backgroundColor: selectedThemeColor,
                backgroundRepeat: coverImage ? "no-repeat" : "inherit",
                display: changeLayout,
              }}
            >
              <span
                className={classes.coverEditIcon}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCoverImageUpload}
                  style={{ display: "none" }}
                  accept="image/*"
                />
                <EditIcon />
              </span>
              <div className={classes.avatarContainer}>
                <Avatar className={classes.avatar}>
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className={classes.image}
                    />
                  ) : (
                    <h3>Add Profile</h3>
                  )}
                  <span
                    className={classes.avatarEditIcon}
                    onClick={() => fileInputAvatar.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputAvatar}
                      onChange={handleAvatarImageUpload}
                      style={{ display: "none" }}
                      accept="image/*"
                    />
                    <EditIcon />
                  </span>
                </Avatar>
              </div>
              <div className={classes.logoSpan}>
                {logoImage ? (
                  <img
                    src={logoImage}
                    alt="Company Logo"
                    className={classes.logo}
                  />
                ) : (
                  <h3>Add Logo</h3>
                )}
                <span
                  className={classes.logoEditIcon}
                  onClick={() => fileInputLogo.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputLogo}
                    onChange={handleLogoImageUpload}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <EditIcon />
                </span>
              </div>
            </div>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="listData">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {listData.map((item, index) => (
                        <Draggable
                          key={item.title}
                          draggableId={item.title}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={classes.draggableItem}
                              onMouseEnter={() => handleMouseEnter(index)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div className={classes.itemTitle}>
                                <span>{getIcon(item.icon)}</span>
                                <span className={classes.itemTitleSpan}>
                                  {item.fields[0].value}
                                </span>
                              </div>
                              {hoverIndex === index && (
                                <div className={classes.itemButtons}>
                                  <button
                                    onClick={() => handleModal(item)}
                                    className={classes.editButton}
                                  >
                                    <EditIcon />
                                  </button>
                                  <button
                                    className={classes.deleteButton}
                                    onClick={() => deleteData(item)}
                                  >
                                    <DeleteIcon />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
          <div className={classes.buttonContainer}>
            {renderSaveOrUpdateButton()}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleExportButtonClick}
            >
              Export
            </Button>
          </div>
          <div className={classes.qrCodeContainer} id="qrCodeContainer">
            {/* Display QR code for the shortened URL */}
            {shortenedUrl && <QRCode value={shortenedUrl} />}
          </div>
        </Grid>
      </Grid>

      {showModal && (
        <MyModal
          open={showModal}
          handleSubmit={handleSubmit}
          close={handleClose}
          data={rowData}
        />
      )}
      {/* Export Popover */}
      <Popover
        open={Boolean(exportPopoverAnchorEl)}
        anchorEl={exportPopoverAnchorEl}
        onClose={handleExportPopoverClose}
        className={classes.popover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Button onClick={exportCardAsImage}>Export as Image</Button>
        <Button onClick={exportCardAsQRCode}>Export as QR Code</Button>
      </Popover>
    </div>
  );
};

export default BusinessCard;
