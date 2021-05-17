import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback
} from "reactstrap";
import { isEmail } from "validator";
import { signUpMutation } from "../../mutation/mutations";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";

class Register extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        userInfo: {
          name: "",
          email: "",
          password: ""
        },
        error: {},
        loginError: "",
        auth: true
      };
    }
  }

  handleChange = e => {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        [e.target.name]: e.target.value
      }
    });
  };

  submitForm = async e => {
    //prevent page from refresh
    e.preventDefault();

    const { name, email, password } = this.state.userInfo;
    const error = this.validateForm();
    if (Object.keys(error).length == 0) {
      let mutationResponse = await this.props.signUpMutation({
        variables: {
          name,
          email,
          password
        }
      });
      if (mutationResponse.data.signUp.status == 200) {
        this.SetLocalStorage(JSON.stringify(mutationResponse.data.signUp));
        this.setState({
          authFlag: true
        });
      } else {
        this.setState({
          error: "User is already registered",
          authFlag: false
        });
      }
    } else {
      this.setState({ error });
    }
  };

  SetLocalStorage(userInfo) {
    if (typeof Storage !== "undefined") {
      console.log("Set local storage here");
      localStorage.clear();
      try {
        localStorage.setItem("userData", userInfo);
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
    this.setState({
      error
    });
    return error;
  };

  render() {
    let redirectVar = null;
    if (this.state.authFlag) {
      console.log("Control goes to home page from here");
      redirectVar = <Redirect to="/home" />;
    } else redirectVar = <Redirect to="/register" />;
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
                      onBlur={this.validateForm}
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
                      onBlur={this.validateForm}
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
                      onBlur={this.validateForm}
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

export default compose(graphql(signUpMutation, { name: "signUpMutation" }))(
  Register
);
