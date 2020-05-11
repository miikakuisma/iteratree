import React, { useContext, useState } from "react";
import { TreeContext } from '../Store';
import { Input, message } from 'antd';
import { renameTree } from '../lib/parse';

export default function TreeName() {
  const store = useContext(TreeContext);
  const [editing, setEditing] = useState(false);

  const id = store.tree[0].root ? store.tree[0].root.id : 0;
  const name = store.tree[0].root ? store.tree[0].root.name : 'Untitled';

  if (!editing) {
    return (
      <div
        className="treeName"
        title={id}
        onClick={() => {
          setEditing(true);
        }}
      >{name}</div>
    )
  }

  const handleFocus = e => {
    e.target.select();
  };

  return (
    <div className="treeName">
      <Input
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
            setEditing(false);
          }
        }}
        onBlur={(e) => {
          setEditing(false);
          renameTree({
            treeId: id,
            newName: e.target.value,
            onSuccess: () => {
              message.success("Renamed")
            },
            onError: () => {
              message.error("Couldn't rename")
            }
          })
        }}
        style={{ textAlign: 'center' }}
      />
    </div>
  )
}
