import jwt_decode from "jwt-decode";
import history from "../utils/history";
import API from "../axios/axiosApi";

const TOKEN_NAME = "access_token";

const getAuth = () => {
  return localStorage.getItem("access_token") ? true : false;
};

const logout = async () => {
  localStorage.clear();
  // localStorage.removeItem(TOKEN_NAME);
  // localStorage.removeItem('user_data');
  history.push("/");
};

const getToken = (storageName) => {
  return localStorage.getItem(storageName) !== undefined
    ? localStorage.getItem(storageName)
    : false;
};

const getTokenExpirationDate = (token) => {
  const decoded = jwt_decode(token);
  if (decoded.exp === undefined) return null;
  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);
  return date;
};

const isTokenExpired = (token) => {
  if (!token) token = this.getToken(TOKEN_NAME);
  if (!token) return true;

  const date = this.getTokenExpirationDate(token);
  // console.log("date : ",date);
  if (date === undefined) return true;
  return !(date.valueOf() > new Date().valueOf());
};

/**
 * Check if route is accessible by user (Acts as route guard)
 *
 * @param {*} accessRole
 */
const checkRoute = (accessRole) => {
  try {
    let token = getToken(TOKEN_NAME);
    if (!token) {
      return false;
    }
    // const decoded = jwt_decode(token);
    // if (accessRole && decoded.role !== accessRole) { return false; }
    // if (accessRole && !accessRole.includes(decoded.role)) { return false; }
    let date = getTokenExpirationDate(token);
    let current = new Date();
    if (date.valueOf() < current.valueOf()) {
      console.log("expired");
      logout();
      return false;
    }
    return true;
  } catch (error) {
    console.log("CHECK TOKEN ERROR : ", error);
    logout();
    return false;
  }
};

const checkToken = () => {
  let token = getToken(TOKEN_NAME);
  if (!token) {
    return false;
  }
  let userData = getToken("user_data");
  if (!userData || userData === undefined) {
    return false;
  }
  userData = JSON.parse(userData);
  let date = getTokenExpirationDate(token);
  let current = new Date();

  if (date.valueOf() < current.valueOf()) {
    console.log("-- expired --");
    logout();
    return false;
  }

  if (current.valueOf() >= date.valueOf() - 24 * 60 * 60000) {
    // 60 * 60000 = 1hr
    console.log("Time to refresh token");
    refreshToken(token, userData);
    return false;
  } else {
    // console.log("Token is valid for more than 2 min");
    return true;
  }
};

const refreshToken = async (token, userData) => {
  try {
    const data = { token, userData };
    await API.post("refresh_token", data);
    // console.log("response ==> ",response);
  } catch (error) {
    logout();
    console.log("ERROR in refreshToken : ", error);
  }
};

const decodeAccessToken = () => {
  let token = getToken(TOKEN_NAME);
  if (!token) {
    return false;
  }
  return jwt_decode(token);
};

const AuthService = {
  getAuth,
  logout,
  checkToken,
  isTokenExpired,
  decodeAccessToken,
  checkRoute,
};

export default AuthService;
