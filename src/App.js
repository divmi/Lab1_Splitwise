import logo from './logo.svg';
import './App.css';
import React from 'react';
import RegisterComponent from'./Components/RegisterComponent';
import Header from './Components/Header';
import {Row,Col, Container} from'reactstrap';
import Login from './Components/LoginComponent';

function App()
{
  return(
    <div className="App">
    <Container fluid className="custom-header">
      <Row>
        <Col><Header/></Col>
        </Row>
        <Row>
        <Col><Login /></Col>
        </Row>
    </Container>
    </div>
  );
}

export default App;
