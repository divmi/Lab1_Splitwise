import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const getUserSpecificTransactionDetail = (ID) => (dispatch) => {
  console.log("dispatching the action");
  const storageToken = localStorage.getItem("userData");
  axios.defaults.headers.common["authorization"] = storageToken.token;
  //make a get request with the user data
  const url = `http://${config.ipAddress}:8000/getUserSpecificGetOwsInfo?ID=${ID}`;
  console.log(url);
  axios
    .get(url)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: action.Load_Transaction_Per_User,
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Load_Transaction_Per_User,
          payload: Object.assign(error.response.data),
        });
      }
    });
};

export const settleUp = (data) => (dispatch) => {
  const storageToken = localStorage.getItem("userData");
  axios.defaults.headers.common["authorization"] = storageToken.token;
  axios
    .post(`http://${config.ipAddress}:8000/settleUp`, data)
    .then((response) => {
      if (response.status == 200)
        dispatch({
          type: action.Settled_UP,
          payload: response.data,
        });
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Settled_UP,
          payload: Object.assign(error.response.data),
        });
      }
    });
};
