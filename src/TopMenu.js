import React from "react";
import { TreeContext } from './Store';
import { Menu, Modal, notification } from 'antd';
import { BranchesOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import "./styles.css";

const { SubMenu } = Menu;

export default function TopMenu() {
  const store = React.useContext(TreeContext);
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
            console.log(JSON.stringify(tree));
            notification.success({ message: "Exported to JSON", description: "You can find JSON from the Console now" });
          }}
        >Export JSON</Menu.Item>
      </SubMenu>
    </Menu>
  );
}
