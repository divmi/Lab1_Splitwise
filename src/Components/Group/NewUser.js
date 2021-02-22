import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";

//Need to complete auto suggestions
// Teach Autosuggest how to calculate suggestions for any given input value.
// const getSuggestions = (value) => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;

//   return inputLength === 0
//     ? []
//     : languages.filter(
//         (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
//       );
// };

// const getSuggestionValue = (suggestion) => suggestion.name;

const NewUser = (props) => {
  return props.userData.map((val, idx) => {
    let userName = `userName-${idx}`,
      email = `email-${idx}`;
    console.log("userName" + userName);
    let allUser = props.tableData;
    console.log("all users :" + JSON.stringify(allUser));
    return (
      <tr key={val.index}>
        <td>
          <input
            type="text"
            name="userName"
            data-id={idx}
            id={userName + 1}
            className="form-control "
          />
        </td>
        <td>
          <input
            type="text"
            name="email"
            id={email + 1}
            data-id={idx}
            className="form-control "
          />
        </td>
        <td>
          {
            <button className="btn" onClick={() => props.delete(val)}>
              <i className="fa fa-remove" aria-hidden="true"></i>
            </button>
          }
        </td>
      </tr>
    );
  });
};
export default NewUser;
