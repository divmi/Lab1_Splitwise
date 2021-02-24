import "./App.css";
import React from "react";
import Register from "./Components/RegisterComponent";
import Header from "./Components/Header";
import Login from "./Components/LoginComponent";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Components/DashBoard";
import CreateGroup from "./Components/Group/CreateGroupComponent";
import UpdateProfile from "./Components/UpdateProfile";

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
          <Route path="/createGroup" component={CreateGroup} />
          <Route path="/updateProfile" component={UpdateProfile} />
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
