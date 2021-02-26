import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
    };
  }

  onNameChange = (e) => {
    var value = this.props.tableData[0].find(
      (x) => x.Name == e.target.innerText
    );
    console.log(value);
    //let email = [...this.state.email];
    //email[idx] = value.Email;
    this.setState({
      email: value.Email,
    });
    this.props.change(e);
  };

  render() {
    //return this.props.userData.map((val, idx) => {
    //let userName = `userName-${idx}`;
    //console.log("userName" + userName);
    return (
      <tr>
        <td>
          <Autocomplete
            className="pding"
            id="free-solo-Name"
            freeSolo
            options={this.props.tableData[0]}
            onChange={(e) => this.onNameChange(e)} //(e) => props.change(e)
            getOptionLabel={(option) => option.Name}
            style={{ width: 200 }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="username"
                variant="outlined"
                size="small"
              />
            )}
          />
          {/* <input
          type="text"
          name="userName"
          data-id={idx}
          id={userName + 1}
          className="form-control "
        /> */}
        </td>
        <td>
          <Autocomplete
            className="pding"
            id="free-solo-Email"
            freeSolo
            options={this.props.tableData[0]}
            getOptionLabel={(option) => option.Email}
            onChange={(e) => this.props.emailChange(e)}
            inputValue={this.state.email}
            style={{ width: 200 }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="email"
                variant="outlined"
                size="small"
              />
            )}
          />
          {/* <input 
          type="text"
          name="email"
          id={email + 1}
          data-id={idx}
          className="form-control "
        /> */}
        </td>
        <td>
          {
            <button
              className="btn"
              onClick={() => this.props.delete(this.props.val)}
            >
              <i className="fa fa-remove" aria-hidden="true"></i>
            </button>
          }
        </td>
      </tr>
    );
    //});
  }
}
// const NewUser = (props) => {
//   let allUser = props.tableData;
//   let email;
//   console.log("all users :" + JSON.stringify(allUser));

//   function Name(e) {
//     props.change(e);
//     var data = allUser[0].find((x) => x.Name == e.target.innerText);
//     if (data) {
//       email = data.Email;
//     }
//   }
//   return props.userData.map((val, idx) => {
//     let userName = `userName-${idx}`;
//     console.log("userName" + userName);
//     return (

//     );
//   });
//};
export default NewUser;
