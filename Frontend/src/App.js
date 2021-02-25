import "./App.css";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "./Component/Main";

function App() {
  return (
    //Use Browser Router to route to different pages
    <Router>
      <div>
        {/* App Component Has a Child Component called Main*/}
        <Main />
      </div>
    </Router>
  );
}

export default App;
