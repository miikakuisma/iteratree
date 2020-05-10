import React, { useContext } from "react";
import { TreeContext, UIContext } from './Store';
import QRCode from "react-qr-code";
import domtoimage from 'dom-to-image';
import { Modal } from 'antd';

import "./styles.css";

export default function ShowCode() {
  const UI = useContext(UIContext);
  const store = useContext(TreeContext);
  const id = store.tree[0].root.id;

  const handleDownload = () => {
    // domtoimage.toBlob(document.getElementById('qr-code'))
    // .then(function (blob) {
    //     window.saveAs(blob, 'my-node.png');
    // });
    domtoimage.toJpeg(document.getElementById('qr-code'), { quality: 0.95 })
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = `Questionnaire - ${store.tree[0].root.name}.jpg`;
        link.href = dataUrl;
        link.click();
    });
  }

  return (
    <Modal
      title="Questionnaire QR-Code"
      width={310}
      visible={true}
      closable={false}
      cancelText='Close'
      okText='Download'
      onOk={() => {
        handleDownload();
        UI.setState({ codeModal: false });
      }}
      onCancel={() => {
        UI.setState({ codeModal: false });
      }}
    >
      <div id="qr-code" onClick={handleDownload}>
        <QRCode value={`https://iteratree.com/?id=${id}&questionnaire=true`} />
      </div>
    </Modal>
  );
}
