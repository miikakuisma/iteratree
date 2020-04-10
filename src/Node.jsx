import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Card } from 'antd';
import { CopyOutlined, PlusCircleTwoTone, DeleteOutlined } from '@ant-design/icons';
import "./styles.css";

const propTypes = {
  node: PropTypes.object.isRequired,
  subNodes: PropTypes.array,
  pasteEnabled: PropTypes.bool,
  onCopyNode: PropTypes.func,
  onPasteNode: PropTypes.func,
  onRemoveNode: PropTypes.func.isRequired,
  onUpdateNode: PropTypes.func.isRequired,
  onAddNode: PropTypes.func.isRequired
};

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
      isHoveringRemove: false,
      isClicking: false,
      isPressingEnter: false,
      isEditing: false,
      selected: false
    };
  }

  componentDidMount() {
    const { node } = this.props;
    this.setState({ selected: node.selected || false });
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    const { node } = this.props;
    if (e.key === "Enter" && node.selected && !this.state.isEditing) {
      this.setState({
        isEditing: true,
        isHovering: false,
        isPressingEnter: true,
      });
      this.inputField.focus();  
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
      pasteEnabled,
      onAddNode,
      onCopyNode,
      onPasteNode,
      onRemoveNode,
      onSelectNode
    } = this.props;
    const { isHovering, isHoveringRemove, isClicking, isEditing } = this.state;

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

    const handleCopy = () => {
      onCopyNode();
    }

    const handlePaste = () => {
      onPasteNode();
    }

    const handleRemove = () => {
      onRemoveNode();
    };

    return (
      <div className="nodeContainer">
        <Card
          // title={node.title}
          // className="node"
          style={{
            background: node.selected ? '#1890ff' : '#ffffff',
            border: node.selected ? '2px solid #1890ff' : '2px solid #dedede',
            opacity: isHoveringRemove ? 0.3 : 1
          }}
          onClick={handleClickTitle}
          onMouseEnter={() => {
            this.setState({ isHovering: true });
          }}
          onMouseLeave={() => {
            this.setState({ isHovering: false });
          }}
          actions={node.selected && [
            <CopyOutlined key="copy" onClick={handleCopy} />,
            <img
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyMnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxOCAyMiIgd2lkdGg9IjE4cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZXNjLz48ZGVmcy8+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSI+PGcgZmlsbD0iIzAwMDAwMCIgaWQ9IkNvcmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzEuMDAwMDAwLCAtMTI3LjAwMDAwMCkiPjxnIGlkPSJjb250ZW50LXBhc3RlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzEuMDAwMDAwLCAxMjcuMDAwMDAwKSI+PHBhdGggZD0iTTE2LDIgTDExLjgsMiBDMTEuNCwwLjggMTAuMywwIDksMCBDNy43LDAgNi42LDAuOCA2LjIsMiBMMiwyIEMwLjksMiAwLDIuOSAwLDQgTDAsMjAgQzAsMjEuMSAwLjksMjIgMiwyMiBMMTYsMjIgQzE3LjEsMjIgMTgsMjEuMSAxOCwyMCBMMTgsNCBDMTgsMi45IDE3LjEsMiAxNiwyIEwxNiwyIFogTTksMiBDOS42LDIgMTAsMi40IDEwLDMgQzEwLDMuNiA5LjYsNCA5LDQgQzguNCw0IDgsMy42IDgsMyBDOCwyLjQgOC40LDIgOSwyIEw5LDIgWiBNMTYsMjAgTDIsMjAgTDIsNCBMNCw0IEw0LDcgTDE0LDcgTDE0LDQgTDE2LDQgTDE2LDIwIEwxNiwyMCBaIiBpZD0iU2hhcGUiLz48L2c+PC9nPjwvZz48L3N2Zz4="
              alt="paste"
              onClick={handlePaste}
              style={{
                width: '16px',
                height: '16px',
                opacity: pasteEnabled ? 0.9 : 0.5,
                marginTop: '-5px',
              }}
            />,
            <PlusCircleTwoTone key="Add subnode" twoToneColor="#1890ff" onClick={handleAdd} />,
            <DeleteOutlined
              key="ellipsis"
              onClick={handleRemove}
              onMouseEnter={() => {
                this.setState({ isHoveringRemove: true });
              }}
              onMouseLeave={() => {
                this.setState({ isHoveringRemove: false });
              }}
            />,
          ]}
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
              style={{
                color: node.selected ? '#ffffff' : '#111111',
              }}
            >
              {node.title || node.id.toString()}
            </span>
          )}
        </Card>
        <div
          className="subLevel"
          style={{ opacity: isHoveringRemove ? "0.3" : "1" }}
        >
          {subNodes}
        </div>
      </div>
    );
  }
}

Node.propTypes = propTypes;
export default Node;
