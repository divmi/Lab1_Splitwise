import React, { Component } from "react";
import { Route } from "react-router-dom";
import Login from "./Login/LoginComponent";
import Register from "./Login/RegisterComponent";
import Dashboard from "./User/DashBoard";
import CreateGroup from "./Group/CreateGroupComponent";
import Header from "./Header/Header";
import Home from "./Header/HomeComponent";
import GroupInfo from "./Group/GroupInfoComponent";
import MyGroup from "./Group/MyGroup";
import UpdateProfile from "./User/UpdateProfile";
import LandingComponent from "./LandingPage/LandingComponent";
import EditGroup from "./Group/EditGroupComponent";

//Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/*Render Different Component based on Route*/}
        <Route path="/" component={Header} />
        <Route path="/home" component={Home} />
        <Route path="/groupInfo" component={GroupInfo}></Route>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/createGroup" component={CreateGroup} />
        <Route path="/editGroup/:value" component={EditGroup} />
        <Route path="/updateProfile" component={UpdateProfile} />
        <Route path="/myGroup" component={MyGroup} />
        <Route path="/landing" component={LandingComponent} />
      </div>
    );
  }
}
//Export The Main Component
export default Main;
