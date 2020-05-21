import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input, Tooltip } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

const propTypes = {
  editing: PropTypes.bool,
  editable: PropTypes.bool,
  content: PropTypes.string,
  onStartEditing: PropTypes.func,
  onChange: PropTypes.func,
  onCancel: PropTypes.func
}

export function Title({ editing, editable, content, onStartEditing, onChange, onCancel }) {

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
        className={editable ? "the-content editable" : "the-content"}
        onClick={onStartEditing}
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

Title.propTypes = propTypes;
export default Title;
