import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
//import NewUser from "./NewUser";
import axios from "axios";
class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      error: "",
      groupPhoto: "",
      auth: false,
      userData: [],
      allUser: [],
      name: "",
      email: "",
    };
  }

  OnNameChange = (e) => {
    //if (["userName"].includes(e.target.id)) {
    if (typeof e.target != "undefined" && e.target.innerText != "") {
      let userDataBackup = [...this.state.userData];
      //userData[e.target.dataset.id][e.target.name] = e.target.innerText;
      let found = this.state.allUser[0].find(
        (element) => element.Name == e.target.innerText
      );
      if (found) {
        let item = {
          ...userDataBackup[userDataBackup.length - 1],
          Name: found.Name,
          Email: found.Email,
        };
        userDataBackup[userDataBackup.length - 1] = item;
        this.setState({
          userData: userDataBackup,
        });
        console.log(JSON.stringify(this.state.userData));
      }
    }
  };

  onEmailChange = (e) => {
    if (typeof e.target != "undefined" && e.target.innerText != "") {
      let userData = [...this.state.userData];
      let found = this.state.allUser[0].find(
        (element) => element.Name == e.target.innerText
      );
      if (found) {
        let item = {
          ...userData[userData.length - 1],
          Name: found.Name,
          Email: found.Email,
        };
        userData[userData.length - 1] = item;
        this.setState({
          userData,
        });
      }
      console.log(JSON.stringify(this.state.userData));
    }
  };

  addNewRow = () => {
    this.setState((prevState) => ({
      i: prevState.i + 1,
      userData: [...prevState.userData, { Name: "", Email: "" }],
    }));
  };

  handleSubmit = (e) => {
    //prevent page from refresh
    e.preventDefault();
    let error = this.validateForm();
    //set the with credentials to true
    if (Object.keys(error).length == 0) {
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:8000/createGroup", this.state)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            this.setState({
              error: "",
              authFlag: true,
            });
          } else {
            this.setState({
              error: "Group is already registered",
              authFlag: false,
            });
          }
        })
        .catch(() => {
          this.setState({
            error: "Group is already registered",
            authFlag: false,
          });
        });
    } else {
      this.setState({
        error: error,
        authFlag: false,
      });
    }
  };

  groupNameEventHandler = (e) => {
    this.setState({
      groupName: e.target.value,
    });
  };

  async getAllUser() {
    await axios
      .get("http://localhost:8000/getAllUser")
      .then((response) => {
        if (response.status === 200) {
          console.log("All user:" + response.data);
          this.setState(() => ({
            allUser: [response.data],
          }));
        } else {
          this.setState({
            error: "Please enter correct credentials",
            authFlag: false,
          });
        }
      })
      .catch((e) => {
        this.setState({
          error: "Please enter correct credentials" + e,
        });
      });
  }

  handleItemDeleted(e, i) {
    e.preventDefault();
    console.log("value of i is :" + JSON.stringify(i));
    var items = this.state.userData;
    console.log("value of stringy is :" + JSON.stringify(items));
    items.splice(items.indexOf(i), 1);
    this.setState({
      userData: items,
    });
  }

  componentDidMount() {
    this.setState({ allUser: this.getAllUser() });
    if (cookie.load("cookie")) {
      this.setState({ name: cookie.load("cookie").Name });
      this.setState({ email: cookie.load("cookie").Email });
    }
  }

  validateForm = () => {
    let error = "";
    if (this.state.groupName === "") error = "Group Name should not be blank";
    return error;
  };

  handleFileUpload = (event) => {
    event.preventDefault();
    let data = new FormData();
    console.log(event.target.files[0]);
    data.append("file", event.target.files[0]);
    axios
      .post("http://localhost:8000/upload", data)
      .then((response) => {
        console.log(response);
        this.setState({
          groupPhoto: "http://localhost:8000/" + response.data,
        });
      })
      .catch((error) => console.log("error " + error));
  };

  render() {
    let redirectVar = null;
    let message = null;
    let picture = null;
    if (this.state.groupPhoto == "") {
      picture = "./assets/userIcon.jpg";
    } else {
      picture = this.state.groupPhoto;
    }
    if (this.state.authFlag) {
      message = <Redirect to="/home" />;
    }
    let x = this.state.userData.map((val, idx) => {
      return (
        <tr key={idx}>
          <td>
            <Autocomplete
              className="pding"
              id="Name"
              name="Name"
              options={this.state.allUser[0]}
              onChange={this.OnNameChange}
              getOptionLabel={(option) => option.Name}
              style={{ width: 200 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="Name"
                  variant="outlined"
                  size="small"
                  onChange={({ target }) => this.OnNameChange(target.value)}
                />
              )}
            />
          </td>
          <td>
            <Autocomplete
              className="pding"
              id="Email"
              name="Email"
              options={this.state.allUser[0]}
              getOptionLabel={(option) => option.Email}
              onChange={this.onEmailChange}
              style={{ width: 200 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="Email"
                  variant="outlined"
                  size="small"
                  onChange={({ target }) => this.onEmailChange(target.value)}
                />
              )}
            />
          </td>
          <td>
            <button
              className="btn"
              onClick={(e) => this.handleItemDeleted(e, val)}
            >
              <i className="fa fa-remove" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      );
    });
    if (!cookie.load("cookie")) redirectVar = <Redirect to="/login" />;
    return (
      <div className="container-fluid">
        {message}
        {redirectVar}
        <div className="row rounded" style={{ alignContent: "center" }}>
          <div className="col-sm-2 offset-2" style={{ marginTop: "100px" }}>
            <img src={picture} alt="..." width={200} height={200}></img>
            <label>Select your profile picture:</label>
            <input
              className="btn"
              style={{
                marginLeft: "-20px",
                width: 230,
                textAlign: "left",
              }}
              type="file"
              name="image"
              onChange={this.handleFileUpload}
            />
          </div>
          <div className="col-sm-8">
            <div
              className="help-block alert"
              style={{ color: "red", width: "30%" }}
            >
              {this.state.error}
            </div>
            <div className="content" style={{ width: "90%" }}>
              <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h3 style={{ textAlign: "left", marginLeft: "70px" }}>
                  Start a Group Name
                </h3>
                <div className="row">
                  <div className="col-sm-1"></div>
                  <div className="col-sm-8">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-group ">
                              <label className="required">
                                My Group shall be called:
                              </label>
                              <textarea
                                name="groupName"
                                id="groupName"
                                className="form-control"
                                onChange={this.groupNameEventHandler}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="card-header text-center">
                          Add Your Group Member
                        </div>
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  name="Name"
                                  data-id="0"
                                  id="Name"
                                  value={this.state.name}
                                  className="form-control "
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="Email"
                                  id="Email"
                                  data-id="0"
                                  value={this.state.email}
                                  className="form-control "
                                  readOnly
                                />
                              </td>
                            </tr>
                            {x}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td>
                                <button
                                  onClick={this.addNewRow}
                                  type="button"
                                  className="btn text-center"
                                >
                                  <i
                                    className="fa fa-plus-circle"
                                    aria-hidden="true"
                                  ></i>
                                  Add a person
                                </button>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="card-footer text-center">
                        <button
                          type="submit"
                          className="btn btn-Normal text-center"
                          onClick={this.handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-1"></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateGroup;
