import React, { useState } from "react";
import Tree from "./Tree";
import "./styles.css";

let flow = [{ "title": "Are you happy?", "id": 0, "options": [{ "id": 1582404775678, "title": "Yes", "selected": false, "options": [{ "id": 1586420215794, "title": "Keep doing whatever you're doing", "selected": false }] }, { "id": 1582404776568, "title": "No", "selected": false, "options": [{ "id": 1586420159745, "title": "Do you want to be happy?", "selected": false, "options": [{ "id": 1586420171860, "title": "Yes", "selected": false, "options": [{ "id": 1586420181042, "title": "Change something?", "selected": false }] }, { "id": 1586420173508, "title": "No", "selected": false, "options": [{ "id": 1586420191163, "title": "Keep doing whatever you're doing", "selected": false }] }] }] }], "selected": false }];

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

  function handleUpdateNodeChildren(oldNode, newNode) {
    var traverse = require("traverse");
    traverse(tree).forEach(function(x) {
      if (typeof x === "object" && JSON.stringify(x) === JSON.stringify(oldNode)) {
        x.options = newNode.options;
      }
    });
    refresh();
  }

  function refresh() {
    let newTree = JSON.stringify(tree);
    handleUpdateTree(JSON.parse(newTree));
  }

  function reset() {
    window.localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="App">
      <Tree tree={tree} onRefresh={refresh} onUpdateNodeChildren={handleUpdateNodeChildren} />
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
          reset();
        }}
      >Sure?</button>}
      <button
        className="export"
        onClick={() => {
          alert("You can find JSON from the Console now");
          console.log(JSON.stringify(tree));
        }}
      >Export</button>
    </div>
  );
}
