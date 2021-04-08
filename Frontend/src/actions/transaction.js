import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const transactionDetail = (ID, page, size) => (dispatch) => {
  console.log("dispatching the action");
  const storageToken = localStorage.getItem("userData");
  axios.defaults.headers.common["authorization"] = storageToken.token;
  //make a get request with the user data
  const url = `http://${config.ipAddress}:8000/getTransactionFromUser?ID=${ID}&page=${page}&size=${size}`;
  console.log(url);
  axios
    .get(url)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: action.Load_Transaction,
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Load_Transaction,
          payload: Object.assign(error.response.data),
        });
      }
    });
};
