import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const getUserDetails = (Email) => (dispatch) => {
  console.log("dispatching the action");
  axios.defaults.withCredentials = true;
  //make a get request with the user data
  const url = `http://${config.ipAddress}:8000/getCurrentUserGroup?ID=${Email}`;
  console.log(url);
  axios
    .get(url)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: action.Load_GroupName,
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Load_GroupName,
          payload: Object.assign(error.response.data),
        });
      }
    });
};
