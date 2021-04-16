import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const getUserDetails = Email => dispatch => {
  console.log("dispatching the action");
  const storageToken = localStorage.getItem("userData");
  axios.defaults.headers.common["authorization"] = storageToken.token;
  //make a get request with the user data
  const url = `http://${config.ipAddress}:8000/group/getCurrentUserGroup?ID=${Email}`;
  console.log(url);
  axios
    .get(url)
    .then(response => {
      if (response.status == 200) {
        dispatch({
          type: action.Load_GroupName,
          payload: response.data
        });
      }
    })
    .catch(error => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Load_GroupName,
          payload: Object.assign(error.response.data)
        });
      }
    });
};

export const editGroup = data => dispatch => {
  console.log("dispatching the action");
  const storageToken = JSON.parse(localStorage.getItem("userData"));
  console.log(storageToken.token);
  axios.defaults.headers.common["authorization"] = storageToken.token;
  console.log(`http://${config.ipAddress}:8000/group/updateGroup`);
  //make a post request with the user data
  axios
    .post(`http://${config.ipAddress}:8000/group/updateGroup`, data)
    .then(response =>
      dispatch({
        type: action.Edit_Group,
        payload: response.data
      })
    )
    .catch(error => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Edit_Group,
          payload: Object.assign(error.response.data)
        });
      }
    });
};

export const GroupRequestAccepted = (name, id) => dispatch => {
  let data = {
    name: name,
    id: id
  };
  const storageToken = JSON.parse(localStorage.getItem("userData"));
  console.log(storageToken.token);
  axios.defaults.headers.common["authorization"] = storageToken.token;
  axios
    .post(`http://${config.ipAddress}:8000/group/joinedGroup`, data)
    .then(response => {
      if (response.status === 200) {
        dispatch(getUserDetails(id));
      }
    })
    .catch(error => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Load_GroupName,
          payload: Object.assign(error.response.data)
        });
      }
    });
};
