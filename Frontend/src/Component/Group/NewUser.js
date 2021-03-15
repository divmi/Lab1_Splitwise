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

  componentDidMount() {}

  onNameChange = (e) => {
    var value = this.props.tableData[0].find(
      (x) => x.Name == e.target.innerText
    );
    if (value) {
      this.setState({
        Email: value.Email,
        Name: e.target.innerText,
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
        Name: value.Name,
        Email: e.target.innerText,
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
            name="Name"
            freeSolo
            options={this.props.tableData[0]}
            onChange={(e) => this.onNameChange(e)}
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
            freeSolo
            options={this.props.tableData[0]}
            inputValue={this.props.val.Email}
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
export default NewUser;
