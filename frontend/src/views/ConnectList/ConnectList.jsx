import React, { useState, useEffect } from "react";
import useStyles from "./ConnectListStyle";
// import { connect } from 'react-redux';
// import { COMMON_ERR_MSG, APP_NAME } from '../../config';
import API from "../../axios/axiosApi";
import Button from "@material-ui/core/Button";
const ConnectList = () => {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [requsers, setRequsers] = useState([]);
  const [requestsSent, setRequestsSent] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const loginUser = parsedUserData.user_id;

          // Fetch all users
          const response = await API.post("profiles", { loginUser });
          const { data } = response.data.data;
          if (data && data.rows) {
            setUsers(data.rows);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    const fetchRequestedUsers = async () => {
      try {
        setLoading(true);

        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const loginUser = parsedUserData.user_id;

          // Fetch requested users
          const response = await API.post("requestedUser", { loginUser });
          const { success, data } = response.data;

          if (success && data && data.data.rows) {
            const requestedUsers = data.data.rows.reduce((acc, user) => {
              acc[user.to_connect_user_id] = true; // Mark requested users in requestsSent state
              return acc;
            }, {});

            setRequestsSent(requestedUsers);
            setRequsers(data.rows);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching requested users:", error);
        setLoading(false);
      }
    };

    fetchData();
    fetchRequestedUsers();
  }, [requsers]); // Empty dependency array means this effect runs once after initial render

  const connectUser = async (id) => {
    try {
      setLoading(true);

      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        const loginUser = parsedUserData.user_id;

        // Send connect request
        const response = await API.post("connectNewUser", { id, loginUser });
        const { success, message } = response.data.data;

        if (success) {
          alert(message);
          window.location.reload(); // Reload page on success (adjust as needed)
        }

        // Mark user as requested in requestsSent state
        setRequestsSent((prevState) => ({
          ...prevState,
          [id]: true,
        }));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error connecting user:", error);
      setLoading(false);
    }
  };

  return (
    <div className={classes.connectMainDiv}>
      <h2>Connects List</h2>
      {users.length === 0 && !loading && (
        <div className="error-message">No users found.</div>
      )}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div className="connectFirst">{user.first_name}</div>
            <div className="connectLast">{user.last_name}</div>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => connectUser(user.id)}
              disabled={requestsSent[user.id] || loading}
            >
              {requestsSent[user.id] ? "Request Sent" : "Connect"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectList;
