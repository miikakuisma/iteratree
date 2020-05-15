import React, { useContext, Fragment } from "react";
import PropTypes from "prop-types";
import { TreeContext, ContentContext, UIContext } from '../Store';
import { Menu, Modal, Button, notification, message } from 'antd';
import { BranchesOutlined, ExclamationCircleOutlined, UserOutlined, ClearOutlined, FileAddOutlined, DeleteOutlined, QuestionCircleOutlined, ExportOutlined, QrcodeOutlined, LoadingOutlined, ShareAltOutlined } from '@ant-design/icons';
import { signOut, saveNewTree, updateSavedTree, loadTree, deleteTree, getMyTrees, loadTreeContent } from "../lib/parse";
import { blank, tutorial, happy, feedback, week } from './Examples';
import md5 from "md5";
import "../styles.css";

// eslint-disable-next-line no-undef
const traverse = require("traverse");

const propTypes = {
  onEnterPreview: PropTypes.func,
  onExitPreview: PropTypes.func,
};

const { SubMenu } = Menu;
const { confirm } = Modal;

function TopMenu({ onEnterPreview, onExitPreview }) {
  const store = useContext(TreeContext);
  const content = useContext(ContentContext);
  const UI = useContext(UIContext);
  const { tree } = store;
  const { user, loggedIn, myTrees, loading } = UI.state;

  const userLoggedIn = user && loggedIn;
  const avatarImage = UI.state.user ? <img alt="gravatar" className="avatar" src={`https://gravatar.com/avatar/${md5(UI.state.user.email)}`} /> : <UserOutlined className="avatar" /> ;

  const treeId = store.tree[0].root.id;

  const myTreeList = myTrees && myTrees.map((item, index) => <Menu.Item
    key={`setting:${index}`}
    onClick={() => {
      fetchTree(item.objectId);
    }}
  >{item.name}</Menu.Item>);

  function reset() {
    UI.setState({ modalOpen: true });
    confirm({
      title: 'Do you want to start over?',
      icon: <ExclamationCircleOutlined />,
      content: 'Unsaved changes will be lost',
      onOk() {
        window.localStorage.removeItem('tree');
        window.localStorage.removeItem('content');
        load(blank, true);
        // window.location.reload();
      },
      onCancel() {
        UI.setState({ modalOpen: false });
      },
    });
  }

  function refreshMenu() {
    // refresh menu list
    getMyTrees({
      onSuccess: (response2) => {
        UI.setState({
          myTrees: response2
        });
      },
      onError: () => {
        // couldn't get the trees (maybe there was none)
      }
    });    
  }

  function load(tree, skipConfirm) {
    UI.setState({ modalOpen: true });
    if (skipConfirm) {
      UI.setState({ modalOpen: false });
      store.onRefresh(tree);
      content.clear();
    } else {
      confirm({
        title: 'Unsaved changes will be lost',
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure you want to open this project?',
        onOk() {
          UI.setState({ modalOpen: false });
          store.onRefresh(tree);
          content.clear();
        },
        onCancel() {
          UI.setState({ modalOpen: false });
        },
      });  
    }
  }

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

  function updateTree(tree) {
    message.loading('Saving in progress..');
    updateSavedTree({
      tree,
      onSuccess: () => {
        message.destroy();
        store.onRefresh();
        notification.success({ message: "Saved to Cloud" });
        refreshMenu();
      },
      onError: (response) => {
        notification.error({ message: "Cannot save", description: response });
        message.destroy();
      }
    })
  }

  function handleDeleteTree(id) {
    UI.setState({ modalOpen: true });
    confirm({
      title: 'Delete this tree?',
      icon: <ExclamationCircleOutlined />,
      content: 'There is no way to undo',
      onOk() {
        UI.setState({ modalOpen: false });
        message.loading('Deleting tree..');
        deleteTree({
          id,
          onSuccess: (response) => {
            notification.success({ message: response });
            window.localStorage.removeItem('tree');
            window.location.reload();
            message.destroy();
          },
          onError: (response) => {
            notification.error({ message: "Cannot delete", description: response });
            message.destroy();
            // logger('ERROR', response);
          }
        })
      },
      onCancel() {
        UI.setState({ modalOpen: false });
      },
    });
  }

  function fetchTree(id) {
    UI.setState({ modalOpen: true });
    confirm({
      title: 'Unsaved changes will be lost',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to open that?',
      onOk() {
        UI.setState({ modalOpen: false });
        message.loading('Loading tree..');
        loadTree({
          id,
          onSuccess: (response) => {
            // logger(response);
            store.onRefresh(response[0].tree);
            loadTreeContent({ treeId: id }).then((result) => {
              content.setState(result);
              message.destroy();
            })
          },
          onError: (error) => {
            // console.error(error);
            notification.error({ message: "Cannot load", description: error })
            message.destroy();
          }
        });
      },
      onCancel() {
        UI.setState({ modalOpen: false });
      },
    });
  }

  function resetCounts() {
    confirm({
      title: 'All user feedback will be lost',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to do that?',
      onOk() {
        traverse(tree).forEach(function(x) {
          if (typeof x === 'object') {
            if(x.clicks) {
              delete x.clicks
            }
          }
        });
        store.onRefresh();
      },
    });
  }

  return (
    <Menu mode="horizontal" selectable={false}>
      <SubMenu
        title={
          <span className="submenu-title-wrapper">
            <BranchesOutlined style={{
              transform: 'rotate(180deg) scaleX(-1)'
            }} />
            Iteratree
          </span>
        }
      >
        <Menu.ItemGroup title="Project">
          <Menu.Item
            key="setting:1"
            onClick={() => {
              reset();
            }}
          ><ClearOutlined />New</Menu.Item>
          <Menu.Item
            key="setting:2"
            onClick={() => {
              if (!userLoggedIn || !treeId || treeId === "") {
                saveAs(tree);
              } else {
                updateTree(tree);
              }
            }}
          ><FileAddOutlined />Save</Menu.Item>
          <Menu.Item
            key="setting:3"
            disabled={!userLoggedIn || !treeId || treeId === ""}
            onClick={() => {
              handleDeleteTree(tree[0].root.id);
            }}
          ><DeleteOutlined />Delete</Menu.Item>
          <Menu.Item
            key="setting:5"
            disabled={!userLoggedIn || (treeId === "")}
            onClick={() => {
              navigator.clipboard.writeText(`https://iteratree.com/?id=${treeId}`);
              notification.success({
                duration: 0,
                message: "Share Link Copied!",
                description: `https://iteratree.com/?id=${treeId}`
              });              
            }}
          ><ShareAltOutlined />Share</Menu.Item>
        </Menu.ItemGroup>

        {/* <Menu.ItemGroup title="Export">
          <Menu.Item
            key="setting:4"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log(JSON.stringify(tree));
              notification.success({ message: "Exported to JSON", description: "You can find JSON from the Console now" });
            }}
          ><ExportOutlined />Export JSON</Menu.Item>          
        </Menu.ItemGroup> */}

        <Menu.ItemGroup title="Questionnaire">
          {/* <Menu.Item
            key="setting:6"
            onClick={() => {
              onEnterPreview();
              UI.setState({ questionnaire: true });
            }}
          ><BranchesOutlined />Preview</Menu.Item> */}
          <Menu.Item
            key="setting:7"
            disabled={!userLoggedIn || (treeId === "")}
            onClick={() => {
              UI.setState({ codeModal: true });
            }}
          ><QrcodeOutlined />Publish QR-Code</Menu.Item>
          <Menu.Item
            key="setting:8"
            disabled={!userLoggedIn || (treeId === "")}
            onClick={() => {
              resetCounts(tree);
              store.onRefresh();
            }}
          ><QrcodeOutlined />Reset click counts</Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup title="Help">
          <Menu.Item
            key="setting:9"
            onClick={() => {
              UI.setState({ shortcuts: true });
            }}
          ><QuestionCircleOutlined />Keyboard Shortcuts</Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>
      <SubMenu
        title={
          <span className="submenu-title-wrapper">
            Examples
          </span>
        }
      >
        <Menu.ItemGroup title="Questionnaires">
          <Menu.Item
            key="setting:1"
            onClick={() => {
              load(tutorial);
            }}
          >Tutorial</Menu.Item>
          <Menu.Item
            key="setting:2"
            onClick={() => {
              load(happy);
            }}
          >Are you happy?</Menu.Item>
          <Menu.Item
            onClick={() => {
              load(feedback);
            }}
          >Customer Feedback</Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup title="Other">
          <Menu.Item
            key="setting:4"
            onClick={() => {
              load(week);
            }}
          >Weekly Routine</Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>
      {myTreeList && myTreeList.length > 0 && <SubMenu
        title={
          <span className="submenu-title-wrapper">
            My Trees
          </span>
        }
      >
        {myTreeList}
      </SubMenu>}
      <SubMenu
        style={{ float: 'right' }}
        className="usermenu"
        title={
          <span className="submenu-title-wrapper">
            {UI.state.user ? avatarImage : (loading ? <LoadingOutlined width={30} height={30} className="avatar" /> : <span style={{ marginRight: '10px' }}>Account</span>)}
          </span>
        }
      >
        <Menu.Item
          key="setting:1"
          disabled={UI.state.loggedIn}
          onClick={() => {
            UI.setState({ userModal: true });
          }}
        >Sign-In / Sign-Up</Menu.Item>
        <Menu.Item
          key="setting:2"
          disabled={!UI.state.loggedIn}
          onClick={() => {
            signOut();
          }}
        >Sign Out</Menu.Item>
      </SubMenu>
      {UI.state.questionnaire ?
        <Fragment>
          <Button
            style={{ position: 'absolute', right: '106px', top: '8px', zIndex: 999999 }}
            onClick={() => {
              UI.setState({ questionnaire: false });
              onExitPreview();
            }}
          >EXIT</Button>
          <Button
            type="primary"
            style={{ position: 'absolute', right: '8px', top: '8px', zIndex: 999999 }}
            disabled={!UI.state.loggedIn}
            onClick={() => {
              UI.setState({
                questionnaire: false,
                codeModal: true
              });
              onExitPreview();
            }}
          >PUBLISH</Button>
        </Fragment>
        :
        null
      }
    </Menu>
  );
}

TopMenu.propTypes = propTypes;
export default TopMenu;