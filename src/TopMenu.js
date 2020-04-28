import React, { useState, useEffect } from "react";
import { TreeContext, UIContext } from './Store';
import { Menu, Modal, Button, notification } from 'antd';
import { BranchesOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { signOut } from "./lib/user";
import { happy, feedback, setPlanning, week } from './Examples';
import md5 from "md5";
import "./styles.css";

const { SubMenu } = Menu;

export default function TopMenu() {
  const store = React.useContext(TreeContext);
  const UI = React.useContext(UIContext);
  const { tree } = store;

  const [avatar, setAvatar] = useState(null);

  function reset() {
    const { confirm } = Modal;
    confirm({
      title: 'Do you want to start over?',
      icon: <ExclamationCircleOutlined />,
      content: 'Everything will be lost forever',
      onOk() {
        window.localStorage.clear();
        window.location.reload();
      },
      onCancel() {},
    });
  }

  function load(tree) {
    const { confirm } = Modal;
    confirm({
      title: 'Current work will be lost',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to open this tutorial?',
      onOk() {
        store.onRefresh(tree);
      },
      onCancel() {},
    });
  }

  const avatarImage = UI.state.user ? <img className="avatar" src={`http://gravatar.com/avatar/${md5(UI.state.user.email)}`} /> : <img src="" />;

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
