import React from "react";
import { UIContext } from '../Store';
import { Modal, Tabs } from 'antd';
import Signup from "./Signup";
import Signin from "./Signin";
import "../styles.css";

const { TabPane } = Tabs;

export default function UserMenu() {
  const UI = React.useContext(UIContext);

  return (
    <Modal
      title="User"
      visible={true}
      closable={true}
      okButtonProps={{ disabled: true }}
      onCancel={() => { UI.setState({ userModal: false }) }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Sign In" key="1">
          <Signin />
        </TabPane>
        <TabPane tab="Create Account" key="2">
          <Signup />
        </TabPane>
      </Tabs>
    </Modal>
  );
}
