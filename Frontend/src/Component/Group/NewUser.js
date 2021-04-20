import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { connect } from "react-redux";
import { getAllUser } from "../../actions/createGroup";

class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      Email: ""
    };
    this.onNameChange = this.onNameChange.bind(this);
  }

  onNameChange = e => {
    if (e.target.value != null && e.target.value.length > 1) {
      const data = { Name: e.target.value, Email: "" };
      this.props.getAllUser(data);
    }

    var value = this.props.tableData.find(x => x.Name == e.target.textContent);
    if (value) {
      this.setState({
        Email: value.Email,
        Name: e.target.textContent
      });
      this.props.change(e);
    }
  };

  onEmailChange = e => {
    if (e.target.value.length > 1) {
      const data = { Name: "", Email: e.target.value };
      this.props.getAllUser(data);
    }
    var value = this.props.tableData.find(x => x.Email == e.target.textContent);
    if (value) {
      this.setState({
        Name: value.Name,
        Email: e.target.value
      });
      this.props.emailChange(e);
    }
  };

  render() {
    if (this.props.val.Name != "" && this.props.val.Email != "") {
      return (
        <tr>
          <td>
            <input
              type="text"
              name="Name"
              value={this.props.val.Name}
              data-id="0"
              id="Name"
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
              onClick={e => this.props.delete(e, this.props.val)}
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
              onClick={e => this.props.delete(e, this.props.val)}
            >
              <i className="fa fa-remove" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      );
    }
  }
}
const mapStateToProps = state => {
  return {
    allUser: state.createGroup.allUser
  };
};

export default connect(mapStateToProps, {
  getAllUser
})(NewUser);
