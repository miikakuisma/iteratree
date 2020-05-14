import React, { useContext } from "react";
import PropTypes from "prop-types";
import { TreeContext } from '../Store';
import { saveNodeContent } from '../lib/parse';

const propTypes = {
  selectedNode: PropTypes.object
};

export function ContentTools({ selectedNode }) {
  const store = useContext(TreeContext);

  const { tree } = store;
  const treeId = tree[0].root.id;
  const nodeId = selectedNode.id;

  return (
    <div className="content-tools">
      <button onClick={() => {
        saveNodeContent({
          treeId,
          nodeId,
          content: {
            markdown: 'turha luulla muuta'
          }
        })
      }}>Add text</button>
    </div>
  );
}

ContentTools.propTypes = propTypes;
export default ContentTools;
