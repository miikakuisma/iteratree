import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input, Menu, Dropdown } from 'antd';
import { SettingFilled } from '@ant-design/icons';

const propTypes = {
  index: PropTypes.number,
  editing: PropTypes.bool,
  editable: PropTypes.bool,
  content: PropTypes.string,
  onStartEditing: PropTypes.func,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func
}

export function Photo({ index, editing, editable, content, onStartEditing, onChange, onCancel, onDelete, onMoveUp, onMoveDown }) {

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Photo">
        <Menu.Item key="1" onClick={() => onMoveUp(index)}>Move Up</Menu.Item>
        <Menu.Item key="2" onClick={() => onMoveDown(index)}>Move Down</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3"onClick={() => onDelete(index)}>Remove</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

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
        className={editable ? "the-content editable" : "the-content"}
        onClick={(e) => {
          if (!e.target.classList.contains("ant-dropdown-menu-item")) {
            onStartEditing();
          }
        }}
        style={{
          position: 'relative',
          color: '#949393',
          paddingTop: '3px'
        }}
      >
        <div className="photo"><img src={content} /></div>
        {editable && <Dropdown overlay={menu} className="edit-icon"><SettingFilled /></Dropdown>}
      </div>
    )
  }

  return null;
}

Photo.propTypes = propTypes;
export default Photo;
