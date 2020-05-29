import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input } from 'antd';
import Library from "../Library";

const propTypes = {
  editing: PropTypes.bool,
  content: PropTypes.string,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
}

export function Background({ editing, content, onChange, onCancel }) {

  if (editing) {
    return (
      <Library
        selected={content}
        onCancel={() => {
          onChange({
            target: { value: "" }
          });
        }}
        onSelect={(id) => {
          onChange({
            target: { value: id }
          });
        }}
      />
    )
  }

  if (editing) {
    return (
      <Fragment>
        <Input
          placeholder="Image URL"
          autoFocus
          onBlur={onChange}
          defaultValue={content || ""}
          onKeyDown={(e) => {
            if (e.key === "Escape") { onCancel(); }
          }}
        />
        <p style={{ color: 'rgba(255,255,255,0.5)'}}>Clear all text and leave editing to delete</p>
      </Fragment>
    )
  }

  if (content) {
    return null
  }

  return null;
}

Background.propTypes = propTypes;
export default Background;
