import React from "react";
import PropTypes from "prop-types";
import { Space, Dropdown, Menu, Tooltip } from 'antd';
import { BgColorsOutlined, EditFilled, CopyOutlined, DiffOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { palette } from '../lib/colors';

const propTypes = {
  selectedNode: PropTypes.object,
  clipboard: PropTypes.object,
  sidebarOpen: PropTypes.bool,
  onAction: PropTypes.func,
  onUndo: PropTypes.func
};

function Toolbar({ selectedNode, clipboard, sidebarOpen, onAction, onUndo }) {

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
    <div
      className="actions"
      style={{
        right: sidebarOpen ? '376px' : '0px'
      }}
    >
      <Tooltip title="Undo" placement="top">
        <UndoOutlined
          style={{
            position: 'fixed',
            left: '20px' // calc(50% - 30px)
          }}
          onClick={() => {
            onUndo();
          }}
        />
      </Tooltip>
      <Space>
        <Dropdown disabled={!selectedNode} overlay={menu} placement="topCenter">
          {selectedNode ? <Tooltip title="Color" placement="left">
            <BgColorsOutlined
              onClick={() => {
                onAction("edit");
              }}
            />
          </Tooltip> : <BgColorsOutlined style={{ pointerEvents: 'none' }} />}
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
            style={!selectedNode ? {
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

Toolbar.propTypes = propTypes;
export default Toolbar;