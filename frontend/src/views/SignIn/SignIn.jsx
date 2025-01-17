import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
// import Button from "@material-ui/core/Button";
import { GoogleLogin } from "react-google-login";
// import FacebookLogin from 'react-facebook-login';
//import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { connect } from "react-redux";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Alert from "@material-ui/lab/Alert";

// import FacebookIcon from "@material-ui/icons/Facebook";
// import FacebookIcon from '../../icons/Facebook';

import { Form } from "./components";
import { SectionHeader } from "components/molecules";
import { Section } from "components/organisms";
import useStyles from "./SignInStyle";
import { G_CLIENT_ID, COMMON_ERR_MSG } from "../../config";
import API from "../../axios/axiosApi";
import { updateLoginCart, incrementCartCount } from "../../redux/actions";

const SignIn = ({ history, cartData, updateLoginCart, incrementCartCount }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const responseGoogle = async (response) => {
    if (response.profileObj) {
      const postData = {
        firstName: response.profileObj.givenName,
        lastName:
          response.profileObj && response.profileObj.familyName
            ? response.profileObj.familyName
            : "",
        email: response.profileObj.email,
        source: "google",
      };
      // console.log(postData);
      handleSocialLogin(postData);
    }
  };

  // const responseFacebook = (response) => {
  //   console.log(response);
  //   if (response.email) {
  //     const postData = {
  //       firstName: response.first_name,
  //       lastName: response.last_name ? response.last_name : "",
  //       email: response.email,
  //       source: "facebook",
  //     };
  //     // console.log(postData);
  //     handleSocialLogin(postData);
  //   }
  // };

  const handleSocialLogin = async (data) => {
    // console.log("data : ", data);
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await API.post("social_login", data);
      if (response.data.success) {
        // const redirectUrl = (response.data.data && response.data.data.is_admin === '1') ? '/users' : '/dashboard';
        if (cartData.forCart && cartData.cart) {
          // await API.post('cart', cartData.cart);
          await API.post("cart", cartData.cart, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          incrementCartCount();
          updateLoginCart({ forCart: false, cart: {} });
          setLoading(false);
          history.replace("/cart");
        } else {
          setLoading(false);
          history.push("/");
        }
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      const errMsg =
        error.response && error.response.data
          ? error.response.data.message
          : COMMON_ERR_MSG;
      setErrorMessage(errMsg);
    }
  };

  const handleLogin = async (values) => {
    // console.log("values : ", values);
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await API.post("login", values);
      setLoading(false);
      if (response.data.success) {
        if (cartData.forCart && cartData.cart) {
          // await API.post('cart', cartData.cart);
          await API.post("cart", cartData.cart, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          incrementCartCount();
          updateLoginCart({ forCart: false, cart: {} });
          history.replace("/cart");
        } else {
          history.push("/");
        }
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      const errMsg =
        error.response && error.response.data
          ? error.response.data.message
          : COMMON_ERR_MSG;
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className={classes.root}>
      <Section className={classes.section}>
        <div className={classes.formContainer}>
          <SectionHeader
            title="Sign In"
            subtitle="Create beautiful personalised maps to celebrate every moment, place and memory."
            titleProps={{
              variant: "h3",
            }}
          />
          <Grid container spacing={3} className={classes.socialLogin}>
            <Grid item xs={12} md={6}>
              <GoogleLogin
                className={classes.googleLoginBtn}
                clientId={G_CLIENT_ID}
                buttonText="SIGN IN WITH GOOGLE"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </Grid>
          </Grid>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            className={classes.socialLogin}
          >
            or login with email address
          </Typography>
          {errorMessage && (
            <Alert className={classes.errorAlert} severity="error">
              {errorMessage}
            </Alert>
          )}
          <Form onLogin={handleLogin} loading={loading} />
          <Typography
            color="textSecondary"
            variant="body1"
            className={classes.forgotPass}
          >
            <Link
              className={classes.cursorPointer}
              variant="body2"
              onClick={() => history.push("/forgot-password")}
            >
              Forgot password?
            </Link>
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
            className={classes.signupLink}
          >
            New To theFront?{" "}
            <Link
              className={classes.cursorPointer}
              onClick={() => history.push("/signup")}
            >
              Sign Up here
            </Link>
          </Typography>
        </div>
      </Section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { cartData: state.cartData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginCart: (cart) => dispatch(updateLoginCart(cart)),
    incrementCartCount: (cart) => dispatch(incrementCartCount(cart)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
