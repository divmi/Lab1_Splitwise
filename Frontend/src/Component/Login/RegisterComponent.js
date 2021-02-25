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
import { isEmail } from "validator";
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

  // nameEventHandler = (e) => {
  //   this.setState({
  //     name: e.target.value,
  //   });
  // };

  // emailEventHandler = (e) => {
  //   this.setState({
  //     email: e.target.value,
  //   });
  // };

  // passEventHandler = (e) => {
  //   this.setState({
  //     password: e.target.value,
  //   });
  // };

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
        .post("http://localhost:8000/signupUser", userInfo)
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
    if (!isEmail(userInfo.email)) error.email = "Please enter valid mail";
    if (userInfo.email === "") error.email = "Email should not be blank";
    if (userInfo.password === "")
      error.password = "Password should not be blank";
    return error;
  };

  render() {
    return (
      <>
        <div className="container-fluid form-cont">
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
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    invalid={this.state.error.email ? true : false}
                  ></Input>
                </FormGroup>
                <FormFeedback>{this.state.error.email}</FormFeedback>

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
                      color="btn btn-primary"
                    >
                      Sign me up!
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Register;
