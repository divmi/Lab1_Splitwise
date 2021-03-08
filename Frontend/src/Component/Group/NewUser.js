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
    if (value) {
      this.setState({
        email: value.Email,
        name: e.target.innerText,
      });
      this.props.change(e);
    }
  };

  onEmailChange = (e) => {
    var value = this.props.tableData[0].find(
      (x) => x.Email == e.target.innerText
    );
    if (value) {
      this.setState({
        name: value.Name,
        email: e.target.innerText,
      });
      this.props.change(e);
    }
  };

  render() {
    return (
      <tr>
        <td>
          <Autocomplete
            className="pding"
            id="free-solo-Name"
            freeSolo
            options={this.props.tableData[0]}
            onChange={(e) => this.onNameChange(e)}
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
        </td>
        <td>
          <Autocomplete
            className="pding"
            id="free-solo-Email"
            freeSolo
            options={this.props.tableData[0]}
            getOptionLabel={(option) => option.Email}
            onChange={(e) => this.onEmailChange(e)}
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
        </td>
        <td>
          {
            <button
              className="btn"
              onClick={() => this.props.delete(this.props.val.index)}
            >
              <i className="fa fa-remove" aria-hidden="true"></i>
            </button>
          }
        </td>
      </tr>
    );
  }
}
export default NewUser;
