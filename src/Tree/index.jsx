import React, { useContext, useState, useEffect, Fragment } from "react";
import { TreeContext, UIContext } from '../Store';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Sidebar from '../Sidebar';
import { arrayMove } from "../lib/helpers";
import Node from "./Node";
import Toolbar from "./Toolbar";
import 'antd/dist/antd.css';
import "../styles.css";

// eslint-disable-next-line no-undef
const traverse = require("traverse");

function Tree() {
  const store = useContext(TreeContext);
  const UI = useContext(UIContext);
  const { tree, onRefresh, onUndo, onRedo, onAddHistory } = store;
  const { sidebarOpen, userModal, modalOpen, editingContent, activeUiSection } = UI.state;

  const [clipboard, setClipboard] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setEditing] = useState(null);
  const [previewDeleteNode, setPreviewDeleteNode] = useState(null);
  const [isAskingToConfirm, setAskingConfirm] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  useEffect(() => {
    getSelectedNode((node) => {
      setSelectedNode(node)
    })
  }, [tree]);

  function getSelectedNode(callback) {
    traverse(tree).forEach(function(node) {
      if (typeof node === "object" && node.selected) {
        callback(node, this.parent);
      }
    });
  }

  function selectNode(node) {
    traverse(tree).forEach(function(x) {
      if (typeof x === 'object') {
        if (x === node) {
          if (x.selected) {
            delete x.selected
            setSelectedNode(null);
          } else {
            x.selected = true;
          }
        } else {
          delete x.selected
        }  
      }
    });
    onRefresh();
  }

  function unselectAll() {
    traverse(tree).forEach(function(x) {
      if (typeof x === 'object') {
        delete x.selected
      }
    });
    setSelectedNode(null);
    onRefresh();
  }

  document.onkeydown = e => {
    if (isAskingToConfirm || userModal || editingContent ) {
      return
    }
    if (activeUiSection === 'tree') {
      switch (e.key) {
        // COPY
        case "c":
          if ((e.metaKey || e.ctrlKey) && selectNode) {
            getSelectedNode((node) => copyNode(node));
          }
          break;
        // PASTE
        case "v":
          if (isEditing === null && clipboard) {
            if (e.metaKey || e.ctrlKey) {
              getSelectedNode((node) => pasteNode(node));
            }
          }
          break;
        // MOVE and SELECT
        case "ArrowLeft":
          if (isEditing === null) {
            if (e.metaKey || e.ctrlKey) {
              e.preventDefault();
              getSelectedNode((node, parent) => moveNode({ direction: 'left', node, parent }));
            } else {
              getSelectedNode((node, parent) => selectChildNode({ direction: 'left', node, parent }));
            }
          }
          break;
        case "ArrowRight":
          if (isEditing === null) {
            if (e.metaKey || e.ctrlKey) {
              e.preventDefault();
              getSelectedNode((node, parent) => moveNode({ direction: 'right', node, parent }));
            } else {
              getSelectedNode((node, parent) => selectChildNode({ direction: 'right', node, parent }));
            }
          }
          break;
        // ADD NODES
        case "ArrowDown":
          // add new child
          if (isEditing === null) {
            if (selectedNode && selectedNode.options) {
              const middle = Math.floor(selectedNode.options.length / 2);
              selectNode(selectedNode.options[middle]);
            } else {
              getSelectedNode((node) => addNode(node, true));
            }
          }
          break;
        case "Tab":
          if (isEditing === null) {
            // add new under same parent
            e.preventDefault();
            getSelectedNode((node, parent) => addNode(parent.parent.node, true));
          }
          break;
          // SELECT PARENT
        case "ArrowUp":
          getSelectedNode((node, parent) => selectParentNode(parent));
          break;
        case "Backspace":
          if (isEditing === null && !isAskingToConfirm) {
            getSelectedNode((node) => deleteNode(node));
          }
          break;
        case "Enter":
          break;
        default:
          break;
      }
    }
  };

  function addNode(node, select) {
    onAddHistory();
    const newNode = {
      id: Date.now(),
      title: "New",
      content: [{type: "title", value: "New"}],
      selected: select || false
    }
    if (select) {
      unselectAll();
    }
    if (node.options && node.options.length > 0) {
      node.options.push(newNode);
      onRefresh();
    } else {
      // unselectAll();
      node.options = [newNode];
      onRefresh();
    }
  }

  function updateNodeColor(node, item) {
    onAddHistory();
    traverse(tree).forEach(function(x) {
      if (typeof x === 'object' && x === node) {
        if (!item.color) {
          delete x.color;
          delete x.background;
        } else {
          x.color = item.color;
          x.background = item.background;
        }
        onRefresh();
      }
    });
  }

  function copyNode(node) {
    setClipboard(node);
    message.info(`Node copied to clipboard`);
  }

  function pasteNode(node) {
    onAddHistory();
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

  function updateNodeChildren(oldNode, newNode) {
    traverse(tree).forEach(function(x) {
      if (typeof x === "object" && JSON.stringify(x) === JSON.stringify(oldNode)) {
        x.options = newNode.options;
      }
    });
    onRefresh();
  }

  function selectParentNode(node) {
    selectNode(node.parent.node);
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
    updateNodeChildren(parent.parent.node, newParent);
  }

  function moveNode({ direction, node, parent}) {
    onAddHistory();
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
    updateNodeChildren(parent.parent.node, newParent);
  }

  // function deleteSelectedNodes() {
  //   traverse(tree).forEach(function(x) {
  //     if (typeof x === "object" && x.selected) {
  //       deleteNode(x);
  //     }
  //   });
  // }

  function deleteNode(node) {
    const { confirm } = Modal;
    if (node.id === 0) {
      message.error(`Cannot delete root node`);
      return
    }
    onAddHistory();
    if (isDeleting) {
      traverse(tree).forEach(function(x) {
        if (x === node) {
          this.remove();
          this.node.options = [];
        }
      });
      onRefresh();
    } else {
      if (node.id === 0) {
        return;
      }
      setPreviewDeleteNode(node.id);
      if (node.options) {
        // If deleting more than one nodes, ask for confirmation
        setAskingConfirm(true);
        confirm({
          title: 'Are you sure you want to delete these node(s)?',
          icon: <ExclamationCircleOutlined />,
          content: 'All children will be removed also.',
          maskClosable: true,
          onOk() {
            setAskingConfirm(false);
            setDeleting(true);
            traverse(tree).forEach(function(x) {
              if (x === node) {
                this.remove();
                this.node.options = [];
              }
            });
            onRefresh();
            setDeleting(false);
            setPreviewDeleteNode(null);
            setSelectedNode(null);
          },
          onCancel() {
            setAskingConfirm(false);
            setPreviewDeleteNode(null);
          },
        });
      } else {
        // If deleting just one node, don't ask for confirm
        setPreviewDeleteNode(null);
        setDeleting(true);
        traverse(tree).forEach(function(x) {
          if (x === node) {
            this.remove();
            this.node.options = [];
          }
        });
        onRefresh();
        setDeleting(false);
        setSelectedNode(null);
      }
    }
  }

  const renderNode = node => {
    const subNodes = node.options && node.options.map(sub => renderNode(sub));
    return (
      <Node
        key={node.id}
        node={node}
        subNodes={subNodes}
        pasteEnabled={clipboard !== null}
        keyboardListenerDisabled={isAskingToConfirm || modalOpen || editingContent}
        isEditing={isEditing === node.id}
        isPreviewingRemove={previewDeleteNode === node.id}
        isSelected={node.selected}
        isCollapsed={node.collapsed}
        onSelectNode={() => {
          selectNode(node);
        }}
        onCopyNode={() => {
          if (!isAskingToConfirm && !isEditing && !editingContent) {
            copyNode(node);
          }
        }}
        onPasteNode={() => {
          if (!isAskingToConfirm && !isEditing && !editingContent) {
            pasteNode(node);
          }
        }}
        onUpdateNode={(key, value) => {
          onAddHistory();
          node[key] = value;
          onRefresh();
          setEditing(null);
        }}
        onStartEditing={() => {
          if (!isAskingToConfirm) {
            setEditing(node.id);
          }
        }}
        onCancelEditing={() => {
          setEditing(null);
        }}
        onAddNode={() => {
          if (!isAskingToConfirm) {
            addNode(node);
          }
        }}
      />
    );
  };

  const handleInspectorAction = (action, params) => {
    switch (action) {
      case "edit":
        setEditing(selectedNode.id);
        break;
      case "copy":
        copyNode(selectedNode);
        break;
      case "paste":
        pasteNode(selectedNode);
        break;
      case "delete":
        deleteNode(selectedNode);
        unselectAll();
        break;
      case "changeColor":
        updateNodeColor(selectedNode, params);
        break;
      default:
        break;
    }
  }

  const nodeTree = tree.map(node => renderNode(node));

  return (
    <Fragment>
      <div
        className="nodeTree"
        onClick={(e) => {
          UI.setState({
            activeUiSection: 'tree'
          });
          if (e.target.classList.contains('nodeContainer')) { 
            unselectAll();
          }
        }}
        style={{
          width: sidebarOpen ? 'calc(100vw - 395px)' : '100%'
        }}
      >
        <Toolbar
          selectedNode={selectedNode}
          clipboard={clipboard}
          sidebarOpen={sidebarOpen}
          onAction={handleInspectorAction}
          onUndo={onUndo}
          onRedo={onRedo}
        />
        {nodeTree}
      </div>
      <Sidebar open={sidebarOpen} selectedNode={selectedNode || tree[0]} onSelectNode={(next) => selectNode(next)} />
    </Fragment>
  );
}

export default Tree;
