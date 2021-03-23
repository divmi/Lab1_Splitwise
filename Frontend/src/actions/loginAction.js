import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const userLogin = (loginData) => (dispatch) => {
  console.log("dispatching the action");
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  axios
    .post(`http://${config.ipAddress}:8000/loginUser`, loginData)
    .then((response) =>
      dispatch({
        type: action.Login_USER,
        payload: response.data,
      })
    )
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Login_USER,
          payload: Object.assign(error.response.data),
        });
      }
    });
};

export const userLogout = () => (dispatch) => {
  return dispatch({ type: action.Logout_USER, payload: {} });
};
