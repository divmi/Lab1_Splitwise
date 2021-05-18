import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

class NewUser extends Component {
  constructor(props) {
    super(props);
    this.onNameChange = this.onNameChange.bind(this);
  }

  onNameChange = e => {
    // if (e.target.value != null && e.target.value.length > 1) {
    //   const data = { Name: e.target.value, Email: "" };
    //   this.props.getAllUser(data);
    // }
    var value = this.props.tableData.find(x => x.Name == e.target.textContent);
    if (value) {
      this.props.change(e);
    }
  };

  onEmailChange = e => {
    // if (e.target.value != null && e.target.value.length > 1) {
    //   const data = { Name: "", Email: e.target.value };
    //   this.props.getAllUser(data);
    // }
    var value = this.props.tableData.find(x => x.Email == e.target.textContent);
    if (value) {
      this.props.emailChange(e);
    }
  };

  render() {
    return (
      <tr>
        <td>
          <Autocomplete
            className="pding"
            id="free-solo-Name"
            name="Name"
            autoHighlight={true}
            options={this.props.tableData}
            getOptionLabel={option => option.Name}
            onChange={this.onNameChange}
            style={{ width: 200 }}
            renderInput={params => (
              <TextField
                {...params}
                name="Name"
                onChange={this.onNameChange}
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
            name="Email"
            autoHighlight={true}
            options={this.props.tableData}
            getOptionLabel={option => option.Email}
            onChange={this.onEmailChange}
            style={{ width: 200 }}
            renderInput={params => (
              <TextField
                {...params}
                name="Email"
                variant="outlined"
                size="small"
                onChange={this.onEmailChange}
              />
            )}
          />
        </td>
        <td>
          <button
            className="btn"
            onClick={e => this.props.delete(e, this.props.val, false)}
          >
            <i className="fa fa-remove" aria-hidden="true"></i>
          </button>
        </td>
      </tr>
    );
  }
}

export default NewUser;
