import React, { useState, useContext } from 'react'
import PropTypes from "prop-types";
import { TreeContext } from '../Store';
import { Button } from './lib'
import { updateSavedTree } from "../lib/parse";
import './Questionnaire.css'

const propTypes = {
  label: PropTypes.string,
  nodeId: PropTypes.number,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  onPressed: PropTypes.func
};

// eslint-disable-next-line no-undef
const traverse = require("traverse");

function BigButton({ label, nodeId, disabled, style, onPressed }) {
  const store = useContext(TreeContext);
  const [buttonDown, setButtonDown] = useState(false);

  const handleClick = () => {
    // Count answers
    traverse(store.tree[0]).forEach(function(node) {
      if (typeof node === "object" && node.id === nodeId) {
        if (node.clicks) {
          node.clicks++;
        } else {
          node.clicks = 1;
        }
      }
    });
    store.onRefresh();
    updateSavedTree({
      tree: store.tree,
      onSuccess: () => {
        onPressed();
      },
      onError: () => {
        onPressed();
      }
    })
  }

  return (
    <Button
      pose={buttonDown ? 'pressed' : 'released'}
      disabled={disabled}
      onTouchStart={() => {
        setButtonDown(true);
      }}
      onTouchEnd={() => {
        setButtonDown(false);
      }}
      onClick={handleClick}
      style={style}
    >{label}</Button>
  )  
}

BigButton.propTypes = propTypes;
export default BigButton;
