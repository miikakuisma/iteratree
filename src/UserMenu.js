import React from "react";
import { UIContext } from './Store';
import { Modal } from 'antd';
import Signup from "./Signup";
import Signin from "./Signin";
import "./styles.css";

export default function UserMenu() {
  const UI = React.useContext(UIContext);

  return (
    <Modal
      title="User"
      visible={true}
      closable={false}
      cancelButtonProps={{ disabled: true }}
      onOk={() => { UI.setState({ userModal: false }) }}
    >
      <Signup
        onSuccess={(response) => {
          console.log("success", response);
        }}
        onError={(error) => {
          console.log("error", error);
        }}
      />
      <Signin
        onSuccess={(response) => {
          console.log("success", response);
        }}
        onError={(error) => {
          console.log("error", error);
        }}
      />
    </Modal>
  );
}
