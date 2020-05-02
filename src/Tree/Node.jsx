import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { PlusCircleTwoTone } from '@ant-design/icons';
import 'antd/dist/antd.css';
import "../styles.css";

const propTypes = {
  node: PropTypes.object.isRequired,
  subNodes: PropTypes.array,
  isEditing: PropTypes.bool,
  isPreviewingRemove: PropTypes.bool,
  isSelected: PropTypes.bool,
  onRemoveNode: PropTypes.func.isRequired,
  onUpdateNode: PropTypes.func.isRequired,
  onSelectNode: PropTypes.func,
  onStartEditing: PropTypes.func,
  onCancelEditing: PropTypes.func,
  onAddNode: PropTypes.func.isRequired,
};

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
      isClicking: false,
      isPressingEnter: false,
      selected: false
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    const { node, isEditing, onStartEditing, isPreviewingRemove, onRemoveNode } = this.props;
    if (e.key === "Enter" && node.selected && !isEditing && !isPreviewingRemove) {
      this.setState({
        isHovering: false,
        isPressingEnter: true,
      });
      onStartEditing();
    }
    if (e.key === "Backspace" && node.selected && !isEditing) {
      onRemoveNode();
    }
  }

  saveTitle() {
    if (this.inputField) {
      this.props.onUpdateNode("title", this.inputField.value);
    }
  }

  render() {
    const {
      node,
      subNodes,
      isEditing,
      isPreviewingRemove,
      isSelected,
      onAddNode,
      onStartEditing,
      onCancelEditing,
      onSelectNode,
    } = this.props;
    const { isHovering, isClicking } = this.state;

    const handleClickTitle = () => {
      if (isClicking) {
        // Double Click event
        clearTimeout(this.doubleClickTimer);
        this.setState({
          isClicking: false,
          isHovering: false
        });
        onSelectNode();
        onStartEditing();
      } else {
        this.setState({ isClicking: true });
        this.doubleClickTimer = setTimeout(() => {
          // Single click event
          if (isSelected) {
            onStartEditing();
          } else {
            onSelectNode();
          }
          this.setState({ isClicking: false });
        }, 200);
      }
    };

    const handleFocus = e => {
      e.target.select();
    };

    const handleBlur = () => {
      this.saveTitle();
    };

    const handleKeyUp = e => {
      if (!this.state.isPressingEnter) {
        if (e.key === "Enter") {
          this.saveTitle();
        }
        if (e.key === "Escape") {
          onCancelEditing();
        }
      } else {
        this.setState({
          isPressingEnter: false,
        });
      }
    };

    const handleAdd = () => {
      onAddNode();
    };

    return (
      <div className="nodeContainer">
        <div
          className={node.selected ? "node selected" : "node"}
          style={{
            background: node.selected ? (isPreviewingRemove ? 'red' : '#1890ff') : '#ffffff',
            border: node.selected ? (isPreviewingRemove ? '2px solid red' : '2px solid #1890ff') : '2px solid #bfbfbf',
            opacity: isPreviewingRemove ? 0.3 : 1
          }}
          onMouseEnter={() => {
            this.setState({ isHovering: true });
          }}
          onMouseLeave={() => {
            this.setState({ isHovering: false });
          }}
        >
          {isEditing ? (
            <input
              ref={ref => (this.inputField = ref)}
              type="text"
              autoFocus
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
              className="title"
              defaultValue={node.title || ''}
            />
          ) : (
            <span
              className="title"
              onClick={handleClickTitle}
              style={{
                color: node.selected ? '#fff' : '#111',
              }}
            >
              {node.title || 'Untitled'}
            </span>
          )}
          {isHovering && (
            <Fragment>
              <div onClick={handleAdd} className="button add">
                <PlusCircleTwoTone />
              </div>
            </Fragment>
          )}
        </div>
        <div
          className="subLevel"
          style={{
            opacity: isPreviewingRemove ? "0.3" : "1",
            background: isPreviewingRemove && 'red'
          }}
        >
          {subNodes}
        </div>
      </div>
    );
  }
}

Node.propTypes = propTypes;
export default Node;
