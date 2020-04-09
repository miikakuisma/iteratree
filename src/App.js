import React, { useState } from "react";
import Tree from "./Tree";
import "./styles.css";

let flow = [
  {
    title: "Week",
    id: 0,
    options: [
      {
        id: 1582404772377,
        title: "Monday",
        options: [
          { id: 1582404817558, title: "New" },
          { id: 1582405067308, title: "New" },
          { id: 1582405068038, title: "New" }
        ]
      },
      { id: 1582404775678, title: "Tuesday" },
      { id: 1582404776568, title: "Wednesday" },
      { id: 1582404777119, title: "Thurday" },
      { id: 1582404778083, title: "Friday" }
    ]
  }
];

export default function App() {
  let storedTree;
  try {
    storedTree = JSON.parse(window.localStorage.getItem("tree"));
  } catch (e) {
    storedTree = null;
  }

  const [tree, updateTree] = useState(storedTree || flow);
  const [confirm, askConfirm] = useState(false);

  function handleUpdateTree(newTree) {
    updateTree(newTree);
    window.localStorage.setItem("tree", JSON.stringify(newTree));
  }

  function refresh() {
    let newTree = JSON.stringify(tree);
    handleUpdateTree(JSON.parse(newTree));
  }

  return (
    <div className="App">
      <Tree tree={tree} onRefresh={refresh} />
      <button
        className="reset"
        onClick={() => {
          askConfirm(!confirm);
          window.localStorage.clear();
        }}
      >Clear</button>
      {confirm && <button
        className="confirm"
        onClick={() => {
          askConfirm(false);
          window.localStorage.clear();
        }}
      >Sure?</button>}
      <button
        className="export"
        onClick={() => {
          alert("You can find JSON from the Console now")
          console.log(JSON.stringify(tree));
        }}
      >Export</button>
    </div>
  );
}
