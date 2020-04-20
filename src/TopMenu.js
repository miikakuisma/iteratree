import React from "react";
import { TreeContext, UIContext } from './Store';
import { Menu, Modal, notification } from 'antd';
import { BranchesOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
            UI.setUI({ questionnaire: true });
          }}
        >Generate Questionnaire</Menu.Item>
        <Menu.Item
          onClick={() => {
            console.log(JSON.stringify(tree));
            notification.success({ message: "Exported to JSON", description: "You can find JSON from the Console now" });
          }}
        >Export JSON</Menu.Item>
      </SubMenu>
      {UI.state.questionnaire && <Menu.Item
        onClick={() => {
          UI.setUI({ questionnaire: false });
        }}
      >EXIT</Menu.Item>}
    </Menu>
  );
}
