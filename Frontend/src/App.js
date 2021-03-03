import "./App.css";
import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "./Component/Main";
import { Provider } from "react-redux";
import { ConfigureStore } from "./store/store";

const store = ConfigureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            {/* App Component Has a Child Component called Main*/}
            <Main />
          </div>
        </Router>
      </Provider>
    );
  }
}
// function App() {
//   return (
//     //Use Browser Router to route to different pages
//     <Router>
//       <div>
//         {/* App Component Has a Child Component called Main*/}
//         <Main />
//       </div>
//     </Router>
//   );
// }

export default App;
