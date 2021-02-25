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
      auth: true,
      userData: [],
      allUser: [],
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
      userData: [
        ...prevState.userData,
        { index: Math.random(), userName: "", email: "" },
      ],
    }));
  };

  addMainUserToList() {
    this.setState(() => ({
      userData: [
        ...this.state.userData,
        {
          index: Math.random(),
          userName: cookie.load("cookie").Name,
          email: cookie.load("cookie").Email,
        },
      ],
    }));
  }

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
    //this.addMainUserToList();
    //set the with credentials to true
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
            error:
              "<p style={{color: red}}>Please enter correct credentials</p>",
            authFlag: false,
          });
        }
      })
      .catch((e) => {
        this.setState({
          error: "Please enter correct credentials" + e,
        });
      });
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
            error:
              "<p style={{color: red}}>Please enter correct credentials</p>",
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
  }

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
    let { userData } = this.state;
    console.log(userData);
    console.log(cookie.load("cookie"));
    if (cookie.load("cookie")) {
      {
        redirectVar = <Redirect to="/createGroup" />;
      }
    } else redirectVar = <Redirect to="/login" />;
    //if (this.state.userData.length != 0) {
    return (
      <div className="container-fluid form-cont">
        {redirectVar}
        <div className="flex-container">
          <div className="col-sm-2">
            <img
              src="./assets/Logo.png"
              alt="..."
              width={200}
              height={200}
            ></img>
            <label>Select your profile picture:</label>{" "}
            <input
              className="btn btn-secondary"
              style={{
                margin: 20,
                width: 250,
                textAlign: "left",
              }}
              type="file"
              name="image"
              onChange={this.handleFileUpload}
            />
          </div>
          <div>
            <h3>Start a group Name</h3>
            <div className="content">
              <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <div className="row" style={{ marginTop: 20 }}>
                  <div className="col-sm-1"></div>
                  <div className="col-sm-10">
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
                                  value={cookie.load("cookie").Name}
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
                                  value={cookie.load("cookie").Email}
                                  className="form-control "
                                  readOnly
                                />
                              </td>
                            </tr>
                            <NewUser
                              add={this.addNewRow}
                              delete={this.clickOnDelete.bind(this)}
                              userData={userData}
                              tableData={this.state.allUser}
                              change={this.handleNameChange.bind(this)}
                              emailChange={this.handleEmailChange.bind(this)}
                            />
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
    //} else {
    //return <div></div>;
    //}
  }
}

export default CreateGroup;
