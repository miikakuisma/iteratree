import React, { Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { TreeContext, UIContext } from '../Store';
import { Button, Typography, message, notification } from 'antd';
import { LeftSquareFilled, RightSquareFilled } from '@ant-design/icons';
import { saveNewTree, updateSavedTree } from "../lib/parse";
import { SidebarContainer } from './animations';
import Questionnaire from '../Questionnaire';
// import ContentTools from './ContentTools';

const { Text } = Typography;

const propTypes = {
  open: PropTypes.bool,
  selectedNode: PropTypes.object,
  onSelectNode: PropTypes.func,
};

export function Sidebar({ open, selectedNode, onSelectNode }) {
  const store = useContext(TreeContext);
  const UI = useContext(UIContext);

  const { tree } = store;
  const { sidebarOpen, user, loggedIn } = UI.state;
  const userLoggedIn = user && loggedIn;
  const treeId = tree[0].root.id;

  // SAME AS IN TOPMENU (REFACTOR SOMEHOW??)
  function saveAs(tree) {
    message.loading('Saving in progress..');
    saveNewTree({
      tree,
      onSuccess: (response) => {
        // logger("NEW TREE", response);
        // logger(store.tree[0])
        store.tree[0].root.id = response.objectId;
        store.tree[0].root.author = UI.state.user.objectId;
        // Let's update the saved Tree so that the ID that just got generated during saving gets saved to the data
        updateTree(store.tree);
        message.destroy();
        // window.location.reload();
      },
      onError: (response) => {
        notification.error({ message: "Cannot save", description: response });
        message.destroy();
        // logger('ERROR', response)
      }
    });
  }

  // SAME AS IN TOPMENU (REFACTOR SOMEHOW??)
  function updateTree(tree) {
    message.loading('Saving in progress..');
    updateSavedTree({
      tree,
      onSuccess: () => {
        message.destroy();
        store.onRefresh();
        notification.success({ message: "Saved to Cloud" });
      },
      onError: (response) => {
        notification.error({ message: "Cannot save", description: response });
        message.destroy();
      }
    })
  }

  return (
    <SidebarContainer className="sidebar" pose={open ? 'visible' : 'hidden'} style={{ overflow: open ? 'overlay' : 'visible' }}>
      <div className="top">
        {sidebarOpen && <Fragment>
          <Text style={{ color: 'white' }}>Preview</Text>
          <Button
            type="primary"
            size="small"
            disabled={!userLoggedIn}
            onClick={() => {
              // onEnterPreview();
              // UI.setState({ view: true });
              if (!treeId || treeId === "") {
                saveAs(tree);
                UI.setState({ codeModal: true });
              } else {
                updateTree(tree);
                UI.setState({ codeModal: true });
              }
            }}
          >Publish</Button>
        </Fragment>}
        <div
          className="opener"
          onClick={() => UI.setState({ sidebarOpen: !sidebarOpen })}
          style={{
            right: open ? '376px' : '0px'
          }}
        >
          {sidebarOpen ?
            <RightSquareFilled
              style={{
                fontSize: 20,
                color: '#eee',
                padding: '7px 4px',
                transform: 'translateX(25px)'
              }}
            />
            :
            <LeftSquareFilled
              style={{
                fontSize: 20,
                color: '#111',
                padding: '7px 4px'
              }}
            />}
        </div>
      </div>
      {/* <ContentTools selectedNode={selectedNode} /> */}
      <Questionnaire
        flow={selectedNode || tree[0]}
        preview={true}
        onAnswer={onSelectNode}
      />
    </SidebarContainer>
  );
}

Sidebar.propTypes = propTypes;
export default Sidebar;
