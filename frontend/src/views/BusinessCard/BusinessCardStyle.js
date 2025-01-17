import { makeStyles } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100%",
    width: "100%",
    display: "flex",
    minHeight: "calc(100vh - 184px)",
    // padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  loading: {
    position: "absolute",
    top: "40%",
    left: "50%",
    height: "80px !important",
    width: "80px !important",
    // transform: "translate(-50%, -50%)",
    zIndex: 9999, // Ensure it's above other content
  },
  cardContainer: {
    display: "flex",
    gap: "20px",
    width: "100%",
    height: "600px",
    margin: "20px 0",
  },
  card: {
    overflowY: "auto",
    height: "max-content",
    width: 600, // Set the width to 800px
    maxHeight: 600, // Set the height to 500px
    marginBottom: 50,
    minWidth: 275,
    maxWidth: 400,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    transition: "0.3s",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2)",
    },
    border: "2px solid cadetblue",
  },
  centerCard: {
    display: "flex",
    justifyContent: "center",
  },
  pos: {
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
  },
  avatar: {
    width: 150,
    height: 150,
    margin: "auto",
    "&:hover $avatarEditIcon": {
      display: "flex",
      zIndex: "99",
      position: "absolute",
      right: "60px",
      bottom: "2px",
    },
  },

  cardheader: {
    position: "relative",
    background: "cadetblue",
    paddingTop: "20px",
    paddingBottom: "20px",
    margin: "auto",
    "&:hover $coverEditIcon": {
      display: "flex",
    },
  },

  draggableItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },

  itemTitle: {
    flexGrow: 1,
    display: "flex",
  },

  itemTitleSpan: {
    paddingLeft: "10PX",
  },

  itemButtons: {
    marginLeft: theme.spacing(1),
  },

  logoSpan: {
    padding: "0px 10px 0 10px",
    position: "relative",
    display: "flex",
    "&:hover $logoEditIcon": {
      visibility: "visible",
    },
  },
  logo: {
    width: "120px",
    height: "32px",
  },

  avatarEditIcon: {
    display: "none",
    cursor: "pointer",
    color: "#000000",
  },
  logoEditIcon: {
    visibility: "hidden",
    cursor: "pointer",
  },
  coverEditIcon: {
    display: "none",
    position: "absolute",
    left: "10px",
    zIndex: "99",
    cursor: "pointer",
  },
  editButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  deleteButton: {
    marginLeft: "10px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  popover: {
    display: "grid !important",
  },
}));
