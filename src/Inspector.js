import React from "react";
import PropTypes from "prop-types";
import { Drawer, Space, Button, Layout, Row, Col, Typography } from 'antd';
import { EditFilled, CopyOutlined, DiffOutlined, DeleteOutlined } from '@ant-design/icons';

const propTypes = {
  selectedNode: PropTypes.object,
  clipboard: PropTypes.object,
  onAction: PropTypes.func,
};

const { Content } = Layout;
const { Title } = Typography;

function Inspector({ selectedNode, clipboard, onAction }) {

  return(
    <Drawer
      title={selectedNode.title}
      placement='bottom'
      closable={false}
      height={58}
      mask={false}
      visible={selectedNode !== null}
    >
      <Content>
        <Row gutter={8}>
          <Col span={8}>
            <Title level={1}>Text</Title>
          </Col>
          <Col span={8}>Yo</Col>
          <Col span={8}>Yo</Col>
        </Row>
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
            danger
          >Delete</Button>
        </Space>
      </div>
    </Drawer>
  )
}

Inspector.propTypes = propTypes;
export default Inspector;