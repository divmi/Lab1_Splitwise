import React, { Component } from "react";

export class Posts extends Component {
  render() {
    const { posts, loading } = this.props;
    let showTransaction = null;
    if (loading) {
      return <h2>Loading...</h2>;
    }

    if (posts != null && posts.length > 0) {
      showTransaction = posts.map((name, idx) => {
        if (name.TransactionDetail == "SettleUp") {
          return (
            <tr key={idx} style={{ verticalAlign: "center" }}>
              <td style={{ color: "GrayText" }}>
                {new Date(name.Time).toLocaleString("en-us", {
                  weekday: "long",
                })}
              </td>
              <td>
                <i className="greenCode fas fa-receipt fa-2x"></i>
                <strong> {name.Name}</strong> is
                <strong> settled Up</strong> with
                <strong> {name.SettleUpWith}</strong>
              </td>
              <td>
                <label>{this.props.Currency} </label>
                <label> {name.Amount}</label>
              </td>
            </tr>
          );
        } else {
          return (
            <tr key={idx} style={{ verticalAlign: "center" }}>
              <td style={{ color: "GrayText" }}>
                {new Date(name.Time).toLocaleString("en-us", {
                  weekday: "long",
                })}
              </td>
              <td>
                <i className="greenCode fas fa-receipt fa-2x"></i>
                <strong> {name.Name}</strong> added
                <strong> {name.TransactionDetail} </strong>
                in <strong>{name.GroupName}</strong>
              </td>
              <td>
                <label>{this.props.Currency} </label>
                <label> {name.Amount}</label>
              </td>
            </tr>
          );
        }
      });
      //   if (this.props.groupName != null && this.props.groupName.length > 0) {
      //     const groups = [...new Set(this.props.groupName)];
      //     showGroupName = groups.map((name, idx) => {
      //       return (
      //         <option key={idx} value={name}>
      //           {name}
      //         </option>
      //       );
      //     });
      //   }
    } else {
      showTransaction = (
        <tr>
          <td>
            <img src="./assets/transaction.png" height={300} width={300}></img>
            <h3>
              You have not added any expenses yet
              <i className="fas fa-frown"></i>
            </h3>
          </td>
        </tr>
      );
    }

    return (
      <div>
        <table className="table">
          <tbody>{showTransaction}</tbody>
        </table>
        {/* {posts.map((post, idx) => (
          <div key={idx} className="alert alert-primary">
            <h4 className="alert-heading">{post.title}</h4>
            <p>{post.body}</p>
          </div>
        ))} */}
      </div>
    );
  }
}

export default Posts;
