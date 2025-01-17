import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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
  mr12: {
    marginRight: "12px",
    marginTop: "20px",
  },
}));

const MyModal = (props) => {
  const classes = useStyles();
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    if (props.data.fields) {
      setFormData((prev) => JSON.parse(JSON.stringify(props.data.fields)));
    }
  }, [props.data]);

  const handleInputChange = (e, indexData) => {
    const { value } = e.target;
    formData[indexData].value = value;
    setFormData(() => [...formData]);
  };

  return (
    <div>
      <Modal
        className={classes.modal}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          {formData.map((item, index) => (
            <TextField
              key={index}
              name={item.key}
              label={item.label}
              value={item.value}
              onChange={(event) => handleInputChange(event, index)}
              fullWidth
              required
              margin="normal"
            />
          ))}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => props.close()}
            className={classes.mr12}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className={classes.mr12}
            color="primary"
            onClick={() => props.handleSubmit(formData)}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyModal;
