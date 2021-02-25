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
import { Redirect } from "react-router-dom";
import TimezonePicker from "react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker";

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        currency: "",
        timeZone: "",
      },
      error: {},
      loginError: "",
      auth: true,
      dropdownOpen: true,
    };
    this.handletimeZoneChange = this.handletimeZoneChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
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
    const { userInfo } = this.state;
    let error = {};
    if (userInfo.name === "") error.name = "First Name should not be blank";
    //if (!isEmail(userInfo.email)) error.email = "Please enter valid mail";
    if (userInfo.email === "") error.email = "Email should not be blank";
    if (userInfo.password === "")
      error.password = "Password should not be blank";
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
    console.log(event.target.files[0]);
    data.append("file", event.target.files[0]);
    data.append("name", "prof_pic");
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
    console.log(cookie.load("cookie"));
    let redirectVar = null;
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div>
        {redirectVar}
        <div className="container-fluid">
          <div className="container">
            <h2 style={{ textAlign: "left" }}>Your Account</h2>
            <div className="row">
              <div className="col col-sm-2">
                <img
                  src="./assets/userIcon.jpg"
                  alt="..."
                  width={200}
                  height={200}
                ></img>
                <label>Change your avatar</label>
                <input
                  className="btn btn-secondary"
                  style={{
                    margin: 10,
                    width: 150,
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
              <div className="col col-sm-8" style={{ margin: "30px" }}>
                <Form onSubmit={this.handleSubmit}>
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
                          value={cookie.load("cookie").Name}
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
                          placeholder="Contact Number"
                          value={cookie.load("cookie").ContactNo}
                          onChange={this.handleChange}
                          invalid={this.state.error.password ? true : false}
                        ></Input>
                        <FormFeedback>{this.state.error.password}</FormFeedback>
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
                        <div className="row col-sm-3">
                          <Label htmlFor="timeZone">Timezone</Label>
                        </div>
                        <div
                          className="row col-sm-12"
                          style={{ boxSizing: "content-box" }}
                        >
                          <TimezonePicker
                            placeholder="Select timezone..."
                            onChange={this.handletimeZoneChange}
                            value={this.state.timeZone}
                          />
                        </div>
                      </FormGroup>
                      <FormFeedback>{this.state.error.email}</FormFeedback>

                      <FormGroup>
                        <Label htmlFor="language">Language</Label>
                        <select className="form-control" data-width="fit">
                          <option>English</option>
                          <option>Español</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>Russian</option>
                        </select>

                        {/* <Input
                        type="text"
                        id="language"
                        name="language"
                        placeholder="Contact Number"
                        value={cookie.load("cookie").Language}
                        onChange={this.handleChange}
                        invalid={this.state.error.password ? true : false}
                      ></Input> */}

                        <FormFeedback>{this.state.error.password}</FormFeedback>
                      </FormGroup>
                    </div>
                  </div>
                  <FormGroup row>
                    <Col>
                      <Button
                        type="submit"
                        onClick={this.submitForm}
                        color="btn btn-primary"
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
