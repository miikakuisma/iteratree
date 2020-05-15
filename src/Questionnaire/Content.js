import React, { Fragment, useContext, useState } from "react";
import PropTypes from "prop-types";
import { UIContext } from '../Store';
import { EditOutlined } from '@ant-design/icons';
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

  // "[Link to Typeform](https://www.typeform.com/templates/t/reference-request-form-template/)"

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
          style={{ color: node.color || '#111'}}
          onBlur={handleChange}
        >{content ? content.content.markdown : ""}</textarea>
        :
        <Fragment>
          <ReactMarkdown className="node-content markdown" source={content && content.content.markdown} />
          {editable && <EditOutlined className="node-content edit-icon" onClick={handleStartEditing} />}
        </Fragment>
      }
    </div>
  );
}

Content.propTypes = propTypes;
export default Content;
