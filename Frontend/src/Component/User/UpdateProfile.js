import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import axios from "axios";
import cookie from "react-cookies";
import timezones from "../../data/timezone";
import map from "lodash/map";
import { Redirect } from "react-router-dom";

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
        UserProfilePic: "",
      },
      error: {},
      loginError: "",
      auth: false,
      dropdownOpen: true,
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

  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData"))
        console.log(JSON.parse(localStorage.getItem("userData")));
      this.setState({
        userinfo: Object.assign(
          this.state.userinfo,
          JSON.parse(localStorage.getItem("userData"))
        ),
      });
      if (this.state.userinfo.UserProfilePic == null) {
        this.setState({
          UserProfilePic: `./assets/userIcon.jpg`,
        });
      } else {
        this.setState({
          UserProfilePic: this.state.userinfo.UserProfilePic,
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
    const data = this.state.userinfo;
    data.UserProfilePic = this.state.UserProfilePic;
    if (Object.keys(error).length == 0) {
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      console.log(JSON.stringify(this.state.userinfo));
      //make a post request with the user data
      axios
        .post("http://localhost:8000/updateProfile", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            this.setState({
              authFlag: true,
            });
            this.SetLocalStorage(JSON.stringify(data));
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
      .post("http://localhost:8000/upload", data)
      .then((response) => {
        console.log(response);
        this.setState({
          UserProfilePic: "http://localhost:8000/" + response.data,
        });
      })
      .catch((error) => console.log("error " + error));
  };

  render() {
    let redirectVar = null;
    if (!cookie.load("cookie")) redirectVar = <Redirect to="/login" />;
    else if (this.state.authFlag) {
      redirectVar = <Redirect to="/home" />;
    } else redirectVar = <Redirect to="/updateProfile" />;
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
                  src={this.state.UserProfilePic}
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
                          placeholder="First Name"
                          // invalid={this.state.error.name ? true : false}
                          value={this.state.userinfo.Name}
                          onChange={this.handleChange}
                        ></Input>
                        {/* <FormFeedback>{this.state.error.name}</FormFeedback> */}
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="Email"
                          name="Email"
                          placeholder="Email"
                          value={cookie.load("cookie").Email}
                          onChange={this.handleChange}
                          //invalid={this.state.error.email ? true : false}
                          readOnly
                        ></Input>
                      </FormGroup>
                      {/* <FormFeedback>{this.state.error.email}</FormFeedback> */}

                      <FormGroup>
                        <Label htmlFor="contactNo">Your Phone number</Label>
                        <Input
                          type="number"
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
                          // invalid={this.state.error.contactNo ? true : false}
                        ></Input>
                        {/* <FormFeedback>
                          {this.state.error.contactNo}
                        </FormFeedback> */}
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
                          <option data-symbol="$" data-placeholder="0.00">
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
                        {/* {error.timezone && (
                            <span className="help-block">{error.timezone}</span>
                          )} */}
                      </FormGroup>
                      {/* <FormFeedback>{this.state.error.email}</FormFeedback> */}

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
                        {/*<FormFeedback>{this.state.error.password}</FormFeedback> */}
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

// const mapStateToProps = (state) => {
//   return { userinfo: state.login.userinfo[0] };
// };

export default UpdateProfile; //connect(mapStateToProps)
