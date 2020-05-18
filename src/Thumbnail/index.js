import React from "react";
import PropTypes from "prop-types";
import 'antd/dist/antd.css';
import "../styles.css";

const propTypes = {
  tree: PropTypes.array,
};

function Thumbnail({ tree }) {

  // eslint-disable-next-line react/prop-types
  const Node = ({ node, isCollapsed, subNodes }) => (
    <div className="nodeContainer">
      <div
        className= "node"
        style={{
          background: node.background || '#ccc',
          opacity: 1,
        }}
      >
        <span
          className="title"
          style={{
            color: '#111',
          }}
        > 
        </span>
      </div>
      <div
        className="subLevel"
      >
        {!isCollapsed && subNodes}
      </div>
    </div>
  )

  const renderNode = node => {
    const subNodes = node.options && node.options.map(sub => renderNode(sub));
    return Node({ node, subNodes, isCollapsed: node.isCollapsed });
  };

  const nodeTree = tree && tree.map(node => renderNode(node));

  return (
    <div id="thumbnail">{nodeTree}</div>
  );
}

Thumbnail.propTypes = propTypes;
export default Thumbnail;
