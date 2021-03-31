import * as action from "./actionTypes";
import config from "../config";
import axios from "axios";

export const getGroupSummary = (ID) => (dispatch) => {
  console.log("dispatching the action");
  axios.defaults.withCredentials = true;
  //make a get request with the user data
  const url = `http://${config.ipAddress}:8000/getGroupSummary?ID=${ID}`;
  console.log(url);
  axios
    .get(url)
    .then((response) => {
      if (response.status == 200) {
        console.log("Got data :" + response.data);
        dispatch({
          type: action.Load_OwsGets_Detail,
          payload: response.data,
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: action.Load_OwsGets_Detail,
          payload: Object.assign(error.response.data),
        });
      }
    });
};

// export const GroupMemberName = (groupName) => (dispatch) => {
//   axios.defaults.withCredentials = true;
//   //make a get request with the user data
//   const url = `http://${config.ipAddress}:8000/getGroupMemberName?groupName=${groupName}`;
//   axios
//     .get(url)
//     .then((response) => {
//       if (response.status === 200) {
//         dispatch({
//           type: action.Load_Group_Member_Name,
//           payload: response.data,
//         });
//         //this.calculateMemberSpecificTable();
//       }
//     })
//     .catch((error) => {
//       if (error.response && error.response.data) {
//         return dispatch({
//           type: action.Load_Group_Member_Name,
//           payload: Object.assign(error.response.data),
//         });
//       }
//     });
// };
