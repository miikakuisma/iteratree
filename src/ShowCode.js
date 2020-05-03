import React, { useContext } from "react";
import { TreeContext, UIContext } from './Store';
import QRCode from "react-qr-code";
import { Modal } from 'antd';

import "./styles.css";

export default function ShowCode() {
  const UI = useContext(UIContext);
  const store = useContext(TreeContext);
  const id = store.tree[0].root.id;

  return (
    <Modal
      title="Questionnaire QR-Code"
      width={310}
      visible={true}
      closable={false}
      cancelButtonProps={{ disabled: true }}
      onOk={() => {
        UI.setState({ ...UI.state, codeModal: false })
      }}
    >
      <QRCode value={`https://iteratree.com/?id=${id}&questionnaire=true`} />
    </Modal>
  );
}
