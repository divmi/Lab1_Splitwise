import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      Email: "",
    };
  }

  onNameChange = (e) => {
    console.log(e.target.textContent);
    var value = this.props.tableData.find(
      (x) => x.Name == e.target.textContent
    );
    if (value) {
      this.setState({
        Email: value.Email,
        Name: e.target.textContent,
      });
      this.props.change(e);
    }
  };

  onEmailChange = (e) => {
    var value = this.props.tableData.find((x) => x.Email == e.target.value);
    if (value) {
      this.setState({
        Name: value.Name,
        Email: e.target.value,
      });
      this.props.change(e);
    }
  };

  render() {
    //console.log("Divya :" + this.props.val);
    if (this.props.val.Name != "" && this.props.val.Email != "") {
      return (
        <tr>
          <td>
            <input
              type="text"
              name="userName"
              value={this.state.Name}
              data-id="0"
              id="userName"
              className="form-control "
              onChange={() => {}}
            />
          </td>
          <td>
            <input
              type="text"
              data-testid="id-input-box"
              name="email"
              id="email"
              data-id="0"
              value={this.props.val.Email}
              className="form-control "
              onChange={() => {}}
            />
          </td>
          <td>
            <button
              className="btn"
              onClick={(e) => this.props.delete(e, this.props.val)}
            >
              <i className="fa fa-remove" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>
            <Autocomplete
              className="pding"
              id="free-solo-Name"
              name="Name"
              autoHighlight={true}
              options={this.props.tableData}
              onChange={(e) => this.onNameChange(e)}
              onKeyDown={this.onKeyDownNameChange}
              getOptionLabel={(option) => option.Name}
              style={{ width: 200 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="Name"
                  variant="outlined"
                  size="small"
                  onChange={(e) => this.onNameChange(e)}
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
              getOptionLabel={(option) => option.Email}
              onChange={(e) => this.onEmailChange(e)}
              style={{ width: 200 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="Email"
                  variant="outlined"
                  size="small"
                  onChange={(e) => this.onEmailChange(e)}
                />
              )}
            />
          </td>
          <td>
            <button
              className="btn"
              onClick={(e) => this.props.delete(e, this.props.val)}
            >
              <i className="fa fa-remove" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      );
    }
  }
}
export default NewUser;
