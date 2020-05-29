import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input } from 'antd';
const { TextArea } = Input;

const propTypes = {
  editing: PropTypes.bool,
  content: PropTypes.string,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
}

export function Title({ editing, content, onChange, onCancel }) {

  if (editing) {
    const { TextArea } = Input;
    return (
      <Fragment>
        <TextArea
          placeholder="Title text"
          autoSize 
          autoFocus
          onBlur={onChange}
          defaultValue={content === "title" ? "" : content}
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

    return (    
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
    )
  }

  return null;
}

Title.propTypes = propTypes;
export default Title;
