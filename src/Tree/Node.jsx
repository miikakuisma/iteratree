import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Badge, message } from 'antd';
import { PlusCircleTwoTone, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import "../styles.css";

const propTypes = {
  node: PropTypes.object.isRequired,
  subNodes: PropTypes.array,
  isEditing: PropTypes.bool,
  isPreviewingRemove: PropTypes.bool,
  isSelected: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  keyboardListenerDisabled: PropTypes.bool,
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
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    if (this.props.keyboardListenerDisabled) {
      return
    }
    const { node, isEditing, onStartEditing, isPreviewingRemove } = this.props;
    if (e.key === "Enter" && node.selected && !isPreviewingRemove) {
      if (!isEditing) {
        this.setState({
          isHovering: false,
          isPressingEnter: true,
        });
        onStartEditing();  
      }
      if (isEditing) {
        this.saveTitle();
      }
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
      isCollapsed,
      onAddNode,
      onStartEditing,
      onCancelEditing,
      onSelectNode,
    } = this.props;
    const { isHovering, isClicking } = this.state;

    const handleClickTitle = (e) => {
      if (!e.target.classList.contains("title")) {
        return;
      }
      if (isClicking) {
        // Double Click event
        clearTimeout(this.doubleClickTimer);
        this.setState({
          isClicking: false,
          isHovering: false
        });
        onSelectNode();
        if (!isCollapsed) {
          onStartEditing();
        }
      } else {
        this.setState({ isClicking: true });
        this.doubleClickTimer = setTimeout(() => {
          // Single click event
          if (isSelected && !isCollapsed) {
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
      if (this.props.keyboardListenerDisabled) {
        return;
      }
      if (!this.state.isPressingEnter) {
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

    const handleCollapse = () => {
      this.props.onUpdateNode("collapsed", !isCollapsed);
    }

    return (
      <div className="nodeContainer">
        <div
          className={node.selected ? "node selected" : "node"}
          style={{
            background: node.selected ? (isPreviewingRemove ? 'red' : node.background || '#1890ff') : '#ffffff',
            borderTop: node.selected ? (isPreviewingRemove ? '4px solid red' : `4px solid ${(node.background === 'white' ? '#111' : node.background) || '#111'}`) : `4px solid ${node.background || '#ccc'}`,
            opacity: isPreviewingRemove ? 0.3 : 1,
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
              style={{
                color: node.selected ? node.color || '#fff' : '#111',
                backgroundColor: 'rgba(255,255,255,0.3)'
              }}
            />
          ) : (
            <span
              className="title"
              onClick={handleClickTitle}
              style={{
                color: node.selected ? node.color || '#fff' : '#111',
              }}
            > <div className="badgeContainer">
                <Badge
                  count={node.clicks}
                  overflowCount={100}
                  onClick={() => message.info("This is how many times users clicked on this answer")}
                  style={{ backgroundColor: `hsla(${(360/100) * node.clicks}, 77%, 44%, 1)` }}
                />
              </div>
              {isHovering && <div className="collapseControl" onClick={handleCollapse}>
                {isCollapsed ? <PlusSquareOutlined style={{ color: isSelected ? '#fff' : '#000' }} /> : <MinusSquareOutlined style={{ color: '#000' }} />}
              </div>}
              {!isCollapsed ? (node.title || 'Untitled') : null }
            </span>
          )}
          {isHovering && (
            <Fragment>
              {!isCollapsed && <div onClick={handleAdd} className="button add">
                <PlusCircleTwoTone />
              </div>}
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
          {!isCollapsed && subNodes}
        </div>
      </div>
    );
  }
}

Node.propTypes = propTypes;
export default Node;
