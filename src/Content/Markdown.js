import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input } from 'antd';
import ReactMarkdown from 'react-markdown';
const { TextArea } = Input;

const propTypes = {
  editing: PropTypes.bool,
  content: PropTypes.string,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
}

export function Markdown({ editing, content, onChange, onCancel }) {

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
      <ReactMarkdown source={content} />
    )
  }

  return null;
}

Markdown.propTypes = propTypes;
export default Markdown;
