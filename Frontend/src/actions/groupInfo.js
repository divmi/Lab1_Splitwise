import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const getTransactionDetail = (ID) => (dispatch) => {
  console.log("dispatching the action");
  axios.defaults.withCredentials = true;
  //make a get request with the user data
  const url = `http://${config.ipAddress}:8000/getTransactionInfo?ID=${ID}`;
  console.log(url);
  axios
    .get(url)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: action.Load_GroupBased_Transaction,
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Load_GroupBased_Transaction,
          payload: Object.assign(error.response.data),
        });
      }
    });
};

export const addTransactionToDatabase = (data) => (dispatch) => {
  console.log("dispatching the action addTransactionToDatabase");
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  axios
    .post(`http://${config.ipAddress}:8000/insertGroupTransaction`, data)
    .then((response) => {
      if (response.status == 200)
        dispatch({
          type: action.Insert_Group_Transaction,
          payload: response.data,
        });
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Insert_Group_Transaction,
          payload: Object.assign(error.response.data),
        });
      }
    });
};
