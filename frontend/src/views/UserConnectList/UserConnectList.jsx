import React, { useState, useEffect } from "react";
import useStyles from "./UserConnectListStyle";
// import { connect } from 'react-redux';
// import { COMMON_ERR_MSG, APP_NAME } from '../../config';
import API from "../../axios/axiosApi";
import { Button, Snackbar, Badge } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import ChatBox from "../ChatBox";
import io from "socket.io-client";
import { convertStringToObject } from "../../utils/utils";

const socket = io("http://stagingwebsites.info:8085");
const UserConnectList = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({}); // State to track unread message counts

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const loginUser = parsedUserData.user_id;
          const response = await API.post("userConnectList", { loginUser });
          const { data } = response.data.data;
          setUsers(data || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("chat message", (message) => {
      const senderId = message.senderId;
      const userId = message.receiver;

      if (userId !== selectedUser?.id) {
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [userId]: (prevCounts[userId] || 0) + 1,
        }));
      }

      if (selectedUser && selectedUser.id === senderId) {
        setChatHistory((prevHistory) => [...prevHistory, message]);
      }
    });

    return () => {
      socket.off("chat message");
    };
  }, [selectedUser]); // Subscribe/unsubscribe when selectedUser changes

  const fetchChatHistory = async (user) => {
    try {
      const history = await getChatHistory(user);
      setChatHistory(history);

      // Reset unread count for the selected user when chat is opened
      if (user) {
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [user.id]: 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user === selectedUser ? null : user);
    fetchChatHistory(user === selectedUser ? null : user);
    setUnreadCounts(0);
  };

  const disconnectUser = async (id) => {
    try {
      setLoading(true);
      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        const loginUser = parsedUserData.user_id;
        const postData = { id, loginUser };
        const response = await API.post("disconnectUser", postData);
        const { success, message } = response.data.data;
        if (success) {
          displaySnackbar(message, "success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error disconnecting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const displaySnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const getChatHistory = async (user) => {
    try {
      if (!user) {
        return [];
      }
      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        const loginUser = parsedUserData.user_id;

        const [id] = user.split(",");

        const getConversationresponse = await API.post("getConversationId", {
          id,
          loginUser,
        });
        let conversationId = getConversationresponse.data.conversationId;
        if (conversationId === "notfound") {
          conversationId = 0;
        }
        const response = await API.post("getConversation", { conversationId });
        const { data } = response.data;
        if (data && data.rows) {
          return data.rows || [];
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return [];
    }
  };

  return (
    <div className={classes.connectMainDiv}>
      <h2>Connects List</h2>
      {loading && <p>Loading...</p>}
      {!loading && users.length === 0 && (
        <div className="error-message">No users found.</div>
      )}
      <ul>
        {users.map((user) => {
          const { id, first_name, last_name } = convertStringToObject(user, 0);
          const unreadCount = unreadCounts[id] || 0;
          return (
            <li key={id}>
              <div>{`${first_name} ${last_name}`}</div>

              <Badge
                badgeContent={unreadCount}
                color="secondary"
                overlap="rectangular"
              >
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleUserClick(user)}
                >
                  Chat
                </Button>
              </Badge>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => disconnectUser(id)}
                disabled={loading}
              >
                Disconnect
              </Button>
              {selectedUser === user && (
                <ChatBox
                  key={id}
                  user={user}
                  onClose={() => setSelectedUser(null)}
                  chatHistory={chatHistory}
                />
              )}
            </li>
          );
        })}
      </ul>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default UserConnectList;
