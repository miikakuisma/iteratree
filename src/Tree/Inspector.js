import React from "react";
import PropTypes from "prop-types";
import { Drawer, Space, Button, Layout } from 'antd';
import { EditFilled, CopyOutlined, DiffOutlined, DeleteOutlined } from '@ant-design/icons';

const propTypes = {
  selectedNode: PropTypes.object,
  clipboard: PropTypes.object,
  onAction: PropTypes.func,
};

const { Content } = Layout;

function Inspector({ selectedNode, clipboard, onAction }) {

  return(
    <Drawer
      title={selectedNode.title || 'Untitled'}
      placement='bottom'
      closable={false}
      height={55}
      mask={false}
      visible={selectedNode !== null}
    >
      <Content>
      </Content>
      <div className="actions">
        <Space>
          <Button
            type="primary"
            icon={<EditFilled />}
            onClick={() => {
              onAction("edit");
            }}
          >Edit</Button>
          <Button
            icon={<CopyOutlined />}
            onClick={() => {
              onAction("copy");
            }}
          >Copy</Button>
          <Button
            icon={<DiffOutlined />}
            disabled={clipboard === null}
            onClick={() => {
              onAction("paste");
            }}
          >Paste</Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              onAction("delete");
            }}
            disabled={selectedNode.id === 0}
            danger
          >Delete</Button>
        </Space>
      </div>
    </Drawer>
  )
}

Inspector.propTypes = propTypes;
export default Inspector;