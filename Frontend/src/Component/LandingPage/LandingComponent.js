import React, { Component } from "react";

class LandingComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col col-sm-1"></div>
          <div className="col col-sm-3"></div>
        </div>
        <div id="footer" className="row">
          <h1
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              textAlign: "center",
              marginLeft: 350,
            }}
          >
            Less stress when sharing expenses with anyone
          </h1>
          <p
            style={{
              alignSelf: "center",
              textAlign: "center",
              marginLeft: 350,
            }}
          >
            Keep track of your shared expenses and balances with housemates,
            trips, groups, friends, and family
          </p>
          <img src="./assets/blog-cover-image.png" width={1420}></img>
        </div>
      </div>
    );
  }
}

export default LandingComponent;
