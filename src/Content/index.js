import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { UIContext } from '../Store';
import { Tooltip, Dropdown, Menu } from 'antd';
import {
  PlusCircleOutlined,
  FileMarkdownOutlined,
  FileImageOutlined,
  YoutubeOutlined,
  CommentOutlined,
  CodeOutlined,
  ApiOutlined,
  CreditCardOutlined,
  PhoneOutlined,
  FilePdfOutlined,
  ContactsOutlined,
  SmileOutlined
} from '@ant-design/icons';
import Title from './Title';
import Video from './Video';
import Markdown from "./Markdown";
import Background from "./Background";
import Photo from "./Photo";
import { arrayMove } from '../lib/helpers';

const propTypes = {
  content: PropTypes.array,
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
  const [selected, setSelected] = useState(null);

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
    handleStartEditing(newContent.length - 1);
  }

  const handleChange = (e) => {
    const value = e.target.value;
    let newContent = content;
    if (value === "") {
      newContent.splice(editing, 1);
    } else {
      newContent[editing].value = value;
    }
    onUpdate(newContent);
    UI.setState({ editingContent: false });
    setEditing(null);
  }

  const handleDelete = (index) => {
    let newContent = content;
    newContent.splice(index, 1);
    onUpdate(newContent);
    UI.setState({ editingContent: false });
    setEditing(null);
  }

  const handleMoveUp = (index) => {
    let newContent = content;
    arrayMove(newContent, index, index - 1);
    onUpdate(newContent);
  }

  const handleMoveDown = (index) => {
    let newContent = content;
    if (newContent.length > index + 1) {
      arrayMove(newContent, index, index + 1);
      onUpdate(newContent);      
    }
  }

  const addMenu = (
    <Menu>
      <Menu.Item
        disabled={false}
        onClick={() => {
          addElement('title');
        }}
      ><FileImageOutlined />Title</Menu.Item>
      <Menu.Item
        disabled={false}
        onClick={() => {
          addElement('photo');
        }}
      ><FileImageOutlined />Photo</Menu.Item>
      <Menu.Item
        disabled={content && content.length > 0 && content.find(c => c.type === 'background')}
        onClick={() => {
          addElement('background');
        }}
      ><FileImageOutlined />Background Image</Menu.Item>
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
        ><PhoneOutlined />Phone Call button</Menu.Item>
        <Menu.Item
          disabled={true}
          onClick={() => {

          }}
        ><FilePdfOutlined />PDF document</Menu.Item>
        <Menu.Item
          disabled={true}
          onClick={() => {

          }}
        ><ContactsOutlined />vCard</Menu.Item>
        <Menu.Item
          disabled={true}
          onClick={() => {

          }}
        ><SmileOutlined />Stickers</Menu.Item>
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
    if (contentItem.type === 'title') {
      return <Title
        key={`content-${index}`}
        index={index}
        editing={editing === index}
        editable={editable}
        content={contentItem.value}
        selected={selected === index}
        onSelect={() => setSelected(index)}
        onStartEditing={() => handleStartEditing(index)}
        onChange={handleChange}
        onCancel={() => setEditing(null)}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onDelete={handleDelete}
      />
    }
    if (contentItem.type === 'photo') {
      return <Photo
        key={`content-${index}`}
        index={index}
        editing={editing === index}
        editable={editable}
        content={contentItem.value}
        selected={selected === index}
        onSelect={() => setSelected(index)}
        onStartEditing={() => handleStartEditing(index)}
        onChange={handleChange}
        onCancel={() => setEditing(null)}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onDelete={handleDelete}
      />
    }
    if (contentItem.type === 'background') {
      return <Background
        key={`content-${index}`}
        index={index}
        editing={editing === index}
        editable={editable}
        content={contentItem.value}
        selected={selected === index}
        onSelect={() => setSelected(index)}
        onStartEditing={() => handleStartEditing(index)}
        onChange={handleChange}
        onCancel={() => setEditing(null)}
        onDelete={handleDelete}
      />
    }
    if (contentItem.type === 'video') {
      return <Video
        key={`content-${index}`}
        index={index}
        editing={editing === index}
        editable={editable}
        content={contentItem.value}
        selected={selected === index}
        onSelect={() => setSelected(index)}
        onStartEditing={() => handleStartEditing(index)}
        onChange={handleChange}
        onCancel={() => setEditing(null)}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onDelete={handleDelete}
      />
    }
    if (contentItem.type === 'markdown') {
      return <Markdown
        key={`content-${index}`}
        index={index}
        editing={editing === index}
        editable={editable}
        content={contentItem.value}
        selected={selected === index}
        onSelect={() => setSelected(index)}
        onStartEditing={() => handleStartEditing(index)}
        onChange={handleChange}
        onCancel={() => setEditing(null)}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onDelete={handleDelete}
      />
    }
  });

  return (
    <div className="node-content" onClick={(e) => {
      if(e.target.classList.contains("node-content")) {
        setSelected(null);
      }
    }}>
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
