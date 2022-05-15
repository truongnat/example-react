import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "animate.css";
import App from "./App";

const MOUNTED = document.getElementById("root");

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
  MOUNTED
);
