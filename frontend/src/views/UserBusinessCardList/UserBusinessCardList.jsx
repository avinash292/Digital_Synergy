import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "./userBusinessCardStyle";
import API from "../../axios/axiosApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog, // Import Dialog for confirmation modal
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Popover,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import ShareIcon from '@material-ui/icons/Share';
import Tooltip from "@material-ui/core/Tooltip";
import AWS from "aws-sdk";

const UserBusinessCardList = () => {
  const classes = useStyles();
  const history = useHistory();
  const [usersBusinesscardList, setuserBusinesscardList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null); // State to store the ID of the card to be deleted
  const [openConfirmation, setOpenConfirmation] = useState(false); // State to control the visibility of the confirmation dialog
  const [cardName, setCardName] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverMessage, setPopoverMessage] = useState("");

  useEffect(() => {
   AWS.config.update({
       accessKeyId: process.env.accessKeyId,
       secretAccessKey: process.env.secretAccessKey,
       region: process.env.region,
     });
    fetchUserBusinessCardList();
  }, []);

  const fetchUserBusinessCardList = async () => {
    try {
      setLoading(true);
      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        const loginUser = parsedUserData.user_id;
        const response = await API.post("userBusinessCardList", {
          loginUser,
        });
        const responseData = response.data;
        if (responseData.success) {
          setuserBusinesscardList(responseData.result);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard = async (id) => {
    setLoading(true);
    try {
      history.push(`/BusinessCard/${id}`);
    } catch (error) {
      console.error("Error editing card:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id, cardName) => {
    setDeleteCardId(id); // Set the ID of the card to be deleted
    setOpenConfirmation(true); // Open the confirmation dialog
    setCardName(cardName);
  };

  const confirmDeleteCard = async () => {
    setOpenConfirmation(false);
    setLoading(true);
    try {
      const response = await API.delete(`deleteBusinessCard/${deleteCardId}`);
      const responseData = response.data;
      if (responseData.success) {
        const s3 = new AWS.S3();
        const listParams = {
          Bucket: "austinairbnb",
          Prefix: "BusinessCard/" + cardName,
        };

        // List all objects with the specified prefix
        const data = await s3.listObjectsV2(listParams).promise();

        // Delete each object one by one
        const deletePromises = data.Contents.map((content) => {
          const deleteParams = {
            Bucket: "austinairbnb",
            Key: content.Key,
          };
          return s3.deleteObject(deleteParams).promise();
        });

        // Wait for all delete operations to complete
        await Promise.all(deletePromises);

        fetchUserBusinessCardList();
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (event, imageUrl) => {
    setPopoverAnchorEl(event.currentTarget);
    setLightboxImage(imageUrl);
    setPopoverOpen(true);
  };

  const handleCloseLightbox = () => {
    setPopoverOpen(false);
    setLightboxImage(null);
  };



  const handleShareIconClick = (event, cardImage) => {
    setAnchorEl(event.currentTarget);
    copyToClipboard(cardImage);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const copyToClipboard = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        setPopoverMessage("Link copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying to clipboard: ", error);
        setPopoverMessage("Error copying link to clipboard");
      });
  } else {
    // Fallback for browsers that don't support the Clipboard API
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.backgroundColor = "black"; // Set background color to black
    textArea.style.color = "white"; // Set text color to white
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setPopoverMessage("copied !");
    setTimeout(() => {
     setAnchorEl(null);
  }, 500);
   
  }
};


  const open = Boolean(anchorEl);
  const id = open ? "share-popover" : undefined;


  return (
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/businessCard")}
          >
            Add New Card
          </Button>
        </div>
        <Table className={classes.table} aria-label="simple table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell>Serial No.</TableCell>
              <TableCell>Card ID</TableCell>
              <TableCell>Card Name</TableCell>
              <TableCell>Card Image</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : usersBusinesscardList && usersBusinesscardList.length > 0 ? (
              usersBusinesscardList.map((card, index) => (
                <TableRow key={card.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{card.id}</TableCell>
                  <TableCell>{card.cardName}</TableCell>
                  <TableCell>
                  <Tooltip title="Click To view">
                    <img
                      src={`${card.cardImage}`}
                      alt={card.cardImage}
                      className={classes.cardImage}
                      onClick={(event) =>
                        handleImageClick(event, card.cardImage)
                      }
                    />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                  <Tooltip title="Edit card">
                    <IconButton onClick={() => handleEditCard(card.id)} title="Edit card">
                      <EditIcon />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete card">
                    <IconButton
                      onClick={() => handleDeleteCard(card.id, card.cardName)} title="Delete card"
                    >
                      <DeleteIcon />
                    </IconButton>
                    </Tooltip>
                        <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleClosePopover}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          <div style={{ padding: 10 }}>{popoverMessage}</div>
                        </Popover>
                        <Tooltip title="Share card">
                      <IconButton onClick={(event) => handleShareIconClick(event, card.cardImage)}>
                          <ShareIcon />
                        </IconButton>
                        </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No cards available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Dialog
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this card?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmation(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDeleteCard} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Popover
          open={popoverOpen}
          anchorEl={popoverAnchorEl}
          onClose={handleCloseLightbox}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        >
          <div className={classes.lightboxContainer}>
            <div className={classes.lightboxContent}>
              <IconButton
                className={classes.closeButton}
                onClick={handleCloseLightbox}
              >
                <CloseIcon />
              </IconButton>
              <img
                src={lightboxImage}
                alt="Lightbox"
                className={classes.lightboxImage}
              />
            </div>
          </div>
        </Popover>
      </TableContainer>
    </div>
  );
};

export default UserBusinessCardList;
