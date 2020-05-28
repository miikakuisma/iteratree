import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { TreeContext, UIContext } from '../Store';
import { Tooltip, Dropdown, Menu, message } from 'antd';
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
  const store = useContext(TreeContext);
  const { onAddHistory } = store;

  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [clipboard, setClipboard] = useState(null);

  window.onkeydown = e => {
    if (UI.state.activeUiSection === 'sidebar') {
      switch (e.key) {
        case "c":
          if (!editing && (e.metaKey || e.ctrlKey)) {
            handleCopy();
          }
          break;
        case "v":
          if (!editing && (e.metaKey || e.ctrlKey)) {
            handlePaste();
          }
          break;
        case "ArrowLeft":
          break;
        case "ArrowRight":
          break;
        case "ArrowUp":
          if (!editing) {
            if (e.metaKey || e.ctrlKey) {
              handleMoveUp(selected);
              if (selected > 0) {
                setSelected(parseInt(selected) - 1);
              }
            } else {
              if (selected > 0) {
                setSelected(parseInt(selected) - 1);
              }
            }
          }
          break;
        case "ArrowDown":
          if (!editing) {
            if (e.metaKey || e.ctrlKey) {
              handleMoveDown(selected);
              if (selected < (content.length - 1)) {
                setSelected(parseInt(selected) + 1);
              }
            } else {
              if (selected < (content.length - 1)) {
                setSelected(parseInt(selected) + 1);
              }
            }
          }
          break;
        case "Backspace":
          if (selected && !editing) {
            handleDelete(selected);
          }
          break;
        case "Enter":
          if (selected && !editing) {
            e.preventDefault();  
            handleStartEditing(selected);
          }
          break;
        default:
          break;
      }
    }
  };

  const handleStartEditing = (index) => {
    if (!editable) {
      return
    }
    UI.setState({ editingContent: true });
    setEditing(index);
  }

  function getDefaultContent(type) {
    switch (type) {
      case "title":
        return "title";
      case "photo":
        return "";
      case "background":
        return "";
      case "video":
        return "";
      case "text":
        return ""
    }
  }

  const addElement = (type) => {
    let contentItem = {
      type,
      value: getDefaultContent(type)
    }
    let newContent = content || [];
    newContent.push(contentItem);
    onUpdate(newContent);
    handleStartEditing(newContent.length - 1);
  }

  const handleChange = (e) => {
    const value = e.target.value;
    let newContent = content;
    if (value === "") {
      onAddHistory();
      newContent.splice(editing, 1);
    } else {
      onAddHistory();
      newContent[editing].value = value;
    }
    onUpdate(newContent);
    UI.setState({ editingContent: false });
    setEditing(null);
  }

  const handleDelete = (index) => {
    onAddHistory();
    let newContent = content;
    newContent.splice(index, 1);
    onUpdate(newContent);
    UI.setState({ editingContent: false });
    setEditing(null);
  }

  const handleMoveUp = (index) => {
    onAddHistory();
    let newContent = content;
    arrayMove(newContent, index, index - 1);
    onUpdate(newContent);
  }

  const handleMoveDown = (index) => {
    onAddHistory();
    let newContent = content;
    if (newContent.length > index + 1) {
      arrayMove(newContent, index, index + 1);
      onUpdate(newContent);      
    }
  }

  const handleCopy = () => {
    setClipboard(content[selected]);
    message.info(`Content copied to clipboard`);
  }

  const handlePaste = () => {
    onAddHistory();
    let pastedItem = clipboard;
    let newContent = content || [];
    newContent.push(pastedItem);
    onUpdate(newContent);
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
        onCopy={handleCopy}
        onPaste={handlePaste}
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
        onCopy={handleCopy}
        onPaste={handlePaste}
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
        onCopy={handleCopy}
        onPaste={handlePaste}
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
        onCopy={handleCopy}
        onPaste={handlePaste}
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
