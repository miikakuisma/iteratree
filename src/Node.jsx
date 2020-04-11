import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { PlusCircleTwoTone } from '@ant-design/icons';
import 'antd/dist/antd.css';
import "./styles.css";

const propTypes = {
  node: PropTypes.object.isRequired,
  subNodes: PropTypes.array,
  isEditing: PropTypes.bool,
  isPreviewingRemove: PropTypes.bool,
  onRemoveNode: PropTypes.func.isRequired,
  onUpdateNode: PropTypes.func.isRequired,
  onAddNode: PropTypes.func.isRequired,
};

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
      isClicking: false,
      isPressingEnter: false,
      isEditing: false,
      selected: false
    };
  }

  componentDidMount() {
    const { node, isEditing } = this.props;
    this.setState({
      selected: node.selected || false,
      isEditing,
    });
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentDidUpdate() {
    if (this.props.isEditing !== this.state.isEditing) {
      this.setState({ isEditing: this.props.isEditing });
      setTimeout(() => { this.inputField.focus(); });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    const { node, onRemoveNode } = this.props;
    if (e.key === "Enter" && node.selected && !this.state.isEditing && !this.props.isPreviewingRemove) {
      this.setState({
        isEditing: true,
        isHovering: false,
        isPressingEnter: true,
      });
      setTimeout(() => { this.inputField.focus(); });
    }
    if (e.key === "Backspace" && node.selected && !this.state.isEditing) {
      onRemoveNode();
    }
  }

  saveTitle() {
    if (this.inputField) {
      this.setState({ isEditing: false });
      this.props.onUpdateNode("title", this.inputField.value);
    }
  }

  render() {
    const {
      node,
      subNodes,
      isPreviewingRemove,
      onAddNode,
      onSelectNode,
    } = this.props;
    const { isHovering, isClicking, isEditing } = this.state;

    const handleClickTitle = () => {
      if (isClicking) {
        // Double Click event
        clearTimeout(this.doubleClickTimer);
        this.setState({
          isClicking: false,
          isEditing: true
        });
        setTimeout(() => {
          if (this.inputField) {
            this.inputField.focus();
            this.setState({ isHovering: false });
          }
        });
      } else {
        this.setState({ isClicking: true });
        this.doubleClickTimer = setTimeout(() => {
          // Single click event
          onSelectNode();
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
          this.setState({ isEditing: false });
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
            border: node.selected ? '2px solid #1890ff' : '2px solid #bfbfbf',
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
              className="title"
              defaultValue={node.title || node.id.toString()}
            />
          ) : (
            <span
              className="title"
              onClick={handleClickTitle}
              style={{
                color: node.selected ? '#fff' : '#111',
              }}
            >
              {node.title || node.id.toString()}
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
          style={{ opacity: isPreviewingRemove ? "0.3" : "1" }}
        >
          {subNodes}
        </div>
      </div>
    );
  }
}

Node.propTypes = propTypes;
export default Node;
