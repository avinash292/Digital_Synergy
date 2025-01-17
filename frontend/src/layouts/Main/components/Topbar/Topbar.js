import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import MenuList from "@material-ui/core/MenuList";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Badge from "@material-ui/core/Badge";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";

import { Image } from "components/atoms";
import AuthService from "services/authService";
import history from "utils/history";
import API from "../../../../axios/axiosApi";
import { SERVER_PATH, PROFILE_IMAGE_PATH } from "../../../../config";
import { updateCartCount, onUserProfileUpdate } from "redux/actions";

const useStyles = makeStyles((theme) => ({
  root: {},
  flexGrow: {
    flexGrow: 1,
  },
  navigationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toolbar: {
    maxWidth: theme.layout.contentWidth,
    width: "100%",
    margin: "0 auto",
    padding: theme.spacing(0, 2),
  },
  listItem: {
    cursor: "pointer",
    paddingTop: 0,
    paddingBottom: 0,
  },
  listItemText: {
    flex: "0 0 auto",
    whiteSpace: "nowrap",
    textDecoration: "none",
  },
  listItemButton: {
    whiteSpace: "nowrap",
  },
  iconButton: {
    padding: 0,
    "&:hover": {
      background: "transparent",
    },
  },
  logoContainer: {
    width: 100,
    height: 28,
    [theme.breakpoints.up("md")]: {
      width: 120,
      height: 32,
    },
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  popperStyle: {
    zIndex: 1,
  },
  avatar: {
    cursor: "pointer",
  },
  title: {},
}));

const Topbar = ({
  onSidebarOpen,
  pages,
  cartCount,
  updateCartCount,
  products,
  profileData,
  onUserProfileUpdate,
  ...rest
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [productsAnchorEl, setProductsAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const openProducts = Boolean(productsAnchorEl);

  const decoded = AuthService.decodeAccessToken();
  const userDataLocal =
    localStorage.getItem("user_data") !== null &&
    localStorage.getItem("user_data") !== undefined
      ? JSON.parse(localStorage.getItem("user_data"))
      : decoded;
  const [userData, setUserData] = useState(userDataLocal);
  // console.log(decoded);
  const imageAssetPath = SERVER_PATH + PROFILE_IMAGE_PATH;
  const [imageSource] = useState(imageAssetPath + userData.profile_image);
  // const [imageSource, setImageSource] = useState(imageAssetPath + userData.profile_image);

  useEffect(() => {
    setUserData((userData) => ({ ...userData, ...profileData }));
  }, [profileData]);

  useEffect(() => {
    const isLoggedIn = AuthService.getAuth();
    if (isLoggedIn) {
      const fetchCartCount = async () => {
        try {
          const response = await API.get("cart/count");
          if (response.data.success && response.data.data) {
            updateCartCount(response.data.data.count);
          }
        } catch (error) {
          console.log("ERROR in fetchCartCount : ", error);
          // const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
          // handleSnackToogle(errorMsg);
        }
      };
      fetchCartCount();

      const fetchUserProfile = async () => {
        try {
          const response = await API.get("profile");
          if (response.data.success && response.data.data) {
            const profileDetails = response.data.data.profile_details;
            const profile = {
              full_name:
                profileDetails.first_name + " " + profileDetails.last_name,
              mobile: profileDetails.mobile,
            };
            setUserData((userData) => ({ ...userData, ...profile }));
            onUserProfileUpdate(profile);
          }
        } catch (error) {
          console.log("ERROR in fetchUserProfile : ", error);
        }
      };
      fetchUserProfile();
    }
  }, [updateCartCount, onUserProfileUpdate]);

  const logoutUser = () => {
    AuthService.logout();
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      // setOpenProducts(false);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProductsMenuClick = (event) => {
    setProductsAnchorEl(event.currentTarget);
  };

  const handleProductsMenuClose = (event, product) => {
    setProductsAnchorEl(null);
    if (product && product.label) {
      switch (product.label) {
        case "star_map":
          return history.push("/starmap");
        case "city_map":
          return history.push("/citymap");
        case "coordinate_poster":
          return history.push("/coordinate-poster");
        case "family_poster":
          return history.push("/family-poster");
        case "dog_poster":
          return history.push("/dog-poster");
        case "businessCard":
          return history.push("/userBusinessCardList");
        default:
          return history.push("/starmap");
      }
    }
  };

  return (
    <Toolbar disableGutters className={classes.toolbar} {...rest}>
      <div className={classes.logoContainer}>
        <a href="/" title="thefront">
          {/* <Typography className={classes.title} variant="h4">Posteresque</Typography> */}
          <Image
            className={classes.logoImage}
            src="/images/logos/logo.svg"
            alt="thefront"
            lazy={false}
          />
        </a>
      </div>
      <div className={classes.flexGrow} />
      <Hidden smDown>
        <List className={classes.navigationContainer}>
          <ListItem className={classes.listItem}>
            <Typography
              variant="body1"
              color="textSecondary"
              className={classes.listItemText}
              component="a"
              href="/home"
            >
              Home
            </Typography>
          </ListItem>

          <ListItem className={classes.listItem}>
            <Typography
              variant="body1"
              color="textSecondary"
              className={classes.listItemText}
              component="a"
              href="/connectList"
            >
              Connect List
            </Typography>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Typography
              variant="body1"
              color="textSecondary"
              className={classes.listItemText}
              component="a"
              href="/ConnectRequest"
            >
              Connect Request
            </Typography>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Typography
              variant="body1"
              color="textSecondary"
              className={classes.listItemText}
              component="a"
              href="/userconnectList"
            >
              Connection
            </Typography>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Typography
              variant="body1"
              color="textSecondary"
              className={classes.listItemText}
              onClick={handleProductsMenuClick}
            >
              Products
            </Typography>
          </ListItem>

          {AuthService.checkToken() ? (
            <div>
              <Avatar
                alt={userData.full_name}
                className={classes.avatar}
                // component={RouterLink}
                src={imageSource}
                // to="/profile"
                onClick={handleClick}
              >
                {userData && userData.full_name && userData.full_name[0]
                  ? userData.full_name[0]
                  : "U"}
              </Avatar>
            </div>
          ) : (
            <ListItem className={classes.listItem}>
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.listItemText}
                component={Link}
                to="/signin"
              >
                Sign In
              </Typography>
            </ListItem>
          )}

          <Popover
            open={openProducts}
            anchorEl={productsAnchorEl}
            onClose={handleProductsMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <React.Fragment>
              <MenuList
                autoFocusItem={openProducts}
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
              >
                {products && products.length ? (
                  products.map((singleProduct, index) => (
                    <MenuItem
                      variant="body1"
                      color="textSecondary"
                      className={classes.listItemText}
                      key={index}
                      onClick={(event) =>
                        handleProductsMenuClose(event, singleProduct)
                      }
                    >
                      {singleProduct.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No products added yet!</MenuItem>
                )}
              </MenuList>
            </React.Fragment>
          </Popover>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <React.Fragment>
              <MenuItem component={Link} to="/profile" onClick={handleClose}>
                {" "}
                {/* /profile/account */}
                <ListItemIcon className={classes.listIcon}>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>
              <MenuItem component={Link} to="/cart" onClick={handleClose}>
                <ListItemIcon className={classes.listIcon}>
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="My Cart" />
              </MenuItem>
              <MenuItem component={Link} to="/orders" onClick={handleClose}>
                <ListItemIcon className={classes.listIcon}>
                  <PresentToAllIcon />
                </ListItemIcon>
                <ListItemText primary="My Orders" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={logoutUser}>
                <ListItemIcon className={classes.listIcon}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </React.Fragment>
          </Popover>
        </List>
      </Hidden>
      <Hidden mdUp>
        <IconButton
          className={classes.iconButton}
          onClick={onSidebarOpen}
          aria-label="Menu"
        >
          <MenuIcon />
        </IconButton>
      </Hidden>
    </Toolbar>
  );
};

Topbar.propTypes = {
  onSidebarOpen: PropTypes.func,
  pages: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCartCount: (cartCount) => dispatch(updateCartCount(cartCount)),
    onUserProfileUpdate: (profile) => dispatch(onUserProfileUpdate(profile)),
  };
};

const mapStateToProps = (state) => {
  return { cartCount: state.cartCount, profileData: state.profile };
};

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
