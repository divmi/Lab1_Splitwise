import React, { Component } from "react";
import { Button, Row, Label, Col } from "reactstrap";
import axios from "axios";
import { Control, LocalForm, Errors } from "react-redux-form";
import { connect } from "react-redux";
import { registerUser } from "../../actions/actionCreators";

const mapDispatchToProps = (dispatch) => ({
  registerUser: (name, email, password) =>
    dispatch(registerUser(name, email, password)),
});

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;
const validEmail = (val) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

const mapStateToProps = (state) => {
  return {
    name: state.name,
    email: state.email,
    password: state.password,
  };
};
class Register extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        auth: true,
      };
    }
  }

  handleSubmit(values) {
    const { userInfo } = values;
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
  }

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
            <h3>Introduce Yourself</h3>
            <LocalForm
              onSubmit={(values) => this.handleSubmit(values)}
              className="form-stacked"
            >
              <Row className="form-group">
                <Label htmlfor="firstname" style={{ fontSize: "24px" }}>
                  Hi there!My name is
                </Label>
                <Col>
                  <Control.text
                    model=".name"
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(3),
                      maxLength: maxLength(15),
                    }}
                    id="name"
                    name="name"
                    placeholder="First Name"
                  />
                  <Errors
                    className="text-danger"
                    model=".name"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: "Must be greater than 2 characters",
                      maxLength: "Must be 15 characters or less",
                    }}
                  ></Errors>
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="email">
                  Here&apos;s my <strong>email address</strong>
                </Label>
                <Col>
                  <Control.text
                    model=".email"
                    className="form-control"
                    validators={{
                      required,
                      validEmail,
                    }}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                  <Errors
                    className="text-danger"
                    model=".email"
                    show="touched"
                    messages={{
                      required: "Required",
                      validEmail: "Please enter valid email",
                    }}
                  ></Errors>
                </Col>
              </Row>

              <Row className="form-group">
                <Label htmlFor="password">
                  And here&apos;s my <strong>password</strong>
                </Label>
                <Col>
                  <Control.text
                    model=".password"
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(3),
                      maxLength: maxLength(10),
                    }}
                    id="password"
                    name="password"
                    placeholder="Password"
                  />
                  <Errors
                    className="text-danger"
                    model=".email"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: "Must be greater than 2 characters",
                      maxLength: "Must be 10 characters or less",
                    }}
                  ></Errors>
                </Col>
              </Row>
              <Row className="form-group">
                <Col>
                  <Button type="submit" color="btn btn-primary">
                    Sign me up!
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </div>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
