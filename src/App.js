import React, { useState, useEffect } from "react";
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

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const loginPage = urlParams.get("login");

  const checkLoginState = () => {
    window.FB.getLoginStatus((response) => {
      console.log(response);
      const { status, userID } = response;
      if (status === "connected") {
        updateUI({
          loggedIn: true,
          userID
        });
      }
    });
  }

  useEffect(() => {
    checkLoginState();
  }, []);

  return (
    <TreeContext.Provider value={{ tree, onRefresh: refresh }}>
      <UIContext.Provider value={{ state: UI, setState: updateUI }}>
        <Layout>
          <TopMenu />
          <Content className="App">
            <Tree />
          </Content>
        </Layout>
        {!UI.loggedIn && loginPage && <div className="login">
          <div className="fb-login-button" data-size="medium" data-auto-logout-link="true" data-onlogin={checkLoginState()}></div>
        </div>}
        {UI.questionnaire && <Questionnaire flow={tree} />}
        {UI.shortcuts && <Shortcuts />}
      </UIContext.Provider>
    </TreeContext.Provider>
  );
}
