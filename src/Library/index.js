import React, { useContext, useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { UIContext } from '../Store';
import { Modal, Tabs, message, Card, Col, Row, Popconfirm } from 'antd';
// import Unsplash, { toJson } from 'unsplash-js';
import { saveImage } from '../lib/parse';
import { LoadingOutlined, PlusOutlined, CloseCircleFilled } from '@ant-design/icons';
import { listImages, deleteImage } from "../lib/parse";

const propTypes = {
  selected: PropTypes.string,
  onCancel: PropTypes.func,
  onSelect: PropTypes.func,
};

const { TabPane } = Tabs;

export function Library({ selected, onCancel, onSelect }) {
  const UI = useContext(UIContext);
  const { myImages } = UI.state;

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

  // const unsplash = new Unsplash({ accessKey: "BwmlWZDZ9rebOdV8o5UWOgzmtWVARTMYOW2mQlFxdVw" });
  // const handleSearch = () => {
  //   unsplash.search.photos("dogs", 1, 10, { orientation: "portrait" })
  //   .then(toJson)
  //   .then(json => {
  //     console.log(json);
  //   });  
  // }

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

  const myImageList = myImages && myImages.map((item, index) => <Col key={`tree-${index}`} span={6}>
    <Card
      bordered={false}
      hoverable={true}
      className={selected === item.objectId && "selected"}
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
        <CloseCircleFilled className="delete-button" />
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

Library.propTypes = propTypes;
export default Library;
