import React, { Component } from "react";
import axios from "axios";
//import cookie from "react-cookies";
class OwsGetDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owsGetDetail: [],
      componentMounted: false,
    };
  }

  componentDidMount() {
    console.log("compoment mounted");
    this.getGroupSummary();
    console.log(JSON.stringify(this.state.owsGetDetail));
  }

  componentDidUpdate(prevState) {
    if (prevState.name != this.props.name) {
      this.getGroupSummary();
    }
  }
  getGroupSummary() {
    axios
      .get("http://localhost:8000/getGroupSummary", {
        params: {
          groupName: this.props.name,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Ows get detail:" + response.data);
          this.setState({
            owsGetDetail: response.data,
          });
          console.log(
            "got data for transaction" + JSON.stringify(this.state.owsGetDetail)
          );
        } else {
          this.setState({
            error: "Please enter correct credentials",
            authFlag: false,
            owsGetDetail: [],
          });
        }
      })
      .catch((e) => {
        this.setState({
          error: "Please enter correct credentials" + e,
          owsGetDetail: [],
        });
      });
  }

  render() {
    return (
      <div className="container">
        <div>
          <table>
            <tbody>{/* {component} {component1} */}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default OwsGetDetail;
