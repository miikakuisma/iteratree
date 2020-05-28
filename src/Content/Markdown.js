import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input, Menu, Dropdown } from 'antd';
import { SettingFilled } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

const propTypes = {
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

export function Markdown({
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
        <Menu.Item key="1" onClick={() => onCopy(index)}>Copy</Menu.Item>
        <Menu.Item key="2" onClick={() => onPaste(index)}>Paste</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" onClick={() => onMoveUp(index)}>Move Up</Menu.Item>
        <Menu.Item key="4" onClick={() => onMoveDown(index)}>Move Down</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="5"onClick={() => onDelete(index)}>Remove</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  if (editing) {
    return (
      <Fragment>
        <TextArea
          placeholder="Markdown content"
          autoSize 
          autoFocus
          onBlur={onChange}
          defaultValue={content || ""}
          onKeyDown={(e) => {
            if (e.key === "Escape") { onCancel(); }
          }}
        />
        <p style={{ color: 'rgba(255,255,255,0.5)'}}>Clear all text and leave editing to delete</p>
      </Fragment>
    )
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
        <ReactMarkdown source={content} />
        {editable && selected && <Dropdown overlay={menu} className="edit-icon"><SettingFilled /></Dropdown>}
      </div>
    )
  }

  return null;
}

Markdown.propTypes = propTypes;
export default Markdown;
