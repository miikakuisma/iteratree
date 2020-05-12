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

  const handleSelectColor = (color) => {
    onAction("changeColor", color);
  }

  const colorItems = palette.map((item, index) =>
    <Menu.Item key={index} onClick={() => {
      handleSelectColor(item.color);
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            backgroundColor: item.color,
            width: '16px',
            height: '16px',
            float: 'left',
            marginRight: '5px',
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
      title={selectedNode.title || 'Untitled'}
      placement='bottom'
      closable={false}
      height={55}
      mask={false}
      visible={selectedNode !== null}
    >
      
      <div className="actions">
        <Space>
          <Dropdown overlay={menu} placement="topCenter">
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