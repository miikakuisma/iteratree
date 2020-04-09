import React from "react";
import Node from "./Node";
import "./styles.css";

export default function Tree({ tree, onRefresh }) {
  const [clipboard, setClipboard] = React.useState(null);

  window.onkeyup = e => {
    if (e.key === "Backspace") {
      deleteSelectedNodes();
    }
  };

  function selectNode(node) {
    if (node.id === 0) {
      return;
    }
    var traverse = require("traverse");
    traverse(tree).forEach(function(x) {
      if (typeof x === 'object') {
        if (x === node) {
          if (x.selected) {
            x.selected = false;
          } else {
            x.selected = true;
          }
        } else {
          x.selected = false;
        }  
      }
    });
    onRefresh();
  }

  function unselectAll(node) {
    var traverse = require("traverse");
    traverse(tree).forEach(function(x) {
      if (typeof x === 'object') {
        x.selected = false;
      }
    });
    onRefresh();
  }

  function deleteSelectedNodes() {
    var traverse = require("traverse");
    traverse(tree).forEach(function(x) {
      if (typeof x === "object" && x.selected) {
        deleteNode(x);
      }
    });
  }

  function deleteNode(node) {
    if (node.id === 0) {
      return;
    }
    var traverse = require("traverse");
    traverse(tree).forEach(function(x) {
      if (x === node) {
        this.remove();
        this.node.options = [];
        onRefresh();
      }
    });
  }

  const renderNode = node => {
    const subNodes = node.options && node.options.map(sub => renderNode(sub));
    return (
      <Node
        key={node.id}
        node={node}
        subNodes={subNodes}
        pasteEnabled={clipboard !== null}
        onSelectNode={() => {
          selectNode(node);
        }}
        onRemoveNode={() => {
          deleteNode(node);
        }}
        onCopyNode={() => {
          let copiedNode = node;
          copiedNode.id = Date.now();
          setClipboard(copiedNode);
        }}
        onPasteNode={() => {
          if (node.options) {
            node.options.push(clipboard);
            onRefresh();
          } else {
            node.options = [clipboard];
            onRefresh();
          }
        }}
        onUpdateNode={(key, value) => {
          node[key] = value;
          onRefresh();
          unselectAll();
        }}
        onAddNode={() => {
          if (node.options) {
            node.options.push({
              id: Date.now(),
              title: "New"
            });
            onRefresh();
          } else {
            node.options = [
              {
                id: Date.now(),
                title: "New"
              }
            ];
            onRefresh();
          }
        }}
      />
    );
  };

  const nodeTree = tree.map(node => renderNode(node));

  return <div className="nodeTree">{nodeTree}</div>;
}
