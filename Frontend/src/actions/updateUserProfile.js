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

export const UploadPicture = (data) => (dispatch) => {
  console.log(JSON.stringify(data));
  axios
    .post(`http://${config.ipAddress}:8000/upload`, data)
    .then((response) => {
      dispatch({
        type: action.Upload_Image,
        payload: `http://${config.ipAddress}:8000/` + response.data,
      });
    })
    .catch(() => {
      return dispatch({
        type: action.Upload_Image,
        payload: "./assets/userIcon.jpg",
      });
    });
};
