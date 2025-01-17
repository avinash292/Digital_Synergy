import React, { useState, useEffect } from "react";
import useStyles from "./ChatBoxStyle";
// import { connect } from 'react-redux';
// import { COMMON_ERR_MSG, APP_NAME } from '../../config';
import API from "../../axios/axiosApi";
import { Button, Paper, TextField } from "@material-ui/core";
import { convertStringToObject, formatMessageDate } from "../../utils/utils";
import CloseIcon from "@material-ui/icons/Close";
import io from "socket.io-client";
// import MuiAlert from '@material-ui/lab/Alert';
const socket = io("http://stagingwebsites.info:8085");

const ChatBox = ({ user, onClose, chatHistory }) => {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(chatHistory || []);

  const storedUserData = localStorage.getItem("user_data");
  const parsedUserData = JSON.parse(storedUserData);
  const loginUser = parsedUserData.user_id;

  const { id, first_name, last_name } = convertStringToObject(user, 0);
  useEffect(() => {
    setMessages(chatHistory);

    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("chat message", handleNewMessage);

    return () => {
      socket.off("chat message");
    };
  }, [chatHistory]);

  const sendMessage = async () => {
    if (input.trim() !== "") {
      const currentDate = new Date();
      const timestamp = currentDate.toISOString();
      const newMessage = {
        sender: id,
        receiver: loginUser,
        createdAt: timestamp,
        text: input.trim(),
      };

      socket.emit("chat message", newMessage);
      try {
        const response = await API.post("getConversationId", { id, loginUser });
        const { data } = response;
        let conversationId = data.conversationId;
        if (conversationId === "notfound") {
          conversationId = loginUser + "" + id;
        }
        await API.post("sendMessage", {
          id,
          loginUser,
          input: newMessage.text,
          conversationId: conversationId, // Generate conversationId
        });
        setInput(""); // Clear the input field after sending
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle error if API call fails
      }
    }
  };

  const closeChatBox = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <div className={classes.container}>
      <Paper className={classes.chatBox}>
        <div className={classes.header}>
          <img
            className={classes.profileImage}
            alt="TheFront Company"
            src="/images/illustrations/sample-1.webp"
            width="50px"
            height="50px"
          />
          <div>{`${first_name} ${last_name}`}</div>
          <Button onClick={closeChatBox}>
            <CloseIcon />
          </Button>
        </div>
        <div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${classes.messageWrapper} ${
                message.sender === loginUser ? classes.myMessage : ""
              }`}
            >
              <div className={classes.messageBubble}>
                {message.text}
                <span>{formatMessageDate(message.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
        <TextField
          className={classes.messageInput}
          label="Type your message"
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </Paper>
    </div>
  );
};

export default ChatBox;
