import React, { useContext, useEffect } from "react";
import { TreeContext, UIContext } from '../Store';
import { Modal, Tabs, message, notification, Card, Col, Row } from 'antd';
import { ExclamationCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { loadTree, getMyTrees } from "../lib/parse";
import { blank, examples } from '../lib/examples';
import Thumbnail from "../Thumbnail";

const { TabPane } = Tabs;
const { confirm } = Modal;

// eslint-disable-next-line no-undef
const traverse = require("traverse");

export default function Browser() {
  const store = useContext(TreeContext);
  const UI = useContext(UIContext);
  const { myTrees } = UI.state;

  useEffect(() => {
    console.log('GET TREES')
    getMyTrees({
      onSuccess: (response2) => {
        UI.setState({
          myTrees: response2
        });
      },
      onError: () => {
        // couldn't get the trees (maybe there was none)
      }
    });
  }, [])

  function handleTabChange(key) {
    switch (key) {
      case 1:
        getMyTrees({
          onSuccess: (response2) => {
            UI.setState({
              myTrees: response2
            });
          },
          onError: () => {
            // couldn't get the trees (maybe there was none)
          }
        });
        break;
      case 2:
        break;
    }
  }

  function unselectAll(tree) {
    traverse(tree).forEach(function(x) {
      if (typeof x === 'object') {
        delete x.selected
      }
    });
  }

  function reset() {
    UI.setState({ modalOpen: true });
    confirm({
      title: 'Do you want to start over?',
      icon: <ExclamationCircleOutlined />,
      content: 'Unsaved changes will be lost',
      onOk() {
        window.localStorage.removeItem('tree');
        window.localStorage.removeItem('content');
        load(blank, true);
        // window.location.reload();
      },
      onCancel() {
        UI.setState({ modalOpen: false });
      },
    });
  }

  function load(tree, skipConfirm) {
    UI.setState({ modalOpen: true });
    if (skipConfirm) {
      UI.setState({
        modalOpen: false,
        browserOpen: false,
      });
      store.onRefresh(tree);
    } else {
      confirm({
        title: 'Unsaved changes will be lost',
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure you want to open this project?',
        onOk() {
          UI.setState({
            modalOpen: false,
            browserOpen: false,
          });
          store.onRefresh(tree);
        },
        onCancel() {
          UI.setState({ modalOpen: false });
        },
      });  
    }
  }

  function fetchTree(id) {
    UI.setState({ modalOpen: true });
    confirm({
      title: 'Unsaved changes will be lost',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to open that?',
      onOk() {
        UI.setState({
          modalOpen: false,
          browserOpen: false
        });
        message.loading('Loading tree..');
        loadTree({
          id,
          onSuccess: (response) => {
            // logger(response);
            unselectAll(response[0].tree);
            store.onRefresh(response[0].tree);
            message.destroy();
          },
          onError: (error) => {
            // console.error(error);
            notification.error({ message: "Cannot load", description: error })
            message.destroy();
          }
        });
      },
      onCancel() {
        UI.setState({ modalOpen: false });
      },
    });
  }

  const myTreeList = myTrees && myTrees.map((item, index) => <Col key={`tree-${index}`} span={6}>
    <Card
      title={item.name}
      bordered={false}
      hoverable={true}
      size="small"
      onClick={() => {
        fetchTree(item.objectId);
      }}
    >
      <Thumbnail tree={item.tree || []} />
    </Card>
  </Col>);

  const exampleList = examples.map((item, index) => <Col key={`example-${index}`} span={6}>
    <Card
      title={item.name}
      bordered={false}
      hoverable={true}
      size="small"
      onClick={() => {
        load(item.data);
      }}
    >
      <Thumbnail tree={item.data || []} />
    </Card>
  </Col>);

  const AddNew = () => {
    return (<Col span={6}>
      <Card
        title="New"
        bordered={false}
        hoverable={true}
        size="small"
        onClick={() => {
          reset();
        }}
      >
        <PlusOutlined className="addNewThumb" />
      </Card>
    </Col>)
  }

  return (
    <Modal
      width={window.innerWidth - 200}
      visible={true}
      closable={true}
      maskClosable={true}
      cancelText='Close'
      okText='Start New'
      className="browser"
      onOk={() => {
        reset();
      }}
      onCancel={() => {
        UI.setState({ browserOpen: false });
      }}
    >
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <TabPane tab="My Trees" key="1">
          <div className="site-card-wrapper">
            <Row gutter={[16, 16]}>
              {<AddNew />}
              {myTrees ? myTreeList : <LoadingOutlined />}
            </Row>
          </div>
        </TabPane>
        <TabPane tab="Examples" key="2">
          <Row gutter={[16, 16]}>
            {exampleList}
          </Row>
        </TabPane>
      </Tabs>
    </Modal>
  );
}
