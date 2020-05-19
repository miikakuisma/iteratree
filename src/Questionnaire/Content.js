import React, { Fragment, useContext, useState } from "react";
import PropTypes from "prop-types";
import { UIContext } from '../Store';
import { Tooltip, Dropdown, Menu, Input } from 'antd';
import {
  EditOutlined,
  PlusCircleOutlined,
  FileMarkdownOutlined,
  FileImageOutlined,
  YoutubeOutlined,
  CommentOutlined,
  CodeOutlined,
  ApiOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

const propTypes = {
  content: PropTypes.object,
  editable: PropTypes.bool,
  onUpdate: PropTypes.func,
};

export function Content({
  content,
  editable,
  onUpdate
}) {
  const UI = useContext(UIContext);
  const [editing, setEditing] = useState(null);

  // "[Link](https://url)"

  const handleStartEditing = (type) => {
    if (!editable) {
      return
    }
    UI.setState({ editingContent: true });
    setEditing(type);
  }

  const handleChange = (e) => {
    const text = e.target.value;
    UI.setState({ editingContent: false });
    setEditing(null);
    onUpdate({
      ...content,
      markdown: text
    });
  }

  const addMenu = (
    <Menu>
      <Menu.Item
        disabled={content && content.markdown}
        onClick={() => {
          handleStartEditing('markdown');
        }}
      ><FileMarkdownOutlined />Markdown</Menu.Item>
      <Menu.ItemGroup title="Coming up">
        <Menu.Item
          disabled={true}
          onClick={() => {
            setEditing('background');
          }}
        ><FileImageOutlined />Background</Menu.Item>
        <Menu.Item
          disabled={true}
          onClick={() => {

          }}
        ><YoutubeOutlined />Video</Menu.Item>
        <Menu.Item
          disabled={true}
          onClick={() => {

          }}
        ><CommentOutlined />Message</Menu.Item>
        <Menu.Item
          disabled={true}
          onClick={() => {

          }}
        ><CodeOutlined />Embed</Menu.Item>
        <Menu.Item
          disabled={true}
          onClick={() => {
            
          }}
        ><ApiOutlined />API Call</Menu.Item>
        <Menu.Item
          disabled={true}
          onClick={() => {
            
          }}
        ><CreditCardOutlined />Buy button</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <div className="node-content">
      {editing === 'markdown' ?
        <Fragment>
          <TextArea
            placeholder="Markdown content"
            autoSize 
            autoFocus
            onBlur={handleChange}
            defaultValue={(content && content.markdown) || ""}
          />
          <p style={{ color: 'rgba(255,255,255,0.5)'}}>Clear all text and leave editing to delete</p>
        </Fragment>
        :
        <Fragment>
          {content && content.markdown &&
            <div
              className={editable ? "markdown editable" : "markdown"}
              onClick={() => handleStartEditing('markdown')}
            >
              <ReactMarkdown source={content.markdown} />
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
