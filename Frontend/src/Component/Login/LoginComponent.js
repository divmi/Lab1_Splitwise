import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isEmail } from "validator";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback
} from "reactstrap";
//import { userLogin } from "../../actions/loginAction";
import { loginMutation } from "../../mutation/mutations";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";

class Login extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        error: "",
        formerror: "",
        authFlag: false,
        email: "",
        password: "",
        userData: ""
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
    this.setState({ formerror: error });
    return error;
  };

  emailEventHandler = e => {
    this.setState({
      email: e.target.value
    });
  };

  passEventHandler = e => {
    this.setState({
      password: e.target.value
    });
  };
  ///LoginUser'
  submitForm = async e => {
    //prevent page from refresh
    e.preventDefault();
    const formerror = this.validateForm();
    if (Object.keys(formerror).length == 0) {
      let mutationResponse = await this.props.loginMutation({
        variables: {
          email: this.state.email,
          password: this.state.password
        }
      });
      if (mutationResponse.data.login.status == 200) {
        this.SetLocalStorage(JSON.stringify(mutationResponse.data.login));
        this.setState({
          authFlag: true
        });
      } else {
        this.setState({
          error: "Username or password is incorrect",
          authFlag: false
        });
      }
    } else {
      this.setState({ formerror });
    }
  };

  SetLocalStorage(data) {
    if (typeof Storage !== "undefined") {
      localStorage.clear();
      localStorage.setItem("userData", data);
    }
  }

  render() {
    let redirectVar = null;
    //typeof this.props.user.token != "undefined" &&
    if (this.state.authFlag) {
      console.log("Token is verified");
      redirectVar = <Redirect to="/home" />;
    } else redirectVar = <Redirect to="/login" />;
    return (
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
                hidden={this.state.error.length > 0 ? false : true}
                className="alert alert-danger"
                role="alert"
              >
                {this.state.error}
              </div>
              <h3>WELCOME TO SPLITWISE</h3>
              <Form className="form-stacked">
                <FormGroup>
                  <Label htmlFor="email" className="Lable-align">
                    Email address
                  </Label>
                  <Input
                    data-testid="email-input-box"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={this.emailEventHandler}
                    onBlur={this.validateForm}
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
                    onBlur={this.validateForm}
                    invalid={this.state.formerror.password ? true : false}
                  ></Input>
                  <FormFeedback>{this.state.formerror.password}</FormFeedback>
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <Button
                      data-testid="btn-submit"
                      type="submit"
                      className="btn btn-Normal"
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
      </div>
    );
  }
}

export default compose(graphql(loginMutation, { name: "loginMutation" }))(
  Login
);
