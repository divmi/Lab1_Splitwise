import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import NewUser from "./NewUser";
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

  handleNameChange = (e) => {
    //if (["userName"].includes(e.target.id)) {
    if (e.target.innerText != "") {
      let userData = [...this.state.userData];
      //userData[e.target.dataset.id][e.target.name] = e.target.innerText;
      let found = this.state.allUser[0].find(
        (element) => element.Name == e.target.innerText
      );
      if (found) {
        let item = {
          ...userData[userData.length - 1],
          userName: found.Name,
          email: found.Email,
        };
        userData[userData.length - 1] = item;
        this.setState({
          userData,
        });
      }
    }
    //}
    else {
      this.setState({ ["userName"]: e.target.value });
    }
  };

  handleEmailChange = (e) => {
    //if (["userName"].includes(e.target.id)) {
    if (e.target.innerText != "") {
      let userData = [...this.state.userData];
      //userData[e.target.dataset.id][e.target.name] = e.target.innerText;
      let found = this.state.allUser[0].find(
        (element) => element.Name == e.target.innerText
      );
      if (found) {
        let item = {
          ...userData[userData.length - 1],
          userName: found.Name,
          email: found.Email,
        };
        userData[userData.length - 1] = item;
        this.setState({
          userData,
        });
      }
    }
    //}
    else {
      this.setState({ ["email"]: e.target.value });
    }
  };

  addNewRow = () => {
    this.setState((prevState) => ({
      i: prevState.i + 1,
      userData: [
        ...prevState.userData,
        { index: Math.random(), userName: "", email: "" },
      ],
    }));
  };

  deleteRow = (index) => {
    index.preventDefault();
    this.setState({
      userData: this.state.userData.filter((s, sindex) => index !== sindex),
    });
  };

  ///LoginUser'
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

  clickOnDelete(record) {
    this.setState({
      userData: this.state.userData.filter((r) => r !== record),
    });
  }

  componentDidMount() {
    this.setState({ allUser: this.getAllUser() });
    this.setState({ name: cookie.load("cookie").Name });
    this.setState({ email: cookie.load("cookie").Email });
  }

  validateForm = () => {
    let error = "";
    if (this.state.groupName === "") error = "Group Name should not be blank";
    return error;
  };

  handleFileUpload = (event) => {
    let data = new FormData();
    console.log(event.target.files[0]);
    data.append("file", event.target.files[0]);
    data.append("name", "group_pic");
    axios
      .post("http://localhost:8000/upload", data)
      .then((response) => {
        console.log(response);
        this.setState({
          groupPhoto: response.data,
        });
      })
      .catch((error) => console.log("error " + error));
  };

  render() {
    let redirectVar = null;
    let message = null;
    if (this.state.authFlag) {
      message = <Redirect to="/home" />;
    }
    let x = this.state.userData.map((val, idx) => {
      return (
        <NewUser
          key={idx}
          val={val}
          delete={this.clickOnDelete.bind(this)}
          tableData={this.state.allUser}
          change={this.handleNameChange.bind(this)}
          emailChange={this.handleEmailChange.bind(this)}
        />
      );
    });
    if (cookie.load("cookie")) {
      {
        redirectVar = <Redirect to="/createGroup" />;
      }
    } else redirectVar = <Redirect to="/login" />;
    return (
      <div className="container-fluid">
        {message}
        {redirectVar}
        <div className="row" style={{ alignContent: "center" }}>
          <div
            className="col-sm-2"
            style={{ marginLeft: "100px", marginTop: "100px" }}
          >
            <img
              src="./assets/Logo.png"
              alt="..."
              width={200}
              height={200}
            ></img>
            <label>Select your profile picture:</label>{" "}
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
          <div className="col-sm-9">
            <div
              className="help-block alert"
              style={{ color: "red", width: "30%" }}
            >
              {this.state.error}
            </div>
            <div className="content" style={{ width: "80%", margin: "20px" }}>
              <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h3 style={{ textAlign: "left", marginLeft: "70px" }}>
                  Start a group Name
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
                                  name="userName"
                                  data-id="0"
                                  id="userName"
                                  value={this.state.name}
                                  className="form-control "
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="email"
                                  id="email"
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
                          className="btn btn-primary text-center"
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
