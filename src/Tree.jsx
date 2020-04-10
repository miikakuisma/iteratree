import React from "react";
import { message } from 'antd';
import 'antd/dist/antd.css';
import "./styles.css";

import Node from "./Node";
import { arrayMove } from "./helpers";

const traverse = require("traverse");

export default function Tree({ tree, onRefresh, onUpdateNodeChildren }) {
  const [clipboard, setClipboard] = React.useState(null);

  window.onkeydown = e => {
    switch (e.key) {
      // DELETE
      case "Backspace":
        deleteSelectedNodes();
        break;
      // COPY
      case "c":
        if (e.metaKey || e.ctrlKey) {
          traverse(tree).forEach(function(x) {
            if (typeof x === "object" && x.selected) {
              copyNode(x);
            }
          });
        }
        break;
      // PASTE
      case "v":
        if (e.metaKey || e.ctrlKey) {
          traverse(tree).forEach(function(x) {
            if (typeof x === "object" && x.selected) {
              pasteNode(x);
            }
          });
        }
        break;
      // MOVE
      case "ArrowLeft":
        if (e.metaKey || e.ctrlKey) {
          traverse(tree).forEach(function(x) {
            if (typeof x === "object" && x.selected) {
              moveNode({ direction: 'left', node: x, parent: this.parent });
            }
          });
        } else {
          traverse(tree).forEach(function(x) {
            if (typeof x === "object" && x.selected) {
              selectChildNode({ direction: 'left', node: x, parent: this.parent });
            }
          });
        }
        break;
      case "ArrowRight":
        if (e.metaKey || e.ctrlKey) {
          traverse(tree).forEach(function(x) {
            if (typeof x === "object" && x.selected) {
              moveNode({ direction: 'right', node: x, parent: this.parent });
            }
          });
        } else {
          traverse(tree).forEach(function(x) {
            if (typeof x === "object" && x.selected) {
              selectChildNode({ direction: 'right', node: x, parent: this.parent });
            }
          });
        }
        break;
      default:
        break;
    }
  };

  function selectNode(node) {
    if (node.id === 0) {
      return;
    }
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
    traverse(tree).forEach(function(x) {
      if (typeof x === 'object') {
        x.selected = false;
      }
    });
    onRefresh();
  }

  function copyNode(node) {
    setClipboard(node);
    message.info(`Node copied to clipboard`);
  }

  function pasteNode(node) {
    // Each pasted node should have new ID
    let pastedNode = clipboard;
    pastedNode.id = Date.now();
    pastedNode.selected = false;
  
    if (node.options) {
      node.options.push(clipboard);
      onRefresh();
    } else {
      node.options = [clipboard];
      onRefresh();
    }
  }

  function selectChildNode({ direction, node, parent }) {
    // Selects child node left-right from current
    let newParent = JSON.parse(JSON.stringify(parent.parent.node));
    let oldIndex;
    newParent.options.forEach((option, index) => {
      if (option.id === node.id) {
        oldIndex = index;
      }
    });
    if (direction === 'right' && oldIndex < (newParent.options.length - 1)) {
      const newIndex = oldIndex + 1;
      newParent.options[oldIndex].selected = false;
      newParent.options[newIndex].selected = true;
    } 
    if (direction === 'left' && oldIndex > 0) {
      const newIndex = oldIndex - 1;
      newParent.options[oldIndex].selected = false;
      newParent.options[newIndex].selected = true;
    }
    onUpdateNodeChildren(parent.parent.node, newParent);
  }

  function moveNode({ direction, node, parent}) {
    // Moves child node left-right inside the parent
    let newParent = JSON.parse(JSON.stringify(parent.parent.node));
    let oldIndex;
    newParent.options.forEach((option, index) => {
      if (option.id === node.id) {
        oldIndex = index;
      }
    });
    if (direction === 'right' && oldIndex < (newParent.options.length - 1)) {
      const newIndex = oldIndex + 1;
      arrayMove(newParent.options, oldIndex, newIndex);
    } 
    if (direction === 'left' && oldIndex > 0) {
      const newIndex = oldIndex - 1;
      arrayMove(newParent.options, oldIndex, newIndex);
    }
    onUpdateNodeChildren(parent.parent.node, newParent);
  }

  function deleteSelectedNodes() {
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
          copyNode(node);
        }}
        onPasteNode={() => {
          pasteNode(node);
        }}
        onUpdateNode={(key, value) => {
          node[key] = value;
          onRefresh();
          // unselectAll();
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
