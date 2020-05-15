import React, { Fragment, useContext, useState } from "react";
import PropTypes from "prop-types";
import { UIContext } from '../Store';
import { Tooltip } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown'

const propTypes = {
  node: PropTypes.object,
  content: PropTypes.object,
  editable: PropTypes.bool,
  onSave: PropTypes.func,
  onUpdate: PropTypes.func,
};

export function Content({ node, content, editable, onSave, onUpdate }) {
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
    if (hasContent) {
      onUpdate(text)
    } else {
      onSave(text)
    }
  }

  return (
    <div className="node-content">
      {editing ?
        <textarea
          autoFocus
          rows="4"
          onBlur={handleChange}
          defaultValue={content ? content.content.markdown : ""}
        ></textarea>
        :
        <Fragment>
          <ReactMarkdown className="node-content markdown" source={content && content.content.markdown} />
          {editable &&
            <Tooltip title={!content || !hasContent || !content.content.markdown ? "Add Markdown content" : "Edit"} placement="bottom">
              {!content || !hasContent || !content.content.markdown ?
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
