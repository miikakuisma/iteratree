import React, { useContext, useEffect } from "react";
import { TreeContext, UIContext } from '../Store';
import { Modal, Tabs, message, notification, Card, Col, Row, Popconfirm } from 'antd';
import { ExclamationCircleOutlined, LoadingOutlined, PlusOutlined, CloseCircleFilled } from '@ant-design/icons';
import { loadTree, getMyTrees, deleteTree } from "../lib/parse";
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

  const refreshList = () => {
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
  }

  useEffect(() => {
    refreshList();
  }, [])

  function handleTabChange(key) {
    window.localStorage.setItem('lastBrowserTab', key);
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
          tree[0].selected = true;
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
        unselectAll();
        UI.setState({
          modalOpen: false,
          browserOpen: false
        });
        message.loading('Loading tree..');
        loadTree({
          id,
          onSuccess: (response) => {
            // logger(response);
            response[0].tree[0].selected = true;
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

  // SAME AS IN TREENAME (REFACTOR??)
  function handleDeleteTree(id) {
    const { confirm } = Modal;

    UI.setState({ modalOpen: true });
    confirm({
      title: 'Delete this tree?',
      icon: <ExclamationCircleOutlined />,
      content: 'There is no way to undo',
      onOk() {
        UI.setState({ modalOpen: false });
        message.loading('Deleting tree..');
        deleteTree({
          id,
          onSuccess: (response) => {
            notification.success({ message: response });
            refreshList();
            message.destroy();
            if (store.tree[0].root.id === id) {
              window.localStorage.removeItem('tree');
              window.location.reload();
            }
          },
          onError: (response) => {
            notification.error({ message: "Cannot delete", description: response });
            message.destroy();
            // logger('ERROR', response);
          }
        })
      },
      onCancel() {
        UI.setState({ modalOpen: false });
      },
    });
  }

  const myTreeList = myTrees && myTrees.map((item, index) => <Col key={`tree-${index}`} span={4}>
    <Card
      title={item.name}
      bordered={false}
      hoverable={true}
      className={store.tree[0].root.id === item.objectId && "selected"}
      size="small"
      onClick={(e) => {
        if (!e.target.classList.contains("ant-card-body")) {
          return
        }
        fetchTree(item.objectId);
      }}
    >
      <Thumbnail tree={item.tree || []} />
      <Popconfirm
        title="Delete this file from the server?"
        onConfirm={() => {
          handleDeleteTree(item.objectId);
        }}
        okText="Yes"
        cancelText="No"
      >
        <CloseCircleFilled className="delete-button" />
      </Popconfirm>
    </Card>
  </Col>);

  const exampleList = examples.map((item, index) => <Col key={`example-${index}`} span={4}>
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
    return (<Col span={4}>
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
      width={window.innerWidth - 40}
      visible={true}
      closable={true}
      maskClosable={true}
      cancelText='Cancel'
      okText='Start New'
      className="browser"
      onOk={() => {
        reset();
      }}
      onCancel={() => {
        UI.setState({ browserOpen: false });
      }}
    >
      <Tabs
        defaultActiveKey={window.localStorage.getItem('lastBrowserTab') || "1"}
        onChange={handleTabChange}
      >
        <TabPane tab="Examples" key="1">
          <div className="site-card-wrapper">
            <Row gutter={[16, 16]}>
              {exampleList}
            </Row>
          </div>
        </TabPane>
        <TabPane tab="My Trees" key="2">
          <div className="site-card-wrapper">
            <Row gutter={[16, 16]}>
              {<AddNew />}
              {myTrees ? myTreeList : <LoadingOutlined />}
            </Row>
          </div>
        </TabPane>
        <TabPane tab="Templates (Coming soon)" key="3" disabled={true}>
          <div className="site-card-wrapper">
            <Row gutter={[16, 16]}>

            </Row>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
}
