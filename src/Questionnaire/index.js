import React from 'react'
import PropTypes from "prop-types";
import Question from './Question'
import Switcher from './Switcher'
import './Questionnaire.css'

const propTypes = {
  flow: PropTypes.array
};

class Questionnaire extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      node: props.flow[0],
      boxVisible: false,
      deviceVisible: false,
      switcherRunning: false,
    }
  }

  componentDidMount() {
    this.setState({
      boxVisible: true,
    })
  }

  handleClick(node) {
    this.setState({
      boxVisible: false,
    })
    const nextNode = eval(node)
    setTimeout(() => {
      this.setState({
        node: nextNode,
        boxVisible: true,
      })
    }, 500)
  }

  getBoxContent(node) {
    const { boxVisible, switcherRunning } = this.state
    if (node.options) {
      return (<Question
        title={node.title}
        isVisible={boxVisible}
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
      
      return (<div>
        <Question
          title={node.title}
          isVisible={boxVisible}
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
          <button
            style={{ width: '100%' }}
            onClick={() => {
              this.setState({ switcherRunning: true })
              setTimeout(() => {
                this.setState({
                  switcherRunning: false
                })
              }, 1000)
              setTimeout(() => {
                this.setState({ node: this.props.flow[0] })
              }, 1111)
            }}
          >Start Over</button>
        </div>
        <Switcher isVisible={switcherRunning} />        
      </div>)
    }    
  }
  
  render() {
    const { node } = this.state
    return (
      <div className="Questionnaire">
        {this.getBoxContent(node)}
      </div>
    )
  }
}

Questionnaire.propTypes = propTypes;
export default Questionnaire;
