import React, { useState } from "react";
import { Layout, Menu, Modal, notification } from 'antd';
import { BranchesOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Tree from "./Tree";
import "./styles.css";

const traverse = require("traverse");

let flow = [{ "title": "Are you happy?", "id": 0, "options": [{ "id": 1582404775678, "title": "Yes", "selected": false, "options": [{ "id": 1586420215794, "title": "Keep doing whatever you're doing", "selected": false }] }, { "id": 1582404776568, "title": "No", "selected": false, "options": [{ "id": 1586420159745, "title": "Do you want to be happy?", "selected": false, "options": [{ "id": 1586420171860, "title": "Yes", "selected": false, "options": [{ "id": 1586420181042, "title": "Change something?", "selected": false }] }, { "id": 1586420173508, "title": "No", "selected": false, "options": [{ "id": 1586420191163, "title": "Keep doing whatever you're doing", "selected": false }] }] }] }], "selected": false }];

const { Content } = Layout;
const { SubMenu } = Menu;

export default function App() {
  let storedTree;
  try {
    storedTree = JSON.parse(window.localStorage.getItem("tree"));
  } catch (e) {
    storedTree = null;
  }

  const [tree, updateTree] = useState(storedTree || flow);

  function handleUpdateTree(newTree) {
    updateTree(newTree);
    window.localStorage.setItem("tree", JSON.stringify(newTree));
  }

  function handleUpdateNodeChildren(oldNode, newNode) {
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
    const { confirm } = Modal;
    confirm({
      title: 'Do you want to start over?',
      icon: <ExclamationCircleOutlined />,
      content: 'Everything will be lost forever',
      onOk() {
        window.localStorage.clear();
        window.location.reload();
      },
      onCancel() {},
    });
  }

  return (
    <Layout>
      <Menu mode="horizontal">
        <SubMenu
          title={
            <span className="submenu-title-wrapper">
              <BranchesOutlined />
              Iteratree
            </span>
          }
        >
          <Menu.Item
            onClick={() => {
              reset();
            }}
          >New</Menu.Item>
          <Menu.Item
            onClick={() => {
              console.log(JSON.stringify(tree));
              notification.success({ message: "Exported to JSON", description: "You can find JSON from the Console now" });
            }}
          >Export JSON</Menu.Item>
        </SubMenu>
      </Menu>
      <Content className="App">
        <div className="App">
          <Tree tree={tree} onRefresh={refresh} onUpdateNodeChildren={handleUpdateNodeChildren} />
        </div>
      </Content>
    </Layout>
  );
}
