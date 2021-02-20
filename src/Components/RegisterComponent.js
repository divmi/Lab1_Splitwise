import React, { Component } from 'react';
import {
    Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, Row,
    FormFeedback
} from 'reactstrap';
import axios from 'axios';


class Register extends Component {

    constructor(props) {
        super(props);
        {
            this.state = {
                name: '',
                email: '',
                password: '',
                error: '',
                auth: true
            }
        }
    }

    nameEventHandler = e => {
        this.setState({
            name: e.target.value
        });
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

    submitForm = e => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios
            .post('http://localhost:8000/signupUser', data)
            .then(response => {
                console.log('Status Code : ', response.status);
                if (response.status === 200) {
                    this.setState({
                        error: '',
                        authFlag: true
                    });
                    alert('Successfully Created! Please Conitnue to Login');
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
                <div class="flex-container">
                <div >
                        <img src="./assets/Logo.png" alt="..." width={200} height={200}></img></div>
                    <div>
                        <h3 >Introduce Yourself</h3>
                        <Form onSubmit={this.handleSubmit} className='form-stacked'>
                            <FormGroup>
                                    <Label for="firstname" style={{ fontSize: '24px' }}>Hi there!My name is</Label>
                                    <Input type="text" id="name" name="name"
                                        placeholder="First Name" invalid={false}
                                        onChange={this.nameEventHandler}></Input>
                                    <FormFeedback>First Name should not be blank</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                    <Label htmlFor="email">Here's my <strong>email address</strong></Label>
                                    <Input type="email" id="email" name="email"
                                        placeholder="Email" onChange={this.emailEventHandler}></Input>
                            </FormGroup>

                            <FormGroup>
                                    <Label htmlFor="password">And here's my <strong>password</strong></Label>
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

export default Register; 
