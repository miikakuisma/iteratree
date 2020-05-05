import React, { useState, useContext } from 'react'
import PropTypes from "prop-types";
import { TreeContext } from '../Store';
import { Button } from './lib'
import './Questionnaire.css'

const propTypes = {
  label: PropTypes.string,
  nodeId: PropTypes.string,
  disabled: PropTypes.bool,
  onPressed: PropTypes.func
};

// eslint-disable-next-line no-undef
const traverse = require("traverse");

function BigButton({ label, nodeId, disabled, onPressed }) {
  const store = useContext(TreeContext);
  const [buttonDown, setButtonDown] = useState(false);

  const handleClick = () => {
    traverse(store.tree[0]).forEach(function(node) {
      if (typeof node === "object" && node.id === nodeId) {
        node.clicks = 1;
        store.onRefresh();
      }
    });

    onPressed();
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
    >{label}</Button>
  )  
}

BigButton.propTypes = propTypes;
export default BigButton;
