import React, { Fragment, useContext, useState } from "react";
import PropTypes from "prop-types";
import { UIContext } from '../Store';
import { Tooltip, Dropdown, Menu, Input } from 'antd';
import { EditOutlined, PlusCircleOutlined, FileMarkdownOutlined, FileImageOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

const propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  onUpdate: PropTypes.func,
};

export function Content({
  content,
  editable,
  onUpdate
}) {
  const UI = useContext(UIContext);
  const [editing, setEditing] = useState(false);

  // "[Link](https://url)"

  const handleStartEditing = () => {
    if (!editable) {
      return
    }
    setEditing(true);
    UI.setState({ editingContent: true });
  }

  const handleChange = (e) => {
    const text = e.target.value;
    setEditing(false);
    UI.setState({ editingContent: false });
    onUpdate(text);
  }

  const addMenu = (
    <Menu>
      <Menu.Item
        disabled={content}
        onClick={() => {
          setEditing(true);
        }}
      ><FileMarkdownOutlined />Markdown</Menu.Item>
      <Menu.Item
        disabled={true}
        onClick={() => {
          setEditing(true);
        }}
      ><FileImageOutlined />Background Image</Menu.Item>
      <Menu.Item
        disabled={true}
        onClick={() => {
          setEditing(true);
        }}
      ><FileImageOutlined />Video</Menu.Item>
      <Menu.Item
        disabled={true}
        onClick={() => {
          setEditing(true);
        }}
      ><FileImageOutlined />Music</Menu.Item>
      <Menu.Item
        disabled={true}
        onClick={() => {
          setEditing(true);
        }}
      ><FileImageOutlined />Embed</Menu.Item>
      <Menu.Item
        disabled={true}
        onClick={() => {
          setEditing(true);
        }}
      ><FileImageOutlined />Portal</Menu.Item>
      <Menu.Item
        disabled={true}
        onClick={() => {
          setEditing(true);
        }}
      ><FileImageOutlined />API Call</Menu.Item>
      <Menu.Item
        disabled={true}
        onClick={() => {
          setEditing(true);
        }}
      ><FileImageOutlined />PayPal</Menu.Item>
    </Menu>
  );

  return (
    <div className="node-content">
      {editing ?
        <Fragment>
          <TextArea
            placeholder="Markdown content"
            autoSize 
            autoFocus
            onBlur={handleChange}
            defaultValue={content || ""}
          />
          <p style={{ color: 'rgba(255,255,255,0.5)'}}>Clear all text and leave editing to delete</p>
        </Fragment>
        :
        <Fragment>
          {content &&
            <div className={editable ? "markdown editable" : "markdown"} onClick={handleStartEditing}>
              <ReactMarkdown source={content} />
              {editable && <FileMarkdownOutlined className="edit-icon" />}
            </div>
          }
        </Fragment>
      }
      {editable &&
        <Tooltip title="Add Content" placement="top">
          <Dropdown overlay={addMenu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <PlusCircleOutlined className="add-icon" />
            </a>
          </Dropdown>
        </Tooltip>
      }
    </div>
  );
}

Content.propTypes = propTypes;
export default Content;
