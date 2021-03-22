import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
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
import { isEmail } from "validator";
import config from "../../config";
import { connect } from "react-redux";
import * as Action from "../../actions/actionCreators";

// const mapStateToProps = (state) => {
//   return {
//     name: state.name,
//     email: state.email,
//     password: state.password,
//   };
// };
class Register extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        userInfo: {
          name: "",
          email: "",
          password: "",
        },
        error: {},
        loginError: "",
        auth: true,
      };
    }
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
    const data = {
      name: userInfo.name,
      email: userInfo.email,
    };
    const error = this.validateForm();
    if (Object.keys(error).length == 0) {
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post(`http://${config.ipAddress}:8000/signupUser`, userInfo)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            this.setState({
              loginError: "",
              authFlag: true,
            });
            this.props.RegisterUser({ data }); //reducer call
            this.SetLocalStorage(data);
            alert("Successfully Created! Please Continue to Login");
          } else {
            this.setState({
              loginError: "User is already registered",
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

  SetLocalStorage(userInfo) {
    if (typeof Storage !== "undefined") {
      localStorage.clear();
      try {
        let data = {
          Name: userInfo.name,
          Email: userInfo.email,
          Currency: "$",
          Timezone: "America/Los_Angeles",
          Language: "English",
          ContactNo: "80XXXXXXXXX",
          UserProfilePic: "./assets/userIcon.jpg",
        };
        console.log(data);
        localStorage.setItem("userData", JSON.stringify(data));
      } catch (error) {
        console.log(error);
      }
    }
  }

  validateForm = () => {
    const { userInfo } = this.state;
    let error = {};
    if (userInfo.name === "") error.name = "First Name should not be blank";
    if (!isEmail(userInfo.email)) error.email = "Please enter valid mail";
    if (userInfo.email === "") error.email = "Email should not be blank";
    if (userInfo.password === "")
      error.password = "Password should not be blank";
    return error;
  };

  render() {
    let redirectVar = null;
    if (cookie.load("cookie")) redirectVar = <Redirect to="/home" />;
    else redirectVar = <Redirect to="/register" />;
    return (
      <>
        <div className="container-fluid form-cont">
          {redirectVar}
          <div className="flex-container">
            <div className="row">
              <div className="col col-sm-6">
                <img src="./assets/splitwiselogo-01.png" alt="..."></img>
              </div>
              <div className="col col-sm-6">
                <div
                  id="errorLogin"
                  hidden={this.state.loginError.length > 0 ? false : true}
                  className="alert alert-danger"
                  role="alert"
                >
                  {this.state.loginError}
                </div>
                <h3>Introduce Yourself</h3>
                <Form onSubmit={this.handleSubmit} className="form-stacked">
                  <FormGroup>
                    <Label for="firstname" style={{ fontSize: "24px" }}>
                      Hi there!My name is
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="First Name"
                      invalid={this.state.error.name ? true : false}
                      onChange={this.handleChange}
                    ></Input>
                    <FormFeedback>{this.state.error.name}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="email">
                      Here&apos;s my <strong>email address</strong>
                    </Label>
                    <Input
                      data-testid="email-input-box"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      onChange={this.handleChange}
                      invalid={this.state.error.email ? true : false}
                    ></Input>
                    <FormFeedback>{this.state.error.email}</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="password">
                      And here&apos;s my <strong>password</strong>
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      onChange={this.handleChange}
                      invalid={this.state.error.password ? true : false}
                    ></Input>
                    <FormFeedback>{this.state.error.password}</FormFeedback>
                  </FormGroup>
                  <FormGroup row>
                    <Col>
                      <Button
                        type="submit"
                        onClick={this.submitForm}
                        color="btn btn-Normal"
                      >
                        Sign me up!
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    RegisterUser: (data) => dispatch(Action.RegisterUser(data)),
  };
}

export default connect(null, mapDispatchToProps)(Register); //
