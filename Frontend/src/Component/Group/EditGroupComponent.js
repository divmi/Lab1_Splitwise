import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import { editGroup } from "../../actions/home";
import { connect } from "react-redux";

class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      newGroupName: "",
      error: "",
      groupPhoto: "",
      auth: false,
      userData: [],
      itemDeleted: {},
    };
  }

  handleSubmit = (e) => {
    //prevent page from refresh
    e.preventDefault();
    let error = this.validateForm();
    const data = {
      prevGroupName: this.props.match.params.value,
      newGroupName: this.state.groupName,
      groupPhoto: this.state.groupPhoto,
      itemDeleted: this.state.itemDeleted,
    };
    if (Object.keys(error).length == 0) {
      this.props.editGroup(data);
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

  getMemberInfo() {
    let findGroup = this.props.groupInfo.find(
      (x) => x.GroupName == this.props.match.params.value
    );
    if (typeof findGroup != "undefined") {
      this.setState({
        userData: findGroup.GroupMemberInfo,
      });
      console.log(JSON.stringify(this.state.userData));
    }
    // axios
    //   .get(`http://${config.ipAddress}:8000/getGroupMemberName`, {
    //     params: {
    //       groupName: this.props.match.params.value,
    //     },
    //   })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log("All user:" + response.data);
    //       this.setState(() => ({
    //         userData: response.data,
    //       }));
    //     } else {
    //       this.setState({
    //         error: "Please enter correct credentials",
    //         authFlag: false,
    //       });
    //     }
    //   })
    //   .catch((e) => {
    //     this.setState({
    //       error: "Please enter correct credentials" + e,
    //     });
    //   });
  }

  handleItemDeleted(e, i) {
    e.preventDefault();
    var items = this.state.userData;
    axios
      .get(`http://${config.ipAddress}:8000/getUserCanBeDeleted`, {
        params: {
          email: i.Email,
          groupName: this.props.match.params.value,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          let amountFound = false;
          console.log("All user:" + response.data);
          if (response.data.length > 0) {
            response.data.map((member) => {
              if (member.Amount !== 0) {
                alert("Please settle up the amount before leaving group");
                amountFound = true;
              }
            });
            if (amountFound == false) {
              items.splice(items.indexOf(i), 1);
              this.setState({
                userData: items,
              });
              this.setState({
                itemDeleted: i,
              });
            }
          } else {
            items.splice(items.indexOf(i), 1);
            this.setState({
              userData: items,
            });
            this.setState({
              itemDeleted: i,
            });
          }
        }
      })
      .catch((e) => {
        this.setState({
          error: "Network error" + e,
        });
      });
  }

  componentDidMount() {
    console.log(this.props.match.params.value);
    if (this.props.match.params.value != "") {
      this.setState({
        groupName: this.props.match.params.value,
      });
      this.getMemberInfo();
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
      .post(`http://${config.ipAddress}:8000/upload`, data)
      .then((response) => {
        console.log(response);
        this.setState({
          groupPhoto: `http://${config.ipAddress}:8000/` + response.data,
        });
        console.log(this.state.groupPhoto);
      })
      .catch((error) => console.log("error " + error));
  };

  render() {
    let redirectVar = null;
    let message = null;
    let picture = "";
    let groupMemberName = [];
    if (this.state.authFlag) {
      message = <Redirect to="/home" />;
    }
    if (this.state.userData != null && this.state.userData.length > 0) {
      // if (this.state.groupPhoto != "") picture = this.state.groupPhoto;
      // else if (this.state.userData[0].GroupProfilePicture == "")
      //   picture = "../assets/userIcon.jpg";
      // else picture = this.state.userData[0].GroupProfilePicture;

      groupMemberName = this.state.userData.map((val, idx) => {
        console.log(val);
        return (
          <tr key={idx}>
            <td>
              <input
                type="text"
                name="userName"
                value={val.Name}
                data-id="0"
                id="userName"
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
                value={val.Email}
                className="form-control "
                readOnly
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
    } else {
      picture = "../assets/userIcon.jpg";
    }
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
                  Edit Your Group
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
                                value={this.state.groupName}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="card-header text-center">
                          Your Group Member
                        </div>
                        <table className="table">
                          <tbody>{groupMemberName}</tbody>
                        </table>
                      </div>
                      <div className="card-footer text-center">
                        <button
                          type="submit"
                          className="btn btn-Normal text-center"
                          onClick={this.handleSubmit}
                        >
                          Save Changes
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

const mapStateToProps = (state) => {
  return {
    groupInfo: state.homeReducer.groupInfo,
  };
};

export default connect(mapStateToProps, { editGroup })(EditGroup);
