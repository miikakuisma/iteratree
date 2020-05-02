import React from "react";
import { UIContext } from '../Store';
import { Modal, Tabs } from 'antd';
import Signup from "./Signup";
import Signin from "./Signin";
import Reset from "./Reset";
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
      onCancel={() => { UI.setState({ ...UI.state, userModal: false }) }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Sign In" key="1">
          <Signin />
        </TabPane>
        <TabPane tab="Create Account" key="2">
          <Signup />
        </TabPane>
        <TabPane tab="Forgot password?" key="3">
          <Reset />
        </TabPane>
      </Tabs>
    </Modal>
  );
}
