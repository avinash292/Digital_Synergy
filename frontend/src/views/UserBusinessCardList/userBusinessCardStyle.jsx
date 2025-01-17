import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(8), // Add padding to the root container
  },
  table: {
    minWidth: 650,
    backgroundColor: "#f0f0f0", // Set background color for the table
  },
  tableHeader: {
    backgroundColor: "cadetblue !important", // Set background color for the table header
    color: "white", // Set text color for the table header
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end", // Align the button to the right
    marginBottom: theme.spacing(2), // Add margin bottom for spacing
  },
  cardImage: {
    height: "60px !mportant",
    width: "100px !important",
    cursor: "pointer",
  },
  closeButton: {
    position: "absolute",
  },
}));

export default useStyles;
