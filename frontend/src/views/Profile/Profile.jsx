import React, { useEffect, useState } from "react";
// import clsx from 'clsx';
import { connect } from "react-redux";
import validate from "validate.js";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// import IconButton from '@material-ui/core/IconButton';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
// import Skeleton from '@material-ui/lab/Skeleton';
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";
import { TextField, Checkbox, FormControlLabel } from "@material-ui/core";

import useStyles from "./ProfileStyle";
import API from "../../axios/axiosApi";
import { COMMON_ERR_MSG } from "../../config";
import {
  updateCartCount,
  decrementCartCount,
  onUserProfileUpdate,
} from "../../redux/actions";
import ChangePasswordDialog from "../../components/ChangePasswordDialog";

const schema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 120,
    },
  },
  firstName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 120,
    },
  },
  lastName: {
    length: {
      maximum: 120,
    },
  },
  mobile: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 30,
    },
  },
};

const Profile = ({ history, onUserProfileUpdate }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "" });
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    profileVisibility: false,
  });
  const [openDialog, setOpenDialog] = useState(false);

  // const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get("profile");
        if (response.data.success && response.data.data) {
          const profileDetails = response.data.data.profile_details;
          const isProfilePrivate =
            profileDetails.profileVisibility === "private";
          setFormState((formState) => ({
            ...formState,
            values: {
              ...formState.values,
              firstName: profileDetails.first_name,
              lastName: profileDetails.last_name,
              email: profileDetails.email,
              mobile: profileDetails.mobile,
            },
            profileVisibility: isProfilePrivate,
          }));
        }
        setLoading(false);
      } catch (error) {
        console.log("ERROR in fetchProfile : ", error);
        setLoading(false);
        const errorMsg =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : COMMON_ERR_MSG;
        handleSnackToogle(errorMsg);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const handleChange = (event) => {
    event.persist();
    const { name, checked, value } = event.target;

    // if (type === 'checkbox') {
    //   setFormState((prevState) => ({
    //     ...prevState,
    //     [name]: checked,
    //   }));
    // } else {
    //   setFormState((prevState) => ({
    //     ...prevState,
    //     [name]: value,
    //   }));
    // }
    // setFormState(formState => ({
    // 	...formState,
    // 	values: {
    // 		...formState.values,
    // 		[name]: type === 'checkbox' ? checked : value,
    // 	},
    // 	touched: {
    // 		...formState.touched,
    // 		[event.target.name]: true,
    // 	},
    // }));

    if (name === "profileVisibility") {
      setFormState((prevState) => ({
        ...prevState,
        profileVisibility: checked,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        values: {
          ...prevState.values,
          [name]: value,
        },
        touched: {
          ...prevState.touched,
          [name]: true,
        },
      }));
    }
  };

  /**
   * Handle profile update
   *
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formState.isValid) {
      try {
        setLoading(true);
        const putData = {
          firstName: formState.values.firstName,
          lastName: formState.values.lastName,
          mobile: formState.values.mobile,
          profileVisibility: formState.profileVisibility ? "private" : "public",
        };
        // console.log("postData : ", postData); return;
        const response = await API.put("profile", putData);
        handleSnackToogle(response.data.message);
        setLoading(false);
        onUserProfileUpdate({
          full_name: (putData.firstName + " " + putData.lastName).trim(),
          mobile: putData.mobile,
        });
      } catch (error) {
        console.log("ERROR in handleSubmit : ", error);
        setLoading(false);
        const errMsg =
          error.response && error.response.data
            ? error.response.data.message
            : COMMON_ERR_MSG;
        handleSnackToogle(errMsg);
      }
    }
  };

  /**
   * Update account password
   *
   * @param {*} data
   */
  const updatePassword = async (data) => {
    try {
      if (data.password !== data.confirm) {
        handleSnackToogle("Password and confirm password doesn't match.");
        return;
      }
      setLoading(true);
      const response = await API.put("profile/update_password", {
        password: data.password,
      });
      setLoading(false);
      handleSnackToogle(response.data.message);
    } catch (error) {
      console.log("ERROR in updatePassword : ", error);
      setLoading(false);
      const errorMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : COMMON_ERR_MSG;
      handleSnackToogle(errorMsg);
    }
  };

  /**
   * Show/hide change password dialog
   *
   * @param {*} data
   */
  const handleDialogToggle = (data) => {
    setOpenDialog((openDialog) => !openDialog);
    if (data && data.password) {
      updatePassword(data);
    }
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleSnackToogle = (message) => {
    setSnack((snack) => ({ open: !snack.open, message: message || "" }));
  };

  return (
    <div className={classes.root}>
      <div className={classes.pageTitle}>
        {/* <IconButton size={isDesktop ? 'medium' : 'small'} aria-label="go-back" onClick={() => history.goBack()}>
					<ArrowBackIcon />
				</IconButton> */}
        <Typography variant="h3">Profile</Typography>
        {/* <div className={classes.spacer} /> */}
      </div>
      <div className={classes.content}>
        <Container>
          <Paper className={classes.profileContainer}>
            <form
              className={classes.form}
              name="sign-up-form"
              method="post"
              onSubmit={handleSubmit}
            >
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <TextField
                    placeholder="First name"
                    label="First name"
                    variant="outlined"
                    size="medium"
                    name="firstName"
                    fullWidth
                    helperText={
                      hasError("firstName")
                        ? formState.errors.firstName[0]
                        : null
                    }
                    error={hasError("firstName")}
                    onChange={handleChange}
                    type="firstName"
                    value={formState.values.firstName || ""}
                    autoFocus
                    required
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    placeholder="Last name"
                    label="Last name"
                    variant="outlined"
                    size="medium"
                    name="lastName"
                    fullWidth
                    helperText={
                      hasError("lastName") ? formState.errors.lastName[0] : null
                    }
                    error={hasError("lastName")}
                    onChange={handleChange}
                    type="lastName"
                    value={formState.values.lastName || ""}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    placeholder="E-mail"
                    label="E-mail"
                    variant="outlined"
                    size="medium"
                    name="email"
                    fullWidth
                    helperText={
                      hasError("email") ? formState.errors.email[0] : null
                    }
                    error={hasError("email")}
                    onChange={handleChange}
                    type="email"
                    value={formState.values.email || ""}
                    disabled
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    placeholder="Mobile"
                    label="Mobile"
                    variant="outlined"
                    size="medium"
                    name="mobile"
                    fullWidth
                    helperText={
                      hasError("mobile") ? formState.errors.mobile[0] : null
                    }
                    error={hasError("mobile")}
                    onChange={handleChange}
                    type="text"
                    value={formState.values.mobile || ""}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    className={classes.changePwd}
                    color="primary"
                    onClick={handleDialogToggle}
                  >
                    Change Password
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} className={classes.container}>
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formState.profileVisibility}
                            onChange={handleChange}
                            name="profileVisibility"
                            color="primary"
                          />
                        }
                        label="Keep your profile private"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <i>
                    <Typography variant="subtitle2">
                      Fields that are marked with * sign are required.
                    </Typography>
                  </i>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    size="large"
                    variant="contained"
                    type="submit"
                    color="primary"
                    fullWidth
                    disabled={!formState.isValid || loading}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack.open}
        onClose={() => handleSnackToogle()}
        message={snack.message}
        autoHideDuration={2000}
      />

      <ChangePasswordDialog open={openDialog} onClose={handleDialogToggle} />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCartCount: (cartCount) => dispatch(updateCartCount(cartCount)),
    decrementCartCount: (increment) => dispatch(decrementCartCount(increment)),
    onUserProfileUpdate: (profile) => dispatch(onUserProfileUpdate(profile)),
  };
};

export default connect(null, mapDispatchToProps)(Profile);
