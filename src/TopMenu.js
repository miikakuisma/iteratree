import React from "react";
import { TreeContext, UIContext } from './Store';
import { Menu, Modal, notification } from 'antd';
import { BranchesOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { happy, feedback, setPlanning, week } from './Examples';
import "./styles.css";

const { SubMenu } = Menu;

export default function TopMenu() {
  const store = React.useContext(TreeContext);
  const UI = React.useContext(UIContext);
  const { tree } = store;

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
      {UI.state.questionnaire && <Menu.Item
        onClick={() => {
          UI.setState({ questionnaire: false });
        }}
      >EXIT</Menu.Item>}
    </Menu>
  );
}
