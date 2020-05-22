import React, { Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { TreeContext, UIContext } from '../Store';
import { Button, Typography, message } from 'antd';
import { LeftSquareFilled, RightSquareFilled } from '@ant-design/icons';
import { SidebarContainer } from './animations';
import Questionnaire from '../Questionnaire';
import { saveImage } from '../lib/parse';
import ContentTools from './ContentTools';

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

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async function handleUpload() {
    const file = document.querySelector('#myfile').files[0];
    saveImage({
      name: file.name,
      type: file.type,
      size: file.size,
      base64: await toBase64(file)
    })
    .catch((error) => {
      message.error(error);
    })
    .then((response) => {
      message.success("Image was uploaded");
      console.log(response);
    });
  }


  return (
    <SidebarContainer className="sidebar" pose={open ? 'visible' : 'hidden'} style={{ overflow: open ? 'overlay' : 'visible' }}>
      <div className="top">
        {sidebarOpen && <Fragment>
          <Text style={{ color: 'white' }}>Preview</Text>
          <Button
            type="primary"
            size="small"
            disabled={!userLoggedIn || (treeId === "")}
            onClick={() => {
              // onEnterPreview();
              // UI.setState({ view: true });
              UI.setState({ codeModal: true });
            }}
          >Publish</Button>
        </Fragment>}
        <div
          className="opener"
          onClick={() => UI.setState({ sidebarOpen: !sidebarOpen })}
          style={{
            right: open ? '376px' : '0px'
          }}
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
      {/* <ContentTools selectedNode={selectedNode} /> */}
      <div style={{
        position: 'absolute',
        zIndex: 9999
      }}><input type="file" id="myfile" onChange={handleUpload} /></div>
      <Questionnaire
        flow={selectedNode || tree[0]}
        preview={true}
        onAnswer={onSelectNode}
      />
    </SidebarContainer>
  );
}

Sidebar.propTypes = propTypes;
export default Sidebar;
