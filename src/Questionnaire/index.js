import React from 'react'
import PropTypes from "prop-types";
import Question from './Question'
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
      today: null
    }
  }

  getInitialNode() {
    return this.props.preview ? this.props.flow : this.props.flow[0];
  }

  componentDidMount() {
    const date = new Date();
    this.setState({
      boxVisible: true,
      today: date.getDay()
    });
  }

  componentDidUpdate() {
    if (this.props.preview && this.state.node.id !== this.props.flow.id) {
      this.setState({ node: this.props.flow });
    }
    if (this.props.preview && this.props.flow !== this.state.node) {
      this.setState({ node: this.props.flow });
    }
  }

  handleClick(node) {
    this.setState({
      boxVisible: false,
    })
    // eslint-disable-next-line no-eval
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
    const {
      boxVisible,
      today,
    } = this.state
    const { preview } = this.props;  

    if (node.options) {
      // Handle day filtering
      const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const filteredDay = node.options.map(n => n.title).find(subnodeTitle => subnodeTitle === weekdays[today - 1]);
      if (filteredDay) {
        return (<Question
          title={node.options.find(n => n.title === filteredDay).title}
          isVisible={boxVisible}
          isPreviewing={preview}
          node={node.options.find(n => n.title === filteredDay)}
          onClickNode={(answer) => {
            if (answer && answer.options && answer.options.length === 1) {
              this.handleClick(answer.options[0]);
            } else {
              this.handleClick(answer);
            }
          }}
        />)
      }

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
      
      // This comes if there is no more subnodes left
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
      </div>)
    }    
  }
  
  render() {
    const { node } = this.state
    return (
      <div
        className={this.props.preview ? "Questionnaire preview" : "Questionnaire"}
      >
        {this.getBoxContent(node)}
      </div>
    )
  }
}

Questionnaire.propTypes = propTypes;
export default Questionnaire;
