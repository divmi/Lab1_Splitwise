import React, { Component } from "react";
//import axios from "axios";
import cookie from "react-cookies";
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
    // axios
    //   .get("http://localhost:8000/getOwsDetail", {
    //     params: {
    //       groupName: this.props.name,
    //     },
    //   })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log("Ows get detail:" + response.data);
    //       this.setState({
    //         owsGetDetail: response.data,
    //       });
    //       console.log(
    //         "got data for transaction" + JSON.stringify(this.state.owsGetDetail)
    //       );
    //     } else {
    //       this.setState({
    //         error: "Please enter correct credentials",
    //         authFlag: false,
    //         owsGetDetail: [],
    //       });
    //     }
    //   })
    //   .catch((e) => {
    //     this.setState({
    //       error: "Please enter correct credentials" + e,
    //       owsGetDetail: [],
    //     });
    //   });
  }

  render() {
    let show = [];
    //let showOwsgetAmount = null;
    let component1 = null;
    let component = null;
    if (this.state.owsGetDetail.length > 0) {
      this.state.owsGetDetail.map((value) => {
        if (value.Amount < 0) {
          show.push({
            MemberOws: value.MemberPaid,
            MemberGets: value.MemberOws,
            Amount: -value.Amount,
          });
        } else {
          show.push(value);
        }
      });
    }
    const getAmount = Object.values(
      show.reduce(
        (r, o) => (
          r[o.MemberGets]
            ? (r[o.MemberGets].Amount += o.Amount)
            : (r[o.MemberGets] = { ...o }),
          r
        ),
        {}
      )
    );

    const owAmount = Object.values(
      show.reduce(
        (r, o) => (
          r[o.MemberOws]
            ? (r[o.MemberOws].Amount += o.Amount)
            : (r[o.MemberOws] = { ...o }),
          r
        ),
        {}
      )
    );
    component = getAmount.map((detail, idx) => {
      if (detail.MemberOws != cookie.load("cookie").Email)
        return (
          <tr key={idx}>
            <td style={{ color: "#5bc5a7" }}>
              <label>
                you gets <strong>{detail.Amount.toFixed(2)}</strong> from{" "}
                {detail.MemberOws}
              </label>
            </td>
          </tr>
        );
    });

    component1 = owAmount.map((detail, idx) => {
      if (detail.MemberGets != cookie.load("cookie").Email)
        return (
          <tr key={idx}>
            <td style={{ color: "orange" }}>
              <label>
                you ows <strong>{detail.Amount.toFixed(2)}</strong> to{" "}
                {detail.MemberGets}{" "}
              </label>
            </td>
          </tr>
        );
    });
    // if (show.length > 0) {
    //   showOwsgetAmount = show.map((value, idx) => {
    //     return (
    //       <div key={idx}>
    //         <label>
    //           {value.MemberPaid} gets {value.Amount}
    //           <label>{value.MemberOws}</label>
    //         </label>
    //       </div>
    //     );
    //   });
    // } else {
    //   showOwsgetAmount = <div>Nothing found</div>;
    // }
    return (
      <div className="container">
        <div>
          <table>
            <tbody>
              {component} {component1}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default OwsGetDetail;
