import React, { useContext } from "react";
import { TreeContext, UIContext } from './Store';
import { Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import QRCode from "react-qr-code";
import domtoimage from 'dom-to-image';

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
        link.download = `Iteratree - ${store.tree[0].root.name}.jpg`;
        link.href = dataUrl;
        link.click();
        UI.setState({ codeModal: false });
    });
  }

  console.log(id)

  return (
    <Modal
      title="Published QR-Code"
      width={310}
      visible={true}
      closable={false}
      cancelText='Close'
      okText='Download'
      onOk={() => {
        handleDownload();
      }}
      onCancel={() => {
        UI.setState({ codeModal: false });
      }}
    >
      <div id="qr-code" onClick={handleDownload}>
        {id && id.length === 10 ? <QRCode value={`https://iteratree.com/?view=${id}`} /> : <LoadingOutlined style={{ fontSize: 128, width: '100%' }} />}
      </div>
    </Modal>
  );
}
