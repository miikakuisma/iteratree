import React, { useState } from "react";
import { TreeContext, UIContext, initialAppState, initialUIState } from './Store';
import { Layout } from 'antd';
import TopMenu from "./TopMenu";
import Tree from "./Tree";
import Questionnaire from "./Questionnaire";
import Shortcuts from "./Shortcuts";
import "./styles.css";

const { Content } = Layout;

export default function App() {
  document.addEventListener('contextmenu', e => e.preventDefault())

  let storedTree;
  try {
    storedTree = JSON.parse(window.localStorage.getItem("tree"));
  } catch (e) {
    storedTree = null;
  }

  const [tree, updateTree] = useState(storedTree || initialAppState);
  const [UI, updateUI] = useState(initialUIState);

  function refresh(loadNewTree) {
    let newTree = JSON.stringify(loadNewTree) || JSON.stringify(tree);
    updateTree(JSON.parse(newTree));
    window.localStorage.setItem("tree", JSON.stringify(tree));
  }

  return (
    <TreeContext.Provider value={{ tree, onRefresh: refresh }}>
      <UIContext.Provider value={{ state: UI, setState: updateUI }}>
        <Layout>
          <TopMenu />
          <Content className="App">
            <Tree />
          </Content>
        </Layout>
        {UI.questionnaire && <Questionnaire flow={tree} />}
        {UI.shortcuts && <Shortcuts />}
      </UIContext.Provider>
    </TreeContext.Provider>
  );
}
