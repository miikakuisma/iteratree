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

export function Video({ index, editing, editable, content, selected, onSelect, onStartEditing, onChange, onCancel, onMoveUp, onMoveDown, onDelete }) {
  const isYoutube = content && content.includes('youtube.com');
  const isVimeo = content && content.includes('vimeo.com');

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Video">
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
    return (
      <Fragment>
        <Input
          placeholder="YouTube or Vimeo URL"
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
        {isYoutube && <iframe
          src={content.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')}
          frameBorder='0'
          allow='autoplay; encrypted-media'
          allowFullScreen
          title='video'
        />}
        {isVimeo && <iframe
          src={content.replace('https://vimeo.com/', 'https://player.vimeo.com/video/')}
          frameBorder='0'
          allow="autoplay; fullscreen"
          allowFullScreen
          title='video'
        />}
        {editable && selected && <Dropdown overlay={menu} className="edit-icon"><SettingFilled /></Dropdown>}
      </div>
    )
  }

  return null;
}

Video.propTypes = propTypes;
export default Video;
