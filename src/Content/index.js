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

  const handleStartEditing = (index) => {
    if (!editable) {
      return
    }
    UI.setState({ editingContent: true });
    setEditing(index);
  }

  const addElement = (type) => {
    let contentItem = {
      type,
      value: ""
    }
    let newContent = content || [];
    newContent.push(contentItem)
    onUpdate(newContent);
    setEditing(newContent.length - 1);
  }

  const handleChange = (e) => {
    const value = e.target.value;
    UI.setState({ editingContent: false });
    let newContent = content;
    if (value === "") {
      newContent.splice(editing, 1);
    } else {
      newContent[editing].value = value;
    }
    onUpdate(newContent);
    setEditing(null);
  }

  console.log(content)

  const addMenu = (
    <Menu>
      <Menu.Item
        disabled={content && content.length > 0 && content.find(c => c.type === 'background')}
        onClick={() => {
          addElement('background');
        }}
      ><FileImageOutlined />Background</Menu.Item>
      <Menu.Item
        disabled={false}
        onClick={() => {
          addElement('video');
        }}
      ><YoutubeOutlined />Video</Menu.Item>
      <Menu.Item
        disabled={false}
        onClick={() => {
          addElement('markdown');
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

  const contentList = content && content.length > 0 && content.map((contentItem, index) => {
    if (contentItem.type === 'background') {
      return <Background
        editing={editing === index}
        editable={editable}
        content={contentItem}
        onStartEditing={() => handleStartEditing(index)}
        onChange={handleChange}
      />
    }
    if (contentItem.type === 'video') {
      return <Video
        editing={editing === index}
        editable={editable}
        content={contentItem}
        onStartEditing={() => handleStartEditing(index)}
        onChange={handleChange}
      />
    }
    if (contentItem.type === 'markdown') {
      return <Markdown
        editing={editing === index}
        editable={editable}
        content={contentItem}
        onStartEditing={() => handleStartEditing(index)}
        onChange={handleChange}
      />
    }
  });

  return (
    <div className="node-content">
      {contentList}
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
