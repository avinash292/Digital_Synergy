import { makeStyles } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100%",
    overflowY: "auto",
    paddingLeft: "16px",
  },
  listItem: {
    display: "block",
    textAlign: "center",
  },
  cardContainer: {
    display: "flex",
    gap: "16px",
    flexDirection: "column",
    width: "100%",
  },
  cardData: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    flexDirection: "column",
  },
  flexData: {
    display: "flex",
    justifyContent: "space-between",
  },
  gapData: {
    gap: "16px",
    display: "flex",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  chooseTheme: {
    width: "16px",
    height: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  flexColumn: {
    flexDirection: "column",
  },
  flexRow: {
    flexDirection: "row",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  // Style for regular button
  chooseButton: {
    backgroundColor: "#ccc", // Change to desired background color
    border: "none",
    padding: "10px 20px", // Adjust padding to increase button size
    borderRadius: "5px",
    cursor: "pointer",
    outline: "none", // Remove outline
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#aaa", // Change to desired hover background color
    },
  },

  // Style for large buttons
  largeButton: {
    fontSize: "1.2rem", // Increase font size for larger buttons
  },

  layout: {
    padding: "inherit",
    cursor: "pointer",
    borderRadius: "4px",
    display: "grid",
    "&:hover": {
      outline: "auto",
      outlineColor: "darkgrey",
    },
  },

  layoutImg: {
    height: "25px",
    width: "50px",
  },
}));
