import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import { isEmail } from "validator";
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
import Home from "../Header/HomeComponent";

class Login extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        email: "",
        password: "",
        error: "",
        formerror: {},
        auth: true,
      };
    }
  }

  validateForm = () => {
    const userInfo = this.state;
    let error = {};

    if (!isEmail(userInfo.email)) error.email = "Please enter valid mail";
    if (userInfo.email === "") error.email = "Email should not be blank";
    if (userInfo.password === "")
      error.password = "Password should not be blank";
    return error;
  };

  emailEventHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  passEventHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  ///LoginUser'
  submitForm = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    const formerror = this.validateForm();
    if (Object.keys(formerror).length == 0) {
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post("http://localhost:8000/loginUser", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            this.setState({
              error: "",
              authFlag: true,
            });
            <Home></Home>;
          } else {
            this.setState({
              error: "Please enter correct credentials",
              authFlag: false,
            });
          }
        })
        .catch(() => {
          this.setState({
            error: "Please enter correct credentials",
          });
        });
    } else {
      this.setState({ formerror });
    }
  };

  render() {
    let redirectVar = null;
    console.log(cookie.load("cookie"));
    if (cookie.load("cookie")) redirectVar = <Redirect to="/home" />;
    else redirectVar = <Redirect to="/login" />;
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
            <div
              id="errorLogin"
              hidden={this.state.error.length > 0 ? false : true}
              className="alert alert-danger"
              role="alert"
            >
              {this.state.error}
            </div>
            <h3>WELCOME TO SPLITWISE</h3>
            <Form onSubmit={this.handleSubmit} className="form-stacked">
              <FormGroup>
                <Label htmlFor="email" className="Lable-align">
                  Email address
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  onChange={this.emailEventHandler}
                  invalid={this.state.formerror.email ? true : false}
                ></Input>
                <FormFeedback>{this.state.formerror.email}</FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.passEventHandler}
                  invalid={this.state.formerror.password ? true : false}
                ></Input>
                <FormFeedback>{this.state.formerror.password}</FormFeedback>
              </FormGroup>
              <FormGroup row>
                <Col>
                  <Button
                    type="submit"
                    onClick={this.submitForm}
                    color="btn btn-primary"
                  >
                    Login
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
