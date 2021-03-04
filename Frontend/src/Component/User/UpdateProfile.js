import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
import cookie from "react-cookies";
import timezones from "../../data/timezone";
import map from "lodash/map";

import { Redirect } from "react-router-dom";
//import TimezonePicker from "react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker";

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        name: "",
        email: "",
        contactNo: "",
        currency: "",
        timeZone: "",
        language: "",
      },
      error: {},
      loginError: "",
      auth: false,
      dropdownOpen: true,
      profilePhoto: "./assets/userIcon.jpg",
      photoPath: "",
    };
    this.handletimeZoneChange = this.handletimeZoneChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    // this.setState({ allUser: this.getAllUser() });
    if (cookie.load("cookie")) {
      this.setState({
        userInfo: {
          name: cookie.load("cookie").Name,
          email: cookie.load("cookie").Email,
          contactNo: "",
          currency: "",
          timeZone: "",
          language: "",
          auth: true,
        },
      });
    }
  }

  handletimeZoneChange(newValue) {
    this.setState({ timeZone: newValue });
  }

  handleToggle() {
    this.setState({ absolute: !this.state.absolute });
  }

  handleChange = (e) => {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  submitForm = (e) => {
    //prevent page from refresh
    e.preventDefault();

    const { userInfo } = this.state;
    const error = this.validateForm();
    if (Object.keys(error).length == 0) {
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post("http://localhost:8000/updateProfile", userInfo)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            this.setState({
              loginError: "",
              authFlag: true,
            });
            alert("Successfully Created! Please Conitnue to Login");
          } else {
            this.setState({
              loginError:
                "<p style={{color: red}}>User is already registered</p>",
              authFlag: false,
            });
          }
        })
        .catch(() => {
          this.setState({
            loginError: "User is already registered",
          });
        });
    } else {
      this.setState({ error });
    }
  };

  validateForm = () => {
    // const { userInfo } = this.state;
    let error = {};
    // if (userInfo.name === "") error.name = "First Name should not be blank";
    // //if (!isEmail(userInfo.email)) error.email = "Please enter valid mail";
    // if (userInfo.email === "") error.email = "Email should not be blank";
    // if (userInfo.password === "")
    //   error.password = "Password should not be blank";
    return error;
  };

  handleChange(newValue) {
    this.setState({ timeZone: newValue });
  }
  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  handleFileUpload = (event) => {
    let data = new FormData();
    data.append("file", event.target.files[0]);
    this.setState({
      photoPath: data,
    });
    // event.preventDefault();
    // let data = new FormData();
    // console.log(event.target.files[0]);
    // data.append("file", event.target.files[0]);
    // axios
    //   .post("http://localhost:8000/upload", data)
    //   .then((response) => {
    //     console.log(response);
    //     this.setState({
    //       profilePhoto: "localhost:8000/assets/" + response.data,
    //     });
    //   })
    //   .catch((error) => console.log("error " + error));
  };

  render() {
    console.log(cookie.load("cookie"));
    let redirectVar = null;
    if (!cookie.load("cookie")) redirectVar = <Redirect to="/login" />;
    else redirectVar = <Redirect to="/updateProfile" />;
    const { error } = this.state;
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
                <img
                  src={this.state.profilePhoto}
                  alt="..."
                  width={200}
                  height={200}
                ></img>
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
                <div>
                  Current Value: <b>{this.state.timeZone}</b>
                </div>
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
                          id="name"
                          name="name"
                          placeholder="First Name"
                          invalid={this.state.error.name ? true : false}
                          value={this.state.userInfo.name}
                          onChange={this.handleChange}
                        ></Input>
                        <FormFeedback>{this.state.error.name}</FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Email"
                          value={cookie.load("cookie").Email}
                          onChange={this.handleChange}
                          invalid={this.state.error.email ? true : false}
                        ></Input>
                      </FormGroup>
                      <FormFeedback>{this.state.error.email}</FormFeedback>

                      <FormGroup>
                        <Label htmlFor="contactNo">Your Phone number</Label>
                        <Input
                          type="number"
                          id="contactNo"
                          name="contactNo"
                          minLength="10"
                          maxLength="10"
                          min="0"
                          placeholder="Contact Number"
                          // value={cookie.load("cookie").ContactNo}
                          onChange={this.handleChange}
                          invalid={this.state.error.contactNo ? true : false}
                        ></Input>
                        <FormFeedback>
                          {this.state.error.contactNo}
                        </FormFeedback>
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
                          name="currency"
                          data-currency="EUR"
                          defaultValue="USD"
                        >
                          <option
                            data-symbol="$"
                            data-placeholder="0.00"
                            selected
                          >
                            USD
                          </option>
                          <option data-symbol="€" data-placeholder="0.00">
                            EUR
                          </option>
                          <option data-symbol="£" data-placeholder="0.00">
                            GBP
                          </option>
                          <option data-symbol="¥" data-placeholder="0">
                            KWD
                          </option>
                          <option data-symbol="$" data-placeholder="0.00">
                            CAD
                          </option>
                          <option data-symbol="$" data-placeholder="0.00">
                            BHD
                          </option>
                        </select>
                        <FormFeedback>{this.state.error.name}</FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <div className="form-group">
                          <label className="control-label">Timezone</label>
                          <select
                            className="form-control"
                            name="timezone"
                            onChange={this.onChange}
                            value={this.state.timezone}
                          >
                            <option value="" disabled>
                              Choose Your Timezone
                            </option>
                            {options}
                          </select>
                          {error.timezone && (
                            <span className="help-block">{error.timezone}</span>
                          )}
                        </div>
                      </FormGroup>
                      <FormFeedback>{this.state.error.email}</FormFeedback>

                      <FormGroup>
                        <Label htmlFor="language">Language</Label>
                        <select
                          className="form-control"
                          name="language"
                          data-width="fit"
                        >
                          <option selected>English</option>
                          <option>Español</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>Russian</option>
                        </select>
                        <FormFeedback>{this.state.error.password}</FormFeedback>
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

export default UpdateProfile;
