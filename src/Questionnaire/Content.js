import React, { Fragment, useContext, useState } from "react";
import PropTypes from "prop-types";
import { UIContext } from '../Store';
import { Tooltip } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown'

const propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  onUpdate: PropTypes.func,
};

export function Content({
  content,
  editable,
  onUpdate
}) {
  const UI = useContext(UIContext);
  const [editing, setEditing] = useState(false);
  const hasContent = content !== undefined;

  // "[Link](https://url)"

  const handleStartEditing = () => {
    if (!editable) {
      return
    }
    setEditing(true);
    UI.setState({ editingContent: true });
  }

  const handleChange = (e) => {
    const text = e.target.value;
    setEditing(false);
    UI.setState({ editingContent: false });
    onUpdate(text);
  }

  return (
    <div className="node-content">
      {editing ?
        <textarea
          autoFocus
          rows="4"
          onBlur={handleChange}
          defaultValue={content || ""}
        ></textarea>
        :
        <Fragment>
          <ReactMarkdown className="node-content markdown" source={content} />
          {editable &&
            <Tooltip title={!content || !hasContent ? "Add Markdown content" : "Edit"} placement="bottom">
              {!content || !hasContent ?
                <PlusCircleOutlined className="node-content edit-icon" onClick={handleStartEditing} />
                :
                <EditOutlined className="node-content edit-icon" onClick={handleStartEditing} />
              }
            </Tooltip>
          }
        </Fragment>
      }
    </div>
  );
}

Content.propTypes = propTypes;
export default Content;
