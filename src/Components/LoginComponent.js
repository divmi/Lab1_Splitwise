import React, { Component } from 'react';
import {
    Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, Row,
    FormFeedback
} from 'reactstrap';
import axios from 'axios';
import Dashboard from './DashBoard';


class Login extends Component {

    constructor(props) {
        super(props);
        {
            this.state = {
                email: '',
                password: '',
                error: '',
                auth: true
            }
        }
    }

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
    submitForm = e => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email: this.state.email,
            password: this.state.password,
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios
             .post('http://localhost:8000/loginUser', data) 
            .then(response => {
                console.log('Status Code : ', response.status);
                if (response.status === 200) {
                    this.setState({
                        error: '',
                        authFlag: true
                    });
                    <Dashboard></Dashboard>
                } else {
                    this.setState({
                        error:
                            '<p style={{color: red}}>Please enter correct credentials</p>',
                        authFlag: false
                    });
                }
            })
            .catch(e => {
                this.setState({
                    error: 'Please enter correct credentials' + e
                });
            });
    };


    render() {
        return (
            <div className='container-fluid form-cont'>
                <div className="flex-container">
                    <div>
                     <img src="./assets/Logo.png" alt="..." width={200} height={200}></img></div>
                    <div>
                        <h3 >WELCOME TO SPLITWISE</h3>
                        <Form onSubmit={this.handleSubmit} className='form-stacked'>
                            <FormGroup>
                                    <Label htmlFor="email" className="Lable-align">Email address</Label>
                                    <Input type="email" id="email" name="email"
                                        placeholder="Email" onChange={this.emailEventHandler}></Input>
                            </FormGroup>

                            <FormGroup>
                                    <Label htmlFor="password">Password</Label>
                                    <Input type="password" id="password" name="password"
                                        placeholder="Password" onChange={this.passEventHandler}></Input>
                            </FormGroup>
                            <FormGroup row>
                                <Col>
                                    <Button type="submit" onClick={this.submitForm} color="btn btn-primary">
                                        Sign me up!
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
