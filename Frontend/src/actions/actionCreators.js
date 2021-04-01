import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const RegisterUser = (data) => (dispatch) => {
  console.log("dispatching the action");
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  console.log(`http://${config.ipAddress}:8000/login/signupUser`);
  axios
    .post(`http://${config.ipAddress}:8000/login/signupUser`, data)
    .then((response) =>
      dispatch({
        type: action.REGISTER_USER,
        payload: response.data,
      })
    )
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.REGISTER_USER,
          payload: Object.assign(error.response.data),
        });
      }
    });
};
