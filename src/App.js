import React, { useState, useEffect } from "react";
import { TreeContext, ContentContext, UIContext, initialAppState, initialContentState, initialUIState } from './Store';
import { Layout, notification } from 'antd';
import { getCurrentUser, getMyTrees, loadTree, loadTreeContent } from "./lib/parse";
import { logger } from "./lib/helpers";
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
  // Get last edited Content from localstorage
  let storedContent;
  try {
    storedContent = JSON.parse(window.localStorage.getItem("content"));
  } catch (e) {
    storedContent = null;
  }

  const [tree, updateTree] = useState(storedTree || initialAppState);
  const [content, updateContent] = useState(storedContent || initialContentState);
  const [UI, updateUI] = useState(initialUIState);
  const [mode, setMode] = useState('loading');

  // On launch
  useEffect(() => {
    updateUI({ ...UI, loading: true });
    // Fetch user data
    getCurrentUser({
      onSuccess: (response) => {
        // Get user's saved trees
        getMyTrees({
          onSuccess: (response2) => {
            updateUI({
              ...UI,
              loading: false,
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
          logger(response);
          refreshTree(response[0].tree);
          loadTreeContent({ treeId: response[0].tree.objectId })
          .then((result) => {
            refreshContent(result);
          })
          if (questionnaire) {
            window.history.replaceState({}, document.title, "/");
            setMode("questionnaire");
          } else {
            setMode("editor");
          }
        },
        onError: (error) => {
          logger(error);
          notification.error({ message: "Couldn't load Tree", description: "Maybe it was wrong ID...?" })
        }
      });
    } else {
      setMode("editor");
    }
  }, []);

  function refreshTree(loadNewTree) {
    let newTree = JSON.stringify(loadNewTree) || JSON.stringify(tree);
    updateTree(JSON.parse(newTree));
    if (mode === "editor") {
      window.localStorage.setItem("tree", JSON.stringify(tree));
    }
  }

  function refreshUI(newState) {
    updateUI({
      ...UI,
      ...newState      
    });
  }

  function refreshContent(newContent) {
    if (content.length === 0 || !content) {
      updateContent(newContent);
      window.localStorage.setItem("content", JSON.stringify(newContent));
    } else {
      let updatedContent
      // new entry 
      if (!content.find(c => c.nodeId === newContent.nodeId)) {
        updatedContent = content.push(newContent);
      }
      // or update?
      updatedContent = content.map(c => {
        if (c.nodeId === newContent.nodeId) {
          return newContent;
        }
        return c;
      });
      updateContent(updatedContent);
      if (mode === "editor") {
        window.localStorage.setItem("content", JSON.stringify(updatedContent));
      }
    }
  }

  function resetContent() {
    updateContent([]);
    if (mode === "editor") {
      window.localStorage.removeItem("content");
    }
  }

  return (
    <TreeContext.Provider value={{ tree, onRefresh: refreshTree }}>
      <ContentContext.Provider value={{ state: content, setState: refreshContent, clear: resetContent }}>
        <UIContext.Provider value={{ state: UI, setState: refreshUI }}>
          {mode === "questionnaire" && <Questionnaire flow={tree} preview={false} />}
          {mode === "editor" && <Layout>
            <TopMenu onEnterPreview={() => setMode("questionnaire")} onExitPreview={() => setMode("editor")} />
            <TreeName />
            <Content className="App">
              <Tree />
            </Content>
          </Layout>}
          {UI.shortcuts && <Shortcuts />}
          {UI.userModal && <UserMenu />}
          {UI.codeModal && <ShowCode />}
        </UIContext.Provider>
      </ContentContext.Provider>
    </TreeContext.Provider>
  );
}
