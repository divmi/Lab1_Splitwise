import React, { Component } from "react";
import axios from "axios";

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
    this.getHowmuch();
    console.log(JSON.stringify(this.state.owsGetDetail));
  }

  componentDidUpdate(prevState) {
    if (prevState.name != this.props.name) {
      this.getHowmuch();
    }
  }
  getHowmuch() {
    axios
      .get("http://localhost:8000/getOwsDetail", {
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
    let show = [];
    let showOwsgetAmount = null;
    if (this.state.owsGetDetail.length > 0) {
      this.state.owsGetDetail.map((value) => {
        if (value.Amount < 0) {
          show.push({
            MemberOws: value.MemberPaid,
            MemberPaid: value.MemberOws,
            Amount: -value.Amount,
          });
        } else {
          show.push(value);
        }
      });
    }
    if (show.length > 0) {
      showOwsgetAmount = show.map((value, idx) => {
        return (
          <div key={idx}>
            <label>
              {value.MemberPaid} gets {value.Amount}
              <label>{value.MemberOws}</label>
            </label>
          </div>
        );
      });
    } else {
      showOwsgetAmount = <div>Nothing found</div>;
    }
    return (
      <div className="container">
        <div>{showOwsgetAmount}</div>
      </div>
    );
  }
}

export default OwsGetDetail;