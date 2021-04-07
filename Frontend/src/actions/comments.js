import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const addCommentsToDatabase = (data) => (dispatch) => {
  console.log("dispatching the action addCommentsToDatabase");
  const storageToken = localStorage.getItem("userData");
  axios.defaults.headers.common["authorization"] = storageToken.token;
  //make a post request with the user data
  axios
    .post(`http://${config.ipAddress}:8000/addComment`, data)
    .then((response) => {
      if (response.status == 200)
        dispatch(getCommentFromDatabase(data.transactionID));
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Insert_Comments,
          payload: false,
        });
      }
    });
};

export const deleteCommentFromDatabase = (data) => (dispatch) => {
  console.log("dispatching the action addCommentsToDatabase");
  const storageToken = localStorage.getItem("userData");
  axios.defaults.headers.common["authorization"] = storageToken.token;
  //make a post request with the user data
  axios
    .post(`http://${config.ipAddress}:8000/deleteComment`, data)
    .then((response) => {
      if (response.status == 200)
        dispatch(getCommentFromDatabase(data.transactionID));
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Delete_Comments,
          payload: Object.assign(error.response.data),
        });
      }
    });
};

export const getCommentFromDatabase = (transID) => (dispatch) => {
  console.log("dispatching the action");
  const storageToken = localStorage.getItem("userData");
  axios.defaults.headers.common["authorization"] = storageToken.token;
  axios
    .get(
      `http://${config.ipAddress}:8000/getCommentForTransaction?transID=${transID}`
    )
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: action.Get_Comments,
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Get_Comments,
          payload: Object.assign(error.response.data),
        });
      }
    });
};
