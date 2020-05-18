import React, { useContext, useState } from "react";
import { TreeContext, UIContext } from '../Store';
import { Input, message, Menu, Dropdown, notification, Modal } from 'antd';
import { BranchesOutlined, DownOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { renameTree, deleteTree } from '../lib/parse';


export default function TreeName() {
  const store = useContext(TreeContext);
  const UI = useContext(UIContext);

  const [editing, setEditing] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);

  const id = store.tree[0].root ? store.tree[0].root.id : 0;
  const name = store.tree[0].root ? store.tree[0].root.name : 'Untitled';

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="#" onClick={() => {
          UI.setState({ editingContent: true });
          setEditing(true);
        }}
      ><EditOutlined /> Rename</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" disabled={id === ""} style={{
        opacity: id === "" ? '0.5' : '1',
        cursor: 'default',
        pointerEvents: 'none',
      }}>
        <a
          href="#"
          onClick={() => handleDeleteTree(id)}
          style={{ color: id === "" ? 'unset' : '#cc0000' }}
        ><DeleteOutlined /> Delete</a>
      </Menu.Item>
    </Menu>
  );

  function handleDeleteTree(id) {
    const { confirm } = Modal;

    UI.setState({ modalOpen: true });
    confirm({
      title: 'Delete this tree?',
      icon: <ExclamationCircleOutlined />,
      content: 'There is no way to undo',
      onOk() {
        UI.setState({ modalOpen: false });
        message.loading('Deleting tree..');
        deleteTree({
          id,
          onSuccess: (response) => {
            notification.success({ message: response });
            window.localStorage.removeItem('tree');
            window.location.reload();
            message.destroy();
          },
          onError: (response) => {
            notification.error({ message: "Cannot delete", description: response });
            message.destroy();
            // logger('ERROR', response);
          }
        })
      },
      onCancel() {
        UI.setState({ modalOpen: false });
      },
    });
  }

  if (!editing) {
    return (
      <div className="treeName">
        <div className="logo">
          <BranchesOutlined style={{
            transform: 'rotate(180deg) scaleX(-1)'
          }} />
          <span>Iteratree</span>
        </div>
        <div className="name">
          <span title={id}>{name}</span>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <DownOutlined />
            </a>
          </Dropdown>
        </div>
      </div>
    )
  }

  const handleFocus = e => {
    e.target.select();
  };

  const handleSaveTitle = (e) => {
    setEditing(false);
    if (id === "") {
      return
    }
    if (!nameChanged) {
      return
    }
    renameTree({
      treeId: id,
      newName: e.target.value,
      onSuccess: () => {
        message.success("Renamed");
        store.onRefresh();
      },
      onError: () => {
        message.error("Couldn't rename")
        store.onRefresh();
      }
    })
  }

  return (
    <div className="treeName">
      <div className="logo">
        <BranchesOutlined style={{
          transform: 'rotate(180deg) scaleX(-1)'
        }} />
        <span>Iteratree</span>
      </div>
      <div className="name"><Input
        size="small"
        autoFocus
        onFocus={handleFocus}
        placeholder="Name this flow"
        defaultValue={name}
        onChange={(e) => {
          store.tree[0].root.name = e.target.value;
          store.onRefresh();
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSaveTitle(e);
          } else {
            setNameChanged(true);
            UI.setState({ editingContent: false });
          }
        }}
        onBlur={handleSaveTitle}
        style={{ textAlign: 'center' }}
      /></div>
    </div>
  )
}
