import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "./styles.css";

const propTypes = {
  node: PropTypes.object.isRequired,
  subNodes: PropTypes.array,
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
      isEditing: false,
      selected: false
    };
  }

  componentDidMount() {
    this.setState({
      isEditing: this.props.editing || false
    });
  }

  saveTitle() {
    if (this.inputField) {
      this.props.onUpdateNode("title", this.inputField.value);
      this.setState({ isEditing: false });
    }
  }

  render() {
    const {
      node,
      subNodes,
      onAddNode,
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
      if (e.key === "Enter") {
        this.saveTitle();
      }
    };

    const handleAdd = () => {
      onAddNode();
    };

    const handleRemove = () => {
      onRemoveNode();
    };

    return (
      <div className="nodeContainer">
        <div
          className="node"
          style={{
            background: node.selected ? "white" : "#efefef",
            borderColor: isHoveringRemove ? "#bbb" : "#111"
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
              style={{ color: isHoveringRemove ? "#bbb" : "#000" }}
            >
              {node.title || node.id.toString()}
            </span>
          )}
          {isHovering && (
            <Fragment>
              <div onClick={handleAdd} className="button add">
                <img
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJJY29ucyB3aXRoIG51bWJlcnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAtNTI4LjAwMDAwMCkiPjxwYXRoIGQ9Ik00LDUzNSBMNCw1MzcgTDcsNTM3IEw3LDU0MCBMOSw1NDAgTDksNTM3IEwxMiw1MzcgTDEyLDUzNSBMOSw1MzUgTDksNTMyIEw3LDUzMiBMNyw1MzUgWiBNOCw1NDQgQzMuNTgxNzIxNzgsNTQ0IDAsNTQwLjQxODI3OCAwLDUzNiBDMCw1MzEuNTgxNzIyIDMuNTgxNzIxNzgsNTI4IDgsNTI4IEMxMi40MTgyNzgyLDUyOCAxNiw1MzEuNTgxNzIyIDE2LDUzNiBDMTYsNTQwLjQxODI3OCAxMi40MTgyNzgyLDU0NCA4LDU0NCBaIE04LDU0NCIgaWQ9Ik92YWwgMjEwIGNvcHkiLz48L2c+PC9nPjwvc3ZnPg=="
                  alt="add"
                  style={{ transform: "rotate(180deg) scaleX(-1)" }}
                />
              </div>
              {node.id !== 0 && (
                <div
                  onClick={handleRemove}
                  onMouseEnter={() => {
                    this.setState({ isHoveringRemove: true });
                  }}
                  onMouseLeave={() => {
                    this.setState({ isHoveringRemove: false });
                  }}
                  className="button remove"
                >
                  <img
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxNnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjE2cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJJY29ucyB3aXRoIG51bWJlcnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00OC4wMDAwMDAsIC01MjguMDAwMDAwKSI+PHBhdGggZD0iTTU2LDU0NCBDNTEuNTgxNzIxOCw1NDQgNDgsNTQwLjQxODI3OCA0OCw1MzYgQzQ4LDUzMS41ODE3MjIgNTEuNTgxNzIxOCw1MjggNTYsNTI4IEM2MC40MTgyNzgyLDUyOCA2NCw1MzEuNTgxNzIyIDY0LDUzNiBDNjQsNTQwLjQxODI3OCA2MC40MTgyNzgyLDU0NCA1Niw1NDQgWiBNNTIsNTM1IEw1Miw1MzcgTDYwLDUzNyBMNjAsNTM1IFogTTUyLDUzNSIgaWQ9Ik92YWwgMjEwIGNvcHkgMiIvPjwvZz48L2c+PC9zdmc+"
                    alt="remove"
                  />
                </div>
              )}
            </Fragment>
          )}
        </div>
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
