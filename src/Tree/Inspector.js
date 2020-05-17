import React from "react";
import PropTypes from "prop-types";
import { Drawer, Space, Button, Dropdown, Menu, Tooltip } from 'antd';
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
      className="inspector"
      // title={(selectedNode && selectedNode.title) || ''}
      placement='bottom'
      closable={false}
      height={55}
      mask={false}
      visible={true}
    >
      <div className="actions">
        <Space>
          <Dropdown disabled={!selectedNode} overlay={menu} placement="topCenter">
            <Tooltip title="Color" placement="left">
              <Button
                icon={<BgColorsOutlined />}
                onClick={() => {
                  onAction("edit");
                }}
              ></Button>
              </Tooltip>
          </Dropdown>
          <Tooltip title="Edit (Enter)" placement="top">
            <Button
              type="primary"
              icon={<EditFilled />}
              disabled={!selectedNode}
              onClick={() => {
                onAction("edit");
              }}
            ></Button>
          </Tooltip>
          <Tooltip title="Copy (Cmd-C)" placement="top">
            <Button
              icon={<CopyOutlined />}
              disabled={!selectedNode}
              onClick={() => {
                onAction("copy");
              }}
            ></Button>
          </Tooltip>
          <Tooltip title="Paste (Cmd-V)" placement="top">
            <Button
              icon={<DiffOutlined />}
              disabled={clipboard === null || !selectedNode}
              onClick={() => {
                onAction("paste");
              }}
            ></Button>
          </Tooltip>
          <Tooltip title="Delete (Backspace)" placement="top">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => {
                onAction("delete");
              }}
              disabled={(selectedNode && selectedNode.id === 0) || !selectedNode}
              danger
            ></Button>
          </Tooltip>
        </Space>
      </div>
    </Drawer>
  )
}

Inspector.propTypes = propTypes;
export default Inspector;