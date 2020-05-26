import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input, Menu, Dropdown } from 'antd';
import { SettingFilled } from '@ant-design/icons';
import Library from "../Library";

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
  onDelete: PropTypes.func
}

export function Background({ index, editing, editable, content, selected, onSelect, onStartEditing, onChange, onCancel, onDelete }) {

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Background Image">
        <Menu.Item key="0" onClick={() => onStartEditing()}>Replace</Menu.Item>
        <Menu.Divider />
        {/* <Menu.Item key="1" onClick={() => onMoveUp(index)}>Move Up</Menu.Item>
        <Menu.Item key="2" onClick={() => onMoveDown(index)}>Move Down</Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key="3"onClick={() => onDelete(index)}>Remove</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  if (editing) {
    return (
      <Library
        selected={content}
        onCancel={onCancel}
        onSelect={(id) => {
          onChange({
            target: { value: id }
          });
        }}
      />
    )
  }

  if (editing) {
    return (
      <Fragment>
        <Input
          placeholder="Image URL"
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
        style={{
          position: 'relative',
          color: '#949393',
          paddingTop: '3px'
        }}
      >
        {editable && selected && <Dropdown overlay={menu} className="edit-icon"><SettingFilled /></Dropdown>}
      </div>
    )
  }

  return null;
}

Background.propTypes = propTypes;
export default Background;
