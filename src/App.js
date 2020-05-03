import React, { useState, useEffect } from "react";
import { TreeContext, UIContext, initialAppState, initialUIState } from './Store';
import { Layout, notification } from 'antd';
import { getCurrentUser, getMyTrees, loadTree } from "./lib/parse";
import TopMenu from "./TopMenu/";
import UserMenu from "./UserMenu/";
import TreeName from "./TopMenu/TreeName";
import Tree from "./Tree/";
import Questionnaire from "./Questionnaire";
import Shortcuts from "./Shortcuts";
import ShowCode from "./ShowCode";
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
  const [mode, setMode] = useState('loading');

  // On launch
  useEffect(() => {
    // Fetch user data
    getCurrentUser({
      onSuccess: (response) => {
        // Get user's saved trees
        getMyTrees({
          onSuccess: (response2) => {
            updateUI({
              ...UI,
              loggedIn: true,
              user: response,
              myTrees: response2
            });
          },
          onError: () => {
            // couldn't get the trees (maybe there was none)
          }
        });
      },
      onError: () => {
        updateUI({
          ...UI,
          loggedIn: false,
          user: null
        });
      }
    });

    // Load Tree from given ?id= in the URL params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");
    const questionnaire = urlParams.get("questionnaire");
    if (id) {
      loadTree({
        id,
        onSuccess: (response) => {
          // console.log(response)
          refresh(response[0].tree);
          if (questionnaire) {
            setMode("questionnaire");
          } else {
            setMode("editor");
          }
        },
        onError: () => {
          // console.error(error);
          notification.error({ message: "Couldn't load Tree", description: "Maybe it was wrong ID...?" })
        }
      });
    } else {
      setMode("editor");
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
          <TopMenu onEnterPreview={() => setMode("questionnaire")} onExitPreview={() => setMode("editor")} />
          <TreeName />
          {mode === "editor" &&<Content className="App">
            <Tree />
          </Content>}
        </Layout>
        {mode === "questionnaire" && <Questionnaire flow={tree} />}
        {UI.shortcuts && <Shortcuts />}
        {UI.userModal && <UserMenu />}
        {UI.codeModal && <ShowCode />}
      </UIContext.Provider>
    </TreeContext.Provider>
  );
}
