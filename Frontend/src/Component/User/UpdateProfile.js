import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import timezones from "../../data/timezone";
import map from "lodash/map";
import { Redirect } from "react-router-dom";
import { updateProfile } from "../../actions/updateUserProfile";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetSuccessFlag } from "../../actions/loginAction";
import config from "../../config";
import axios from "axios";

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userinfo: {
        ContactNo: "",
        Currency: "",
        Language: "",
        Name: "",
        Timezone: "",
        Email: "",
        UserProfilePic: "",
      },
      error: {},
      loginError: "",
      auth: false,
      dropdownOpen: true,
      UserProfilePic: "",
    };
    this.toggle = this.toggle.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.setState({ absolute: !this.state.absolute });
  }

  handleChange = (e) => {
    this.setState({
      userinfo: {
        ...this.state.userinfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  componentDidUpdate(prevState) {
    if (prevState.authFlag != this.props.authFlag && this.props.authFlag) {
      this.SetLocalStorage(JSON.stringify(this.state.userinfo));
      this.props.resetSuccessFlag();
    }
  }
  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        this.setState({
          userinfo: Object.assign(
            this.state.userinfo,
            JSON.parse(localStorage.getItem("userData"))
          ),
        });
      }
    }
  }

  SetLocalStorage(data) {
    if (typeof Storage !== "undefined") {
      localStorage.clear();
      localStorage.setItem("userData", data);
    }
  }

  submitForm = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const error = this.validateForm();
    if (Object.keys(error).length == 0) {
      let data = this.state.userinfo;
      data.UserProfilePic = this.state.UserProfilePic;
      this.props.updateProfile(data);
    }
  };

  validateForm = () => {
    var error = {};
    return error;
  };

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

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
          UserProfilePic: response.data,
        });
        console.log(this.state.UserProfilePic);
      })
      .catch((error) => console.log("error " + error));
  };

  render() {
    let redirectVar = null;
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data == null) {
      redirectVar = <Redirect to="/login" />;
    } else if (this.props.authFlag) {
      redirectVar = <Redirect to="/home" />;
    } else redirectVar = <Redirect to="/updateProfile" />;
    let picture = "";
    if (this.state.UserProfilePic != "") {
      picture = this.state.UserProfilePic;
    } else if (this.state.userinfo.UserProfilePic != "") {
      picture = this.state.userinfo.UserProfilePic;
    } else {
      picture = "./assets/userIcon.jpg";
    }
    const options = map(timezones, (val, key) => (
      <option key={val} value={val}>
        {key}
      </option>
    ));
    return (
      <div>
        {redirectVar}
        <div
          className="container-fluid"
          style={{ marginLeft: "250px", marginTop: "90px" }}
        >
          <div className="content">
            <h2 style={{ textAlign: "left" }}>Your Account</h2>
            <div className="row">
              <div className="col col-sm-2">
                <img src={picture} alt="..." width={200} height={200}></img>
                <label>Change your avatar</label>
                <input
                  className="btn"
                  style={{
                    marginLeft: "-10px",
                    width: 250,
                    textAlign: "left",
                  }}
                  type="file"
                  name="image"
                  onChange={this.handleFileUpload}
                />
              </div>
              <div className="col col-sm-8">
                <Form>
                  <div className="row">
                    <div className="col col-sm-5" style={{ textAlign: "left" }}>
                      <FormGroup>
                        <Label for="name" style={{ textAlign: "left" }}>
                          Your name
                        </Label>
                        <Input
                          type="text"
                          id="Name"
                          name="Name"
                          data-testid="Name-input-box"
                          placeholder="First Name"
                          value={this.state.userinfo.Name}
                          onChange={this.handleChange}
                        ></Input>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="Email"
                          name="Email"
                          placeholder="Email"
                          value={this.state.userinfo.Email}
                          onChange={this.handleChange}
                          readOnly
                        ></Input>
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="contactNo">Your Phone number</Label>
                        <Input
                          type="text"
                          id="ContactNo"
                          name="ContactNo"
                          minLength="10"
                          maxLength="10"
                          min="0"
                          placeholder="Contact Number"
                          onChange={this.handleChange}
                          value={
                            this.state.userinfo.ContactNo == null
                              ? ""
                              : this.state.userinfo.ContactNo
                          }
                        ></Input>
                      </FormGroup>
                    </div>
                    <div
                      className="col col-sm-5 "
                      style={{ textAlign: "left" }}
                    >
                      <FormGroup>
                        <Label for="currency" style={{ textAlign: "left" }}>
                          Currency
                        </Label>
                        <select
                          className="form-control bfh-currencies"
                          name="Currency"
                          data-currency="EUR"
                          value={this.state.userinfo.Currency}
                          onChange={this.handleChange}
                        >
                          <option
                            data-symbol="$"
                            value="$"
                            data-placeholder="0.00"
                          >
                            USD
                          </option>
                          <option
                            data-symbol="€"
                            value="€"
                            data-placeholder="0.00"
                          >
                            EUR
                          </option>
                          <option
                            data-symbol="£"
                            value="£"
                            data-placeholder="0.00"
                          >
                            GBP
                          </option>
                          <option
                            data-symbol="¥"
                            value="¥"
                            data-placeholder="0"
                          >
                            KWD
                          </option>
                          <option
                            data-symbol="C$"
                            value="C$"
                            data-placeholder="0.00"
                          >
                            CAD
                          </option>
                          <option
                            data-symbol=".د.ب"
                            value=".د.ب"
                            data-placeholder="0.00"
                          >
                            BHD
                          </option>
                        </select>
                        {/* <FormFeedback>{this.state.error.name}</FormFeedback> */}
                      </FormGroup>
                      <FormGroup>
                        <label className="control-label">Timezone</label>
                        <select
                          className="form-control"
                          name="Timezone"
                          value={this.state.userinfo.Timezone}
                          onChange={this.handleChange}
                        >
                          <option value="" disabled>
                            Choose Your Timezone
                          </option>
                          {options}
                        </select>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="language">Language</Label>
                        <select
                          value={this.state.userinfo.Language}
                          className="form-control"
                          name="Language"
                          data-width="fit"
                          onChange={this.handleChange}
                        >
                          <option>English</option>
                          <option>Español</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>Russian</option>
                        </select>
                      </FormGroup>
                    </div>
                  </div>
                  <FormGroup row>
                    <Col>
                      <Button
                        type="submit"
                        onClick={this.submitForm}
                        color="btn btn-signup "
                      >
                        Save
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            </div>
            <div>
              <div
                id="errorLogin"
                hidden={this.state.loginError.length > 0 ? false : true}
                className="alert alert-danger"
                role="alert"
              >
                {this.state.loginError}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdateProfile.propTypes = {
  updateProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    authFlag: state.updateProfile.authFlag,
  };
};

export default connect(mapStateToProps, {
  updateProfile,
  resetSuccessFlag,
})(UpdateProfile);
