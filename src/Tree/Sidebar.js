import React, { Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { TreeContext, UIContext } from '../Store';
import { Button, Typography } from 'antd';
import { LeftSquareFilled, RightSquareFilled } from '@ant-design/icons';
import { SidebarContainer } from './animations';
import Questionnaire from "../Questionnaire";

const { Text } = Typography;

const propTypes = {
  open: PropTypes.bool,
  selectedNode: PropTypes.object,
  onSelectNode: PropTypes.func,
};

export function Sidebar({ open, selectedNode, onSelectNode }) {
  const store = useContext(TreeContext);
  const UI = useContext(UIContext);

  const { tree } = store;
  const { sidebarOpen, user, loggedIn } = UI.state;
  const userLoggedIn = user && loggedIn;
  const treeId = tree[0].root.id;

  return (
    <SidebarContainer className="sidebar" pose={open ? 'visible' : 'hidden'}>
      <div className="toggle">
        {sidebarOpen && <Fragment>
          <Text style={{ color: 'white' }}>Questionnaire Preview</Text>
          <Button
            type="primary"
            size="small"
            disabled={!userLoggedIn || (treeId === "")}
            onClick={() => {
              // onEnterPreview();
              // UI.setState({ questionnaire: true });
              UI.setState({ codeModal: true });
            }}
          >Publish</Button>
        </Fragment>}
        <div
          className="opener"
          onClick={() => UI.setState({ sidebarOpen: !sidebarOpen })}
        >
          {sidebarOpen ?
            <RightSquareFilled
              style={{
                fontSize: 20,
                color: '#eee',
                padding: '7px 4px',
                transform: 'translateX(25px)'
              }}
            />
            :
            <LeftSquareFilled
              style={{
                fontSize: 20,
                color: '#111',
                padding: '7px 4px'
              }}
            />}
        </div>
      </div>
      <Questionnaire flow={selectedNode || tree[0]} preview={true} onAnswer={onSelectNode} />
    </SidebarContainer>
  );
}

Sidebar.propTypes = propTypes;
export default Sidebar;
