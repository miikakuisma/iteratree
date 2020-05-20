import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input, Tooltip } from 'antd';
import { FileMarkdownOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

const propTypes = {
  editing: PropTypes.bool,
  editable: PropTypes.bool,
  content: PropTypes.string,
  onStartEditing: PropTypes.func,
  onChange: PropTypes.func
}

export function Markdown({ editing, editable, content, onStartEditing, onChange }) {

  if (editing) {
    return (
      <Fragment>
        <TextArea
          placeholder="Markdown content"
          autoSize 
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
      >
        <ReactMarkdown source={content.value} />
        {editable &&
          <Tooltip title="Text (markdown)" placement="left">
            <FileMarkdownOutlined className="edit-icon" />
          </Tooltip>
        }
      </div>
    )
  }

  return null;
}

Markdown.propTypes = propTypes;
export default Markdown;
