import React, { useState } from "react";
import { Layout, Menu } from 'antd';
import {
  BranchesOutlined,
} from '@ant-design/icons';
import Tree from "./Tree";
import "./styles.css";

const traverse = require("traverse");

let flow = [{ "title": "Are you happy?", "id": 0, "options": [{ "id": 1582404775678, "title": "Yes", "selected": false, "options": [{ "id": 1586420215794, "title": "Keep doing whatever you're doing", "selected": false }] }, { "id": 1582404776568, "title": "No", "selected": false, "options": [{ "id": 1586420159745, "title": "Do you want to be happy?", "selected": false, "options": [{ "id": 1586420171860, "title": "Yes", "selected": false, "options": [{ "id": 1586420181042, "title": "Change something?", "selected": false }] }, { "id": 1586420173508, "title": "No", "selected": false, "options": [{ "id": 1586420191163, "title": "Keep doing whatever you're doing", "selected": false }] }] }] }], "selected": false }];

const { Header, Content } = Layout;
const { SubMenu } = Menu;

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
          >Clear</Menu.Item>
          <Menu.Item
            onClick={() => {
              alert("You can find JSON from the Console now");
              console.log(JSON.stringify(tree));
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
