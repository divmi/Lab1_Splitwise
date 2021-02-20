import React, {Component} from 'react';
import { Label, Container,Col,Button,Row } from 'reactstrap';
import axios from'axios';
import Register from './RegisterComponent';

class Header extends Component{
    constructor(props){
        super(props);
    }

    handleRegister=e=>{
        <Register></Register>
    }

    handleSignUp=e=>{

    }

    render()
    {
        return(
            <div className="header">
                    <div className="container-fluid">
                    <img src="./assets/Logo.png" alt="..." width={30} height={30}></img>
                    <Label className="label-Splitwise">Splitwise</Label>
                    <button className="btn btn-login align-right" type="submit" onClick={this.handleRegister} >Login</button>
                    <button className="btn btn-signup" type="submit" onClick={this.handleSignUp}>Sign Up!</button>
                </div>
             </div>
        );
    }

}

export default Header;