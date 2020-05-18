import React, { useContext } from "react";
import { TreeContext } from '../Store';
import domtoimage from 'dom-to-image';
import 'antd/dist/antd.css';
import "../styles.css";

function Thumbnail() {
  const store = useContext(TreeContext);
  const { tree } = store;

  function saveAsImage() {
    domtoimage.toJpeg(document.getElementById('thumbnail'), { quality: 0.95 })
    .then(function (dataUrl) {
      // save to tree
    });
  }

  console.log(tree);

  // eslint-disable-next-line react/prop-types
  const Node = ({ node, isCollapsed, subNodes }) => (
    <div className="nodeContainer">
      <div
        className= "node"
        style={{
          background: '#ccc',
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
    return  Node({ node, subNodes, isCollapsed: node.isCollapsed });
  };

  const nodeTree = tree.map(node => renderNode(node));

  return (
    <div id="thumbnail">{nodeTree}</div>
  );
}

export default Thumbnail;
