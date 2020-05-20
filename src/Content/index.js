import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { UIContext } from '../Store';
import Unsplash, { toJson } from 'unsplash-js';
import { Tooltip, Dropdown, Menu } from 'antd';
import {
  PlusCircleOutlined,
  FileMarkdownOutlined,
  FileImageOutlined,
  YoutubeOutlined,
  CommentOutlined,
  CodeOutlined,
  ApiOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import Video from './Video';
import Markdown from "./Markdown";
import Background from "./Background";

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

  const unsplash = new Unsplash({ accessKey: "BwmlWZDZ9rebOdV8o5UWOgzmtWVARTMYOW2mQlFxdVw" });

  const handleSearch = () => {
    unsplash.search.photos("dogs", 1, 10, { orientation: "portrait" })
    .then(toJson)
    .then(json => {
      console.log(json);
    });  
  }

  const handleStartEditing = (type) => {
    if (!editable) {
      return
    }
    UI.setState({ editingContent: true });
    setEditing(type);
  }

  const handleChange = (e) => {
    const value = e.target.value;
    UI.setState({ editingContent: false });
    setEditing(null);
    onUpdate({
      ...content,
      [editing]: value
    });
  }

  const addMenu = (
    <Menu>
      <Menu.Item
        disabled={content && content.background}
        onClick={() => {
          setEditing('background');
        }}
      ><FileImageOutlined />Background</Menu.Item>
      <Menu.Item
        disabled={content && content.video}
        onClick={() => {
          handleStartEditing('video');
        }}
      ><YoutubeOutlined />Video</Menu.Item>
      <Menu.Item
        disabled={content && content.markdown}
        onClick={() => {
          handleStartEditing('markdown');
        }}
      ><FileMarkdownOutlined />Text (markdown)</Menu.Item>
      <Menu.ItemGroup title="Coming up">
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
      <Background
        editing={editing === 'background'}
        editable={editable}
        content={content && content.background}
        onStartEditing={handleStartEditing}
        onChange={handleChange}
      />
      <Video
        editing={editing === 'video'}
        editable={editable}
        content={content && content.video}
        onStartEditing={handleStartEditing}
        onChange={handleChange}
      />
      <Markdown
        editing={editing === 'markdown'}
        editable={editable}
        content={content && content.markdown}
        onStartEditing={handleStartEditing}
        onChange={handleChange}
      />
      {/* <button onClick={handleSearch}>Search</button> */}
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
