import React from "react";
import ReactDOM from "react-dom";
import { ShogiBoard } from "./ShogiBoard";

ReactDOM.render(
  <div
    style={{
      width: 650,
      margin: "auto",
    }}
  >
    <ShogiBoard />
  </div>,
  document.getElementById("root")
);
