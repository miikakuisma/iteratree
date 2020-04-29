import React, { useState, useEffect } from "react";
import { TreeContext, UIContext, initialAppState, initialUIState } from './Store';
import { Layout } from 'antd';
import { getCurrentUser, loadTree } from "./lib/parse";
import TopMenu from "./TopMenu/";
import UserMenu from "./UserMenu/";
import TreeName from "./TopMenu/TreeName";
import Tree from "./Tree/";
import Questionnaire from "./Questionnaire";
import Shortcuts from "./Shortcuts";
import "./styles.css";

const { Content } = Layout;

export default function App() {
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Get last edited Tree from localstorage
  let storedTree;
  try {
    storedTree = JSON.parse(window.localStorage.getItem("tree"));
  } catch (e) {
    storedTree = null;
  }  

  const [tree, updateTree] = useState(storedTree || initialAppState);
  const [UI, updateUI] = useState(initialUIState);

  // On launch
  useEffect(() => {
    // Fetch user data
    getCurrentUser({
      onSuccess: (response) => {
        // console.log("RESPONSE", response)
        updateUI({
          loggedIn: true,
          user: response
        });
      },
      onError: () => {
        updateUI({
          loggedIn: false,
          user: null
        });
      }
    });
    // Load Tree from given ?id= in the URL params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");
    if (id) {
      loadTree({
        id: 'xLZZaUVqcF',
        onSuccess: (response) => {
          console.log(response)
          refresh(response[0].tree);
        },
        onError: (error) => {
          console.error(error);
        }
      });
    }
  }, []);

  // Generic Tree refreshing function that forces re-rendering
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
          <TreeName />
          <Content className="App">
            <Tree />
          </Content>
        </Layout>
        {UI.questionnaire && <Questionnaire flow={tree} />}
        {UI.shortcuts && <Shortcuts />}
        {UI.userModal && <UserMenu />}
      </UIContext.Provider>
    </TreeContext.Provider>
  );
}
