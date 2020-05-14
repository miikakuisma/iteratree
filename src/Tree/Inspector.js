import React from "react";
import PropTypes from "prop-types";
import { Drawer, Space, Button, Dropdown, Menu } from 'antd';
import { BgColorsOutlined, EditFilled, CopyOutlined, DiffOutlined, DeleteOutlined } from '@ant-design/icons';
import { palette } from '../lib/colors';

const propTypes = {
  selectedNode: PropTypes.object,
  clipboard: PropTypes.object,
  onAction: PropTypes.func,
};

function Inspector({ selectedNode, clipboard, onAction }) {

  const handleSelectColor = (item) => {
    onAction("changeColor", item);
  }

  const colorItems = palette.map((item, index) =>
    <Menu.Item key={index} onClick={() => {
      handleSelectColor(item);
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            backgroundColor: item.background,
            width: '16px',
            height: '16px',
            float: 'left',
            marginRight: '5px',
            border: item.color && '1px solid #ccc'
          }}
        />
        {item.name}
      </div>
    </Menu.Item>
  );

  const menu = (
    <Menu>
      {colorItems}
    </Menu>
  );

  return(
    <Drawer
      title={(selectedNode && selectedNode.title) || ''}
      placement='bottom'
      closable={false}
      height={55}
      mask={false}
      visible={true}
    >
      <div className="actions">
        <Space>
          <Dropdown disabled={!selectedNode} overlay={menu} placement="topCenter">
            <Button
              icon={<BgColorsOutlined />}
              onClick={() => {
                onAction("edit");
              }}
            >Color</Button>
          </Dropdown>
          <Button
            type="primary"
            icon={<EditFilled />}
            disabled={!selectedNode}
            onClick={() => {
              onAction("edit");
            }}
          >Edit</Button>
          <Button
            icon={<CopyOutlined />}
            disabled={!selectedNode}
            onClick={() => {
              onAction("copy");
            }}
          >Copy</Button>
          <Button
            icon={<DiffOutlined />}
            disabled={clipboard === null || !selectedNode}
            onClick={() => {
              onAction("paste");
            }}
          >Paste</Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              onAction("delete");
            }}
            disabled={(selectedNode && selectedNode.id === 0) || !selectedNode}
            danger
          >Delete</Button>
        </Space>
      </div>
    </Drawer>
  )
}

Inspector.propTypes = propTypes;
export default Inspector;