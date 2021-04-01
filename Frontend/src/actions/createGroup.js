import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const getAllUser = () => (dispatch) => {
  console.log("dispatching the action");
  const storageToken = localStorage.getItem("userData");
  axios.defaults.headers.common["authorization"] = storageToken.token;
  axios
    .get(`http://${config.ipAddress}:8000/getAllUser`)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: action.Load_AllUser,
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Load_AllUser,
          payload: Object.assign(error.response.data),
        });
      }
    });
};

export const sendCreateGroupRequest = (groupData) => (dispatch) => {
  console.log("dispatching the action");
  const storageToken = localStorage.getItem("userData");
  axios.defaults.headers.common["authorization"] = storageToken.token;
  axios
    .post(`http://${config.ipAddress}:8000/createGroup`, groupData)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: action.Create_Group,
          payload: true,
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Create_Group,
          payload: false,
        });
      }
    });
};
