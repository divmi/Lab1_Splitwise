import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Navbar from "reactstrap";
import Register from "./Components/RegisterComponent";
import Header from "./Components/Header";
import { Row, Col, Container } from "reactstrap";
import Login from "./Components/LoginComponent";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Components/DashBoard";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Header></Header>
        </div>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </div>
    // //{/* <Container fluid className="custom-header">
    //     <Row>
    //       <Col></Col>
    //     </Row>
    //     <Row>
    //       <Col>
    //         <Switch>
    //           <Route path="/register" component={Register} />
    //           <Route path="/login" component={Login} />
    //           <Route path="/dashboard" component={Dashboard} />
    //         </Switch>
    //       </Col>
    //     </Row>
    //   </Router>
    // </Container> */}
  );
}

export default App;
