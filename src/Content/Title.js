import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input, Menu, Dropdown } from 'antd';
import { SettingFilled } from '@ant-design/icons';

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
  onDelete: PropTypes.func
}

export function Title({ index, editing, editable, content, selected, onSelect, onStartEditing, onChange, onCancel, onMoveUp, onMoveDown, onDelete }) {

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Title">
        <Menu.Item key="0" onClick={() => onStartEditing()}>Edit</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1" onClick={() => onMoveUp(index)}>Move Up</Menu.Item>
        <Menu.Item key="2" onClick={() => onMoveDown(index)}>Move Down</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3"onClick={() => onDelete(index)}>Remove</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  if (editing) {
    const { TextArea } = Input;
    return (
      <Fragment>
        <TextArea
          placeholder="Title text"
          autoSize 
          autoFocus
          onBlur={onChange}
          defaultValue={content || ""}
          onKeyDown={(e) => {
            if (e.key === "Escape") { onCancel(); }
          }}
          style={{
            fontWeight: '600',
            fontSize: '38px',
            lineHeight: '1.23',
            textAlign: 'center'
          }}
        />
        <p style={{ color: 'rgba(255,255,255,0.5)'}}>Clear all text and leave editing to delete</p>
      </Fragment>
    )
  }

  if (content) {
    const { TextArea } = Input;

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
        <TextArea
          placeholder="Title text"
          disabled={true}
          autoSize
          value={content || ""}
          style={{
            fontWeight: '600',
            fontSize: '38px',
            lineHeight: '1.23',
            textAlign: 'center',
            background: 'transparent',
            border: 'none',
            resize: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        />
        {editable && selected && <Dropdown overlay={menu} className="edit-icon"><SettingFilled /></Dropdown>}
      </div>
    )
  }

  return null;
}

Title.propTypes = propTypes;
export default Title;
