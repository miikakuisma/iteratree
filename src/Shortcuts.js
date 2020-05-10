import React from "react";
import { UIContext } from './Store';
import { Modal, List } from 'antd';

import "./styles.css";

export default function Shortcuts() {
  const UI = React.useContext(UIContext);

  const shortcuts = [
    {
      title: 'Up',
      description: 'Select parent node'
    },
    {
      title: 'Down',
      description: 'Add new child node'
    },
    {
      title: 'Tab',
      description: 'Add new node under same parent'
    },
    {
      title: 'Enter',
      description: 'Rename node'
    },
    {
      title: 'Left / Right',
      description: 'Select next node from left or right'
    },
    {
      title: 'Cmd + Left / Right',
      description: 'Move selected node left or right'
    },
    {
      title: 'Backspace',
      description: 'Delete node'
    },
  ];

  return (
    <Modal
      title="Keyboard Shortcuts"
      visible={true}
      closable={false}
      cancelButtonProps={{ disabled: true }}
      onOk={() => { UI.setState({ shortcuts: false }) }}
    >
      <List
        // itemLayout="horizontal"
        grid={{ gutter: 8, column: 2 }}
        dataSource={shortcuts}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
}
