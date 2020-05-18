import React from "react";
import PropTypes from "prop-types";
import { Space, Button, Dropdown, Menu, Tooltip } from 'antd';
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
    <div className="actions">
      <Space>
        <Dropdown disabled={!selectedNode} overlay={menu} placement="topCenter">
          <Tooltip title="Color" placement="left">
            <BgColorsOutlined
              onClick={() => {
                onAction("edit");
              }}
            />
          </Tooltip>
        </Dropdown>
        <Tooltip title="Edit (Enter)" placement="top">
          <EditFilled
            onClick={() => {
              onAction("edit");
            }}
          />
        </Tooltip>
        <Tooltip title="Copy (Cmd-C)" placement="top">
          <CopyOutlined
            style={selectedNode ? {
              opacity: 0.5,
              pointerEvents: 'none'
            } : null}
            onClick={() => {
              onAction("copy");
            }}
          />
        </Tooltip>
        <Tooltip title="Paste (Cmd-V)" placement="top">
          <DiffOutlined
            style={clipboard === null || !selectedNode ? {
              opacity: 0.5,
              pointerEvents: 'none'
            } : null}
            onClick={() => {
              onAction("paste");
            }}
          />
        </Tooltip>
        <Tooltip title="Delete (Backspace)" placement="top">
          <DeleteOutlined
            style={(selectedNode && selectedNode.id === 0) || !selectedNode ? {
              opacity: 0.5,
              pointerEvents: 'none'
            } : null}
            onClick={() => {
              onAction("delete");
            }}
          />
        </Tooltip>
      </Space>
    </div>
  )
}

Inspector.propTypes = propTypes;
export default Inspector;