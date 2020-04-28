import React from "react";
import { TreeContext } from '../Store';
import { Input } from 'antd';

export default function TreeName() {
  const store = React.useContext(TreeContext);
  const [editing, setEditing] = React.useState(false);

  if (!editing) {
    return (
      <div
        className="treeName"
        title={store.tree[0].root.id}
        onClick={() => {
          setEditing(true);
        }}
      >{store.tree[0].root.name}</div>
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
        defaultValue={store.tree[0].root.name}
        onChange={(e) => {
          store.tree[0].root.name = e.target.value;
          store.onRefresh();
        }}
        onBlur={() => {
          setEditing(false);
        }}
        style={{ textAlign: 'center' }}
      />
    </div>
  )
}
