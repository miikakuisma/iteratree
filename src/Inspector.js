import React from "react";
import PropTypes from "prop-types";
import { Drawer, Space, Button, Layout, Row, Col, Typography, List } from 'antd';
import { EditFilled, CopyOutlined, DiffOutlined, DeleteOutlined } from '@ant-design/icons';

const propTypes = {
  selectedNode: PropTypes.object,
  clipboard: PropTypes.object,
  onAction: PropTypes.func,
};

const { Content } = Layout;
const { Text } = Typography;

function Inspector({ selectedNode, clipboard, onAction }) {

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
      title: 'Left / Right',
      description: 'Select next node from left or right'
    },
    {
      title: 'Cmd + Left / Right',
      description: 'Move selected node left or right'
    },
    {
      title: 'Enter',
      description: 'Rename node'
    },
    {
      title: 'Backspace',
      description: 'Delete node'
    },
    {
      title: 'Tab',
      description: 'Insert another child node under same parent'
    },
  ];

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
        {/* <Row gutter={8}>
          <Col span={8}>

          </Col>
          <Col span={8}>
            
            
          </Col>
          <Col span={8}>
            
          </Col>
        </Row> */}
        <Text>Keyboard shortcuts</Text>
        <List
          // itemLayout="horizontal"
          grid={{ gutter: 8, column: 6 }}
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