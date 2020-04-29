import React from "react";
import { TreeContext, UIContext } from '../Store';
import { Menu, Modal, Button, notification, message } from 'antd';
import { BranchesOutlined, ExclamationCircleOutlined, UserOutlined, ClearOutlined, FileAddOutlined, ReloadOutlined, DeleteOutlined, QuestionCircleOutlined, ExportOutlined } from '@ant-design/icons';
import { signOut, saveToDB, updateTreeInDB, loadTree, deleteTree, getMyTrees } from "../lib/parse";
import { happy, feedback, setPlanning, week } from './Examples';
import md5 from "md5";
import "../styles.css";

const { SubMenu } = Menu;
const { confirm } = Modal;

export default function TopMenu() {
  const store = React.useContext(TreeContext);
  const UI = React.useContext(UIContext);
  const { tree } = store;

  function reset() {
    confirm({
      title: 'Do you want to start over?',
      icon: <ExclamationCircleOutlined />,
      content: 'Unsaved changes will be lost',
      onOk() {
        window.localStorage.removeItem('tree');
        window.location.reload();
      },
      onCancel() {},
    });
  }

  function refreshMenu() {
    // refresh menu list
    getMyTrees({
      onSuccess: (response2) => {
        UI.setState({
          ...UI,
          myTrees: response2
        });
      },
      onError: () => {
        // couldn't get the trees (maybe there was none)
      }
    });    
  }

  function load(tree) {
    confirm({
      title: 'Unsaved changes will be lost',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to open this tutorial?',
      onOk() {
        store.onRefresh(tree);
      },
      onCancel() {},
    });
  }

  function saveAs(tree) {
    message.loading('Saving in progress..');
    saveToDB({
      tree,
      onSuccess: (response) => {
        // console.log("NEW TREE", response);
        // console.log(store.tree[0])
        store.tree[0].root.id = response.objectId;
        store.onRefresh();
        notification.success({ message: "Saved to Cloud" });
        refreshMenu();
        // Let's update the saved Tree so that the ID that just got generated during saving gets saved to the data
        updateTree(store.tree);
        message.destroy();
      },
      onError: (response) => {
        notification.error({ message: "Cannot save", description: response });
        message.destroy();
        // console.log('ERROR', response)
      }
    });
  }

  function updateTree(tree) {
    message.loading('Saving in progress..');
    updateTreeInDB({
      tree,
      onSuccess: () => {
        message.destroy();
      },
      onError: (response) => {
        notification.error({ message: "Cannot save", description: response });
        message.destroy();
      }
    })
  }

  function handleDeleteTree(id) {
    confirm({
      title: 'Delete this tree?',
      icon: <ExclamationCircleOutlined />,
      content: 'There is no way to undo',
      onOk() {
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
            // console.log('ERROR', response);
          }
        })
      },
      onCancel() {},
    });
  }

  function fetchTree(id) {
    confirm({
      title: 'Unsaved changes will be lost',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to open that?',
      onOk() {
        message.loading('Loading tree..');
        loadTree({
          id,
          onSuccess: (response) => {
            // console.log(response);
            store.onRefresh(response[0].tree);
            message.destroy();
          },
          onError: (error) => {
            // console.error(error);
            notification.error({ message: "Cannot load", description: error })
            message.destroy();
          }
        });
      },
      onCancel() {},
    });
  }

  const myTrees = UI.state.myTrees;

  const myTreeList = myTrees && myTrees.map((item, index) => <Menu.Item
    key={`setting:${index}`}
    onClick={() => {
      fetchTree(item.objectId);
    }}
  >{item.name}</Menu.Item>);

  const avatarImage = UI.state.user ? <img alt="gravatar" className="avatar" src={`http://gravatar.com/avatar/${md5(UI.state.user.email)}`} /> : <UserOutlined className="avatar" /> ;

  return (
    <Menu mode="horizontal">
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
              saveAs(tree);
            }}
          ><FileAddOutlined />Save as New</Menu.Item>
          <Menu.Item
            key="setting:3"
            disabled={!UI.state.user || (store.tree[0].root && store.tree[0].root.id === "")}
            onClick={() => {
              updateTree(tree);
            }}
          ><ReloadOutlined />Update on Cloud</Menu.Item>
          <Menu.Item
            key="setting:4"
            disabled={!UI.state.user || (store.tree[0].root && store.tree[0].root.id === "")}
            onClick={() => {
              handleDeleteTree(tree[0].root.id);
            }}
          ><DeleteOutlined />Delete from Cloud</Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup title="Export">
          <Menu.Item
            key="setting:5"
            onClick={() => {
              UI.setState({ ...UI.state, questionnaire: true });
            }}
          ><BranchesOutlined />Generate Questionnaire</Menu.Item>
          <Menu.Item
            key="setting:6"
            onClick={() => {
              // console.log(JSON.stringify(tree));
              notification.success({ message: "Exported to JSON", description: "You can find JSON from the Console now" });
            }}
          ><ExportOutlined />Export JSON</Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup title="Help">
          <Menu.Item
            key="setting:7"
            onClick={() => {
              UI.setState({ ...UI.state, shortcuts: true });
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
            key="setting:2"
            onClick={() => {
              load(week);
            }}
          >Weekly Routine</Menu.Item>
          <Menu.Item
            key="setting:3"
            onClick={() => {
              load(setPlanning);
            }}
          >DJ Set Plan</Menu.Item>
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
            {UI.state.user ? avatarImage : <span style={{ marginRight: '10px' }}>Account</span>}
          </span>
        }
      >
        <Menu.Item
          key="setting:1"
          disabled={UI.state.loggedIn}
          onClick={() => {
            UI.setState({ ...UI.state, userModal: true });
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
      {UI.state.questionnaire && <Button
        type="primary"
        style={{ position: 'absolute', right: '7px', top: '7px', zIndex: 999999 }}
        onClick={() => {
          UI.setState({ ...UI.state, questionnaire: false });
        }}
      >EXIT</Button>}
    </Menu>
  );
}
