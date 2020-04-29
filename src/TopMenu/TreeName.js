import React from "react";
import { TreeContext } from '../Store';
import { Input } from 'antd';

export default function TreeName() {
  const store = React.useContext(TreeContext);
  const [editing, setEditing] = React.useState(false);

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
        onBlur={() => {
          setEditing(false);
        }}
        style={{ textAlign: 'center' }}
      />
    </div>
  )
}
