import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const updateProfile = (userData) => (dispatch) => {
  console.log("dispatching the action");
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  axios
    .post(`http://${config.ipAddress}:8000/updateProfile`, userData)
    .then((response) => {
      if (response.status == 200)
        dispatch({
          type: action.Update_Profile,
          payload: true,
        });
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Update_Profile,
          payload: false,
        });
      }
    });
};
