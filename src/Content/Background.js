import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input, Tooltip } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

const propTypes = {
  editing: PropTypes.bool,
  editable: PropTypes.bool,
  content: PropTypes.string,
  onStartEditing: PropTypes.func,
  onChange: PropTypes.func
}

export function Background({ editing, editable, content, onStartEditing, onChange }) {

  if (editing) {
    return (
      <Fragment>
        <Input
          placeholder="Image URL"
          autoFocus
          onBlur={onChange}
          defaultValue={content.value || ""}
        />
        <p style={{ color: 'rgba(255,255,255,0.5)'}}>Clear all text and leave editing to delete</p>
      </Fragment>
    )
  }

  if (content) {
    return (    
      <div
        className={editable ? "the-content editable" : "the-content"}
        onClick={onStartEditing}
        style={{
          height: '30px',
          position: 'relative',
          color: '#949393',
          paddingTop: '3px'
        }}
      >
        <div className="background-" />
        {editable &&
          <Tooltip title="Background Image" placement="left">
            <FileImageOutlined className="edit-icon" />
          </Tooltip>
        }
      </div>
    )
  }

  return null;
}

Background.propTypes = propTypes;
export default Background;
