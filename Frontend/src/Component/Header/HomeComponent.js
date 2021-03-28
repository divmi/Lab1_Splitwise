import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import { Label } from "reactstrap";
import GroupInfo from "../Group/GroupInfoComponent";
import TransactionDetail from "../Transaction/TransactionDetail";
import Dashboard from "../User/DashBoard";
import OwsGetDetail from "../Group/OwsGetsInfo";
import { getUserDetails } from "../../actions/home";
import { connect } from "react-redux";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
      summary: null,
    };
  }

  componentDidMount() {
    var data;
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        data = JSON.parse(localStorage.getItem("userData"));
        this.props.getUserDetails(data._id);
      }
    }
    if (this.state.component == null) {
      if (typeof data != "undefined") {
        this.setState({
          component: <Dashboard email={data.Email} />,
        });
      }
    }
  }

  OpenDashBoard = () => {
    this.setState({
      component: <Dashboard email={cookie.load("cookie").Email} />,
    });
  };

  OpenGroupInfo(param) {
    this.setState({
      component: <GroupInfo name={param} />,
      summary: <OwsGetDetail name={param} />,
    });
  }

  OpenRecentActivity = () => {
    this.setState({
      component: <TransactionDetail email={cookie.load("cookie").Email} />,
    });
  };

  render() {
    let redirectVar = null;
    let groupName = null;
    if (cookie.load("cookie")) redirectVar = <Redirect to="/home" />;
    else redirectVar = <Redirect to="/login" />;
    if (this.props.groupInfo != null && this.props.groupInfo.length > 0) {
      groupName = this.props.groupInfo.map((name, idx) => {
        return (
          <tr
            key={idx}
            style={{ verticalAlign: "center" }}
            onClick={() => this.OpenGroupInfo(name.GroupName)}
          >
            <td>
              <i className="fa fa-users"></i>
              <a key={idx}>{name.GroupName}</a>
            </td>
          </tr>
        );
      });
    }
    return (
      <div className="container-flex">
        {redirectVar}
        <div className="row row-flex">
          <div className="setHeight col col-sm-2"></div>
          <div className="setHeight col-md-2point5 p-2 shadow-sm bg-light rounded no-float">
            <div
              id="dashboard-div no-float"
              style={{ padding: 0, margin: 0, textAlign: "left", fontSize: 13 }}
            >
              <button
                className="btn shadow-none"
                onClick={this.OpenDashBoard}
                style={{ textDecoration: "none", fontSize: 13 }}
              >
                <i className="fas fa-bars"></i> DashBoard
              </button>
              <hr />
              <button
                className="btn shadow-none"
                onClick={this.OpenRecentActivity}
                style={{ textDecoration: "none", fontSize: 13 }}
              >
                <i className="fas fa-flag"></i> Recent activity
              </button>
              <hr />
              <Label>All Groups</Label>
              <table id="groupTable" className="table table-hover">
                <tbody>{groupName}</tbody>
              </table>
            </div>
          </div>
          <div className="setHeight col col-sm-6 shadow-sm p-3 mb-5 bg-light rounded no-float">
            {this.state.component}
          </div>
          <div className="setHeight col col-sm-2 rounded no-float"></div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    groupInfo: state.homeReducer.groupInfo,
  };
};

export default connect(mapStateToProps, { getUserDetails })(Home);
