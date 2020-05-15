import React from "react";
import PropTypes from "prop-types";
import { Typography } from 'antd';
const { Paragraph } = Typography;

const propTypes = {
  node: PropTypes.object,
  content: PropTypes.object,
  editable: PropTypes.bool,
  onStartEditing: PropTypes.func,
  onSave: PropTypes.func,
  onUpdate: PropTypes.func,
};

export function Content({ node, content, editable, onStartEditing, onSave, onUpdate }) {
  const hasContent = content !== undefined;

  return (
    <div className="nodeContent">
      <Paragraph
        style={{ color: node.color || 'white'}}
        editable={editable && {
          onStart: onStartEditing,
          onChange: hasContent ? onUpdate : onSave
        }}
      >{content && content.content.markdown}</Paragraph>
    </div>
  );
}

Content.propTypes = propTypes;
export default Content;
