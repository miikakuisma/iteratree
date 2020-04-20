import React, { useState } from "react";
import { TreeContext, initialAppState } from './Store';
import { Layout } from 'antd';
import TopMenu from "./TopMenu";
import Tree from "./Tree";
import "./styles.css";

const { Content } = Layout;

export default function App() {
  let storedTree;
  try {
    storedTree = JSON.parse(window.localStorage.getItem("tree"));
  } catch (e) {
    storedTree = null;
  }

  const [tree, updateTree] = useState(storedTree || initialAppState);

  function refresh() {
    let newTree = JSON.stringify(tree);
    updateTree(JSON.parse(newTree));
    window.localStorage.setItem("tree", JSON.stringify(tree));
  }

  return (
    <TreeContext.Provider value={{ tree, onRefresh: refresh }}>
      <Layout>
        <TopMenu />
        <Content className="App">
          <Tree />
        </Content>
      </Layout>
    </TreeContext.Provider>
  );
}
