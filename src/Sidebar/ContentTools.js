import React, { useContext } from "react";
import PropTypes from "prop-types";
import { TreeContext } from '../Store';
import { Button, Tooltip } from 'antd';
import { MobileOutlined, SettingFilled } from '@ant-design/icons';
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
      <Tooltip title="Preview" placement="bottom">
        <MobileOutlined style={{ fontSize: 24, color: '#111' }} />
      </Tooltip>
      <Tooltip title="Settings" placement="bottom">
        <SettingFilled style={{ fontSize: 24, color: '#999' }} />
      </Tooltip>
    </div>
  );
}

ContentTools.propTypes = propTypes;
export default ContentTools;
