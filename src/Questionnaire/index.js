import React from 'react'
import PropTypes from "prop-types";
import Question from './Question'
import Switcher from './Switcher'
import './Questionnaire.css'

const propTypes = {
  flow: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  preview: PropTypes.bool,
  onAnswer: PropTypes.func,
};

class Questionnaire extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      node: this.getInitialNode(),
      boxVisible: false,
      deviceVisible: false,
      switcherRunning: false,
    }
  }

  getInitialNode() {
    return this.props.preview ? this.props.flow : this.props.flow[0];
  }

  componentDidMount() {
    this.setState({
      boxVisible: true,
    })
  }

  componentDidUpdate() {
    if (this.props.preview && this.state.node.id !== this.props.flow.id) {
      this.setState({ node: this.props.flow });
    }
  }

  handleClick(node) {
    this.setState({
      boxVisible: false,
    })
    const nextNode = eval(node)
    if (this.props.preview) {
      this.props.onAnswer(nextNode);
      this.setState({
        boxVisible: true,
      })
    } else {
      setTimeout(() => {
        this.setState({
          node: nextNode,
          boxVisible: true,
        })
      }, 500)
    }
  }

  getBoxContent(node) {
    const { boxVisible, switcherRunning } = this.state
    const { preview } = this.props;

    if (node.options) {
      return (<Question
        title={node.title}
        isVisible={boxVisible}
        isPreviewing={preview}
        node={node}
        onClickNode={(answer) => {
          if (answer && answer.options && answer.options.length === 1) {
            this.handleClick(answer.options[0]);
          } else {
            this.handleClick(answer);
          }
        }}
      />)
    } else {
      
      return (<div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <Question
          title={node.title}
          isVisible={boxVisible}
          isPreviewing={preview}
          node={node}
          onClickNode={(answer) => {
            if (answer.options.length === 1) {
              this.handleClick(answer.options[0]);
            } else {
              this.handleClick(answer);
            }
          }}
        />
        <div className="buttons">
          {node.title && <button
            onClick={() => {
              if (preview) {
                return;
              }
              this.setState({ switcherRunning: true })
              setTimeout(() => {
                this.setState({
                  switcherRunning: false
                })
              }, 1000)
              setTimeout(() => {
                this.setState({ node: this.getInitialNode() })
              }, 1111)
            }}
          >Start Over</button>}
        </div>
        {!preview && <Switcher isVisible={switcherRunning} />}
      </div>)
    }    
  }
  
  render() {
    const { node } = this.state
    return (
      <div className={this.props.preview ? "Questionnaire preview" : "Questionnaire"}>
        {this.getBoxContent(node)}
      </div>
    )
  }
}

Questionnaire.propTypes = propTypes;
export default Questionnaire;
