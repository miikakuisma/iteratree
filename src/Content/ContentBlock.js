import React from "react";
import PropTypes from "prop-types";
import { Menu, Dropdown } from 'antd';
import { SettingFilled } from '@ant-design/icons';
import Title from "./Title";
import Photo from "./Photo";
import Markdown from "./Markdown";
import Video from "./Video";
import Background from "./Background";

const propTypes = {
  type: PropTypes.string,
  index: PropTypes.number,
  editing: PropTypes.bool,
  editable: PropTypes.bool,
  content: PropTypes.string,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onStartEditing: PropTypes.func,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func,
  onDelete: PropTypes.func,
  onCopy: PropTypes.func,
  onPaste: PropTypes.func
}

export function ContentBlock({
  type,
  index,
  editing,
  editable,
  content,
  selected,
  onSelect,
  onStartEditing,
  onChange,
  onCancel,
  onMoveUp,
  onMoveDown,
  onDelete,
  onCopy,
  onPaste
}) {

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Text">
        <Menu.Item key="0" onClick={() => onStartEditing()}>Edit</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1" disabled={type === "background"} onClick={() => onCopy(index)}>Copy</Menu.Item>
        <Menu.Item key="2" disabled={type === "background"} onClick={() => onPaste(index)}>Paste</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" disabled={type === "background"} onClick={() => onMoveUp(index)}>Move Up</Menu.Item>
        <Menu.Item key="4" disabled={type === "background"} onClick={() => onMoveDown(index)}>Move Down</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="5"onClick={() => onDelete(index)}>Remove</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  const decideEditComponent = () => {
    switch (type) {
      case "title":
        return <Title editing={true} content={content} onChange={onChange} onCancel={onCancel} />
      case "photo":
        return <Photo editing={true} content={content} index={index} onChange={onChange} onCancel={onCancel} onDelete={onDelete} />
      case "markdown":
        return <Markdown editing={true} content={content} onChange={onChange} onCancel={onCancel} />
      case "video":
        return <Video editing={true} content={content} onChange={onChange} onCancel={onCancel} />
      case "background":
        return <Background editing={true} content={content} onChange={onChange} onCancel={onCancel} />
      default:
      }
  }

  const decideViewComponent = () => {
    switch (type) {
      case "title":
        return <Title editing={false} content={content} />
      case "photo":
        return <Photo editing={false} content={content} />
      case "markdown":
        return <Markdown editing={false} content={content} />
      case "video":
        return <Video editing={false} content={content} />
      case "background":
        return <Background editing={false} content={content} />
      default:
    }
  }

  if (editing) {
    return decideEditComponent()
  }

  if (content) {
    return (
      <div
        className={editable ? ( selected ? "the-content selected" : "the-content editable") : "the-content"}
        onClick={(e) => {
          if (!e.target.classList.contains("ant-dropdown-menu-item")) {
            if (!selected) {
              onSelect();
            } else {
              onStartEditing();
            }
          }
        }}
      >
        {decideViewComponent()}
        {editable && selected && <Dropdown overlay={menu} className="edit-icon"><SettingFilled /></Dropdown>}
      </div>
    )
  }

  return null;
}

ContentBlock.propTypes = propTypes;
export default ContentBlock;
