import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const getAllUser = data => dispatch => {
  console.log("dispatching the getAllUser :" + data);
  const storageToken = JSON.parse(localStorage.getItem("userData"));
  axios.defaults.headers.common["authorization"] = storageToken.token;
  axios
    .post(`http://${config.ipAddress}:8000/user/getAllUser`, data)
    .then(response => {
      if (response.status == 200) {
        dispatch({
          type: action.Load_AllUser,
          payload: response.data
        });
      }
    })
    .catch(error => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Load_AllUser,
          payload: Object.assign(error.response.data)
        });
      }
    });
};

export const sendCreateGroupRequest = groupData => dispatch => {
  console.log("dispatching the action");
  const storageToken = JSON.parse(localStorage.getItem("userData"));
  console.log(storageToken.token);
  axios.defaults.headers.common["authorization"] = storageToken.token;
  console.log(`http://${config.ipAddress}:8000/group/createGroup`);
  axios
    .post(`http://${config.ipAddress}:8000/group/createGroup`, groupData)
    .then(response => {
      if (response.status == 200) {
        dispatch({
          type: action.Create_Group,
          payload: true
        });
      } else if (response.status == 500) {
        dispatch({
          type: action.Error,
          payload: false
        });
      }
    })
    .catch(error => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Error,
          payload: false
        });
      }
    });
};
