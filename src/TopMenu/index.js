import React from "react";
import { TreeContext, UIContext } from '../Store';
import { Menu, Modal, Button, notification } from 'antd';
import { BranchesOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { signOut, saveToDB, updateTreeInDB, getMyTrees, loadTree, deleteTree } from "../lib/parse";
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
    saveToDB({
      tree,
      onSuccess: (response) => {
        console.log("NEW TREE", response);
        console.log(store.tree[0])
        store.tree[0].root.id = response.objectId;
        store.onRefresh();
        notification.success({ message: "Saved to Cloud" });
        // refresh menu list
        getMyTrees({
          onSuccess: (response) => {
            setMyTrees(response);
          },
          onError: (error) => {
            console.error(error);
          }
        });
      },
      onError: (response) => {
        notification.error({ message: "Cannot save", description: response });
        console.log('ERROR', response)
      }
    });
  }

  function updateTree(tree) {
    updateTreeInDB({
      tree,
      onSuccess: (response) => {
        console.log("TREE UPDATED", response);
        notification.success({ message: "Updated" });
      },
      onError: (response) => {
        notification.error({ message: "Cannot save", description: response });
        console.log('ERROR', response)
      }
    })
  }

  function handleDeleteTree(id) {
    confirm({
      title: 'Delete this tree?',
      icon: <ExclamationCircleOutlined />,
      content: 'There is no way to undo',
      onOk() {
        deleteTree({
          id,
          onSuccess: (response) => {
            notification.success({ message: response });
            window.localStorage.removeItem('tree');
            window.location.reload();
          },
          onError: (response) => {
            notification.error({ message: "Cannot delete", description: response });
            console.log('ERROR', response)
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
        loadTree({
          id,
          onSuccess: (response) => {
            console.log(response)
            store.onRefresh(response[0].tree);
          },
          onError: (error) => {
            console.error(error);
            notification.error({ message: "Cannot load", description: error })
          }
        });
      },
      onCancel() {},
    });
  }

  const [myTrees, setMyTrees] = React.useState([]);

  React.useEffect(() => {
    getMyTrees({
      onSuccess: (response) => {
        setMyTrees(response);
      },
      onError: (error) => {
        console.error(error);
      }
    });
  }, []);

  const myTreeList = myTrees.map((item, index) => <Menu.Item
    key={index}
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
            <BranchesOutlined />
            Iteratree
          </span>
        }
      >
        <Menu.Item
          onClick={() => {
            reset();
          }}
        >New</Menu.Item>
        <Menu.Item
          disabled={!UI.state.user || (store.tree[0].root && store.tree[0].root.id !== "")}
          onClick={() => {
            saveAs(tree);
          }}
        >Save to Cloud</Menu.Item>
        <Menu.Item
          disabled={!UI.state.user || (store.tree[0].root && store.tree[0].root.id === "")}
          onClick={() => {
            updateTree(tree);
          }}
        >Update on Cloud</Menu.Item>
        <Menu.Item
          disabled={!UI.state.user || (store.tree[0].root && store.tree[0].root.id === "")}
          onClick={() => {
            handleDeleteTree(tree[0].root.id);
          }}
        >Delete from Cloud</Menu.Item>
        <Menu.Item
          onClick={() => {
            UI.setState({ questionnaire: true });
          }}
        >Generate Questionnaire</Menu.Item>
        <Menu.Item
          onClick={() => {
            console.log(JSON.stringify(tree));
            notification.success({ message: "Exported to JSON", description: "You can find JSON from the Console now" });
          }}
        >Export JSON</Menu.Item>
        <Menu.Item
          onClick={() => {
            UI.setState({ shortcuts: true });
          }}
        >Keyboard Shortcuts</Menu.Item>
      </SubMenu>
      <SubMenu
        title={
          <span className="submenu-title-wrapper">
            Examples
          </span>
        }
      >
        <Menu.Item
          onClick={() => {
            load(happy);
          }}
        >Are you happy?</Menu.Item>
        <Menu.Item
          onClick={() => {
            load(week);
          }}
        >Weekly Routine</Menu.Item>
        <Menu.Item
          onClick={() => {
            load(feedback);
          }}
        >Customer Feedback</Menu.Item>
        <Menu.Item
          onClick={() => {
            load(setPlanning);
          }}
        >DJ Set Plan</Menu.Item>
      </SubMenu>
      {myTreeList.length > 0 && <SubMenu
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
          disabled={UI.state.loggedIn}
          onClick={() => {
            UI.setState({ userModal: true });
          }}
        >Sign-In / Sign-Up</Menu.Item>
        <Menu.Item
          disabled={!UI.state.loggedIn}
          onClick={() => {
            signOut();
          }}
        >Sign Out</Menu.Item>
      </SubMenu>
      {UI.state.questionnaire && <Button
        type="primary"
        style={{ position: 'absolute', right: '7px', top: '7px' }}
        onClick={() => {
          UI.setState({ questionnaire: false });
        }}
      >EXIT</Button>}
    </Menu>
  );
}
