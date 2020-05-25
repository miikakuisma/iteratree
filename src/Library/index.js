import React, { useContext, useEffect, useState, Fragment } from "react";
import { UIContext } from '../Store';
import { Modal, Tabs, message, Button, Card, Col, Row, Popconfirm } from 'antd';
import { saveImage } from '../lib/parse';
import { LoadingOutlined, PlusOutlined, DeleteFilled } from '@ant-design/icons';
import { listImages, deleteImage } from "../lib/parse";

const { TabPane } = Tabs;
const { confirm } = Modal;

export default function Library({ onCancel, onSelect }) {
  const UI = useContext(UIContext);
  const { myImages } = UI.state;

  const [enableUpload, setEnableUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const refreshList = () => {
    listImages()
    .then((response) => {
      UI.setState({
        myImages: response
      });
    })
  }

  useEffect(() => {
    refreshList();
  }, [])

  function handleTabChange(key) {
    window.localStorage.setItem('lastBrowserTab', key);
    switch (key) {
      case 1:
        refreshList();
        break;
      case 2:
        break;
    }
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async function handleUpload() {
    setUploading(true);
    const file = document.querySelector('#myfile').files[0];
    saveImage({
      name: file.name,
      type: file.type,
      size: file.size,
      base64: await toBase64(file)
    })
    .catch((error) => {
      message.error(error);
      setUploading(false);
    })
    .then((response) => {
      message.success("Image was uploaded");
      onSelect(response.objectId);
      setUploading(false);
    });
  }

  const Upload = () => {
    return (<Col span={6}>
      <Card
        title="Upload"
        bordered={false}
        hoverable={true}
        size="small"
        onClick={() => {
          document.querySelector('#myfile').click();
        }}
      >
        {!uploading && (
          <Fragment>
            <PlusOutlined className="addNewThumb" />
            <div className="photo-upload" style={{ display: 'none' }}>
              <input type="file" id="myfile" onChange={handleUpload} />
            </div>
          </Fragment>
        )}
        {uploading && (
          <LoadingOutlined className="addNewThumb" />
        )}
        </Card>
    </Col>)
  }

  // const getDate = (timestamp) => {
  //   let date = new Date(timestamp).toLocaleDateString('fi-FI');
  //   return date.toString();
  // }

  const myImageList = myImages && myImages.map((item, index) => <Col key={`tree-${index}`} span={6}>
    <Card
      // title={getDate(item.createdAt)}
      bordered={false}
      hoverable={true}
      size="small"
      onClick={(e) => {
        if (e.target.classList.length > 1) {
          return
        }
        onSelect(item.objectId);
      }}
    >
      <img src={item.photo.url} />
      <Popconfirm
        title="Delete this file from the server?"
        onConfirm={() => {
          deleteImage({ id: item.objectId }).then(() => {
            message.success("Image was deleted");
            refreshList();
          });
        }}
        okText="Yes"
        cancelText="No"
      >
        <Button shape="circle" danger className="delete-button" icon={<DeleteFilled />}></Button>
      </Popconfirm>
    </Card>
  </Col>);

  return (
    <Modal
      width={window.innerWidth - 40}
      visible={true}
      closable={true}
      maskClosable={true}
      cancelText='Cancel'
      className="library"
      onCancel={onCancel}
    >
      <Tabs
        defaultActiveKey={"1"}
        onChange={handleTabChange}
      >
        <TabPane tab="My Images" key="1">
          <div className="site-card-wrapper">
            <Row gutter={[16, 16]}>
              <Upload />
              {myImageList || <LoadingOutlined />}
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
}
