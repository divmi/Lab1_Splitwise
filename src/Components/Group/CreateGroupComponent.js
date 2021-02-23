import React, { Component } from "react";
import cookie from "react-cookies";
import { Link, Redirect } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import NewUser from "./NewUser";
import axios from "axios";
import Dashboard from "../DashBoard";

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

  handleChange = (e) => {
    if (["userName", "email"].includes(e.target.name)) {
      let userData = [...this.state.userData];
      userData[e.target.dataset.id][e.target.name] = e.target.value;
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  addNewRow = (e) => {
    this.setState((prevState) => ({
      userData: [
        ...prevState.userData,
        { index: Math.random(), userName: "", email: "" },
      ],
    }));
  };

  deleteRow = (index) => {
    this.setState({
      userData: this.state.userData.filter((s, sindex) => index !== sindex),
    });
  };

  ///LoginUser'
  handleSubmit = (e) => {
    //prevent page from refresh
    e.preventDefault();
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios
      .post("http://localhost:8000/createGroup", this.state)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            error: "",
            authFlag: true,
          });
          <Dashboard></Dashboard>;
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

  // getUserDetail(cookie) {
  //   this.setState((prevState) => ({
  //     userData: [
  //       ...prevState.userData,
  //       {
  //         index: Math.random(),
  //         userName: cookie.Name,
  //         email: cookie.Email,
  //       },
  //     ],
  //   }));
  // }

  // async getUserDetail(email) {
  //   await axios
  //     .get("http://localhost:8000/getUserInfo", {
  //       params: {
  //         userEmail: email,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         console.log("Got response data :" + response.data);
  //         this.setState((prevState) => ({
  //           userData: [
  //             ...prevState.userData,
  //             {
  //               index: Math.random(),
  //               userName: response.data[0].Name,
  //               email: response.data[0].Email,
  //             },
  //           ],
  //         }));
  //       } else {
  //         this.setState({
  //           error:
  //             "<p style={{color: red}}>Please enter correct credentials</p>",
  //           authFlag: false,
  //         });
  //       }
  //     })
  //     .catch((e) => {
  //       this.setState({
  //         error: "Please enter correct credentials" + e,
  //       });
  //     });
  // }

  async getAllUser() {
    await axios
      .get("http://localhost:8000/getAllUser")
      .then((response) => {
        if (response.status === 200) {
          console.log("All user:" + response.data);
          this.setState((prevState) => ({
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
    //this.getUserDetail(cookie.load("cookie"));
    this.setState({ allUser: this.getAllUser() });
  }

  render() {
    let redirectVar = null;
    let getDetail = null;
    let { userData } = this.state;
    console.log(userData);
    console.log(cookie.load("cookie"));
    if (cookie.load("cookie")) {
      {
        redirectVar = <Redirect to="/createGroup" />;
        getDetail = true;
      }
    } else redirectVar = <Redirect to="/login" />;
    //if (this.state.userData.length != 0) {
    return (
      <div className="container-fluid form-cont">
        {redirectVar}
        <div className="flex-container">
          <div>
            <img
              src="./assets/Logo.png"
              alt="..."
              width={200}
              height={200}
            ></img>
          </div>
          <div>
            <h3>Start a group Name</h3>
            <div className="content">
              <NotificationContainer />
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
                                  readonly
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
                                  readonly
                                />
                              </td>
                            </tr>
                            <NewUser
                              add={this.addNewRow}
                              delete={this.clickOnDelete.bind(this)}
                              userData={userData}
                              tableData={this.state.allUser}
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
                        {" "}
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
