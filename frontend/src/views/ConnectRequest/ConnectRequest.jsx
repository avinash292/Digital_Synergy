import React, { useState, useEffect } from "react";
import useStyles from "./ConnectRequestStyle";
// import { connect } from "react-redux";
// import { COMMON_ERR_MSG, APP_NAME } from "../../config";
import API from "../../axios/axiosApi";
import { Button, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
const ConnectRequest = () => {
  const classes = useStyles();

  const [connectRequestDetail, setConnectRequestDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        setLoading(true);

        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const loginUser = parsedUserData.user_id;

          const response = await API.post("connectRequest", { loginUser });
          const { success, data } = response.data;

          if (success) {
            setConnectRequestDetail(data.userDetail);
          } else {
            console.error("");
            displaySnackbar("Failed to fetch connection requests", "error");
          }
        }

        setLoading(false);
      } catch (error) {
        displaySnackbar(error, "error");
        setLoading(false);
      }
    };

    fetchConnectionRequests();
  }, []);

  const handleRequestApproval = async (id, connectId, status) => {
    try {
      setLoading(true);

      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        const loginUser = parsedUserData.user_id;

        const postData = { id, loginUser, status, connectId };
        const endpoint =
          status === "approved" ? "connectApproved" : "connectDenied";

        const response = await API.post(endpoint, postData);
        const { success, message } = response.data;

        if (success) {
          displaySnackbar(message, "success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          displaySnackbar("Request approval/denial failed", "error");
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error handling request approval/denial:", error);
      setLoading(false);
    }
  };
  const displaySnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (
    <div className={classes.connectMainDiv}>
      <h2>Connection Requests</h2>
      {connectRequestDetail.length === 0 && !loading && (
        <div className="error-message">No connection requests found.</div>
      )}
      <ul>
        {connectRequestDetail.map((connectRequest) => (
          <li key={connectRequest.id}>
            <div className="connectFirst">
              {connectRequest.login_user_firstName}
            </div>
            <div className="connectLast">
              {connectRequest.login_user_LastName}
            </div>

            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() =>
                handleRequestApproval(
                  connectRequest.id,
                  connectRequest.login_user_id,
                  "approved"
                )
              }
              disabled={loading}
            >
              Approve
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() =>
                handleRequestApproval(
                  connectRequest.id,
                  connectRequest.login_user_id,
                  "denied"
                )
              }
              disabled={loading}
            >
              Deny
            </Button>
          </li>
        ))}
      </ul>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity}
          onClose={handleCloseSnackbar}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default ConnectRequest;
