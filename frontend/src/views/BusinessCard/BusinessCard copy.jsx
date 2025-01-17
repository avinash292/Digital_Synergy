import React, { useState } from "react";
import { Card, CardContent, Typography, Avatar, Grid } from "@material-ui/core";
import Sidebar from "../BusinessCardSideBar/Sidebar";
import useStyles from "./BusinessCardStyle";
import MyModal from "../BusinessCardSideBar/modal";

const BusinessCard = () => {
  const classes = useStyles();
  const [listData, setListData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState({});

  function handleClose() {
    setShowModal(false);
    setRowData({});
  }

  function handleModal(row) {
    setRowData(() => ({ ...row }));
    setShowModal(true);
  }

  function handleSubmit(data) {
    let count = 0;
    data.forEach((item) => {
      if (!item.value) {
        count += 1;
      }
    });
    if (count) {
      alert("Fields are required.");
      return false;
    }
    const fieldsData = JSON.parse(JSON.stringify(data));
    const finalRowData = { ...rowData, fields: fieldsData };
    delete finalRowData.src;
    setListData((prev) => [
      ...prev.filter((item) => item.title !== rowData.title),
      finalRowData,
    ]);
    handleClose();
  }

  function deleteData(data) {
    setListData((prev) => prev.filter((item) => item.title !== data.title));
  }

  return (
    <div className={classes.root}>
      <Grid className={classes.cardContainer}>
        <Grid item xs={4}>
          <Sidebar handleModal={handleModal} />
        </Grid>
        <Grid item xs={8} className={classes.centerCard}>
          <Card className={classes.card}>
            <div className={classes.cardheader}>
              <Avatar className={classes.avatar}>
                <img
                  src="https://via.placeholder.com/150" // Replace with the URL of your image
                  alt="John Doe"
                  className={classes.image}
                />
              </Avatar>
            </div>
            <CardContent>
              {listData.length > 0
                ? listData.map((item) => (
                    <div>
                      <div>{item.title}</div>
                      <button onClick={() => handleModal(item)}>Edit</button>
                      <button onClick={() => deleteData(item)}>Delete</button>
                    </div>
                  ))
                : null}
            </CardContent>
          </Card>
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
    </div>
  );
};

export default BusinessCard;
