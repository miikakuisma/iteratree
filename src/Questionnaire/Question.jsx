import React from 'react'
import PropTypes from 'prop-types'
import BigButton from './BigButton'
import { QuestionBox } from './lib'
import './Questionnaire.css'

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isPreviewing: PropTypes.bool,
  node: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  onClickNode: PropTypes.func.isRequired,
}

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonsHeight: null
    }
  }

  componentDidUpdate() {
    const calculateHeight = () => {
      const element = document.querySelector('.buttons.preview');
      return `calc(100% - ${element && element.offsetHeight}px)`;
    }

    const newButtonsHeight = calculateHeight();

    if (newButtonsHeight !== this.state.buttonsHeight) {
      this.setState({
        buttonsHeight: calculateHeight()
      });
    }
  }
  
  render() {
    const { isVisible, isPreviewing, node, onClickNode } = this.props

    const buttons = node.options && node.options.map((option, index) => <BigButton
      key={index}
      label={option.title}
      nodeId={option.id}
      onPressed={() => {
        onClickNode(option);
      }}
    />);

    return (
      <div>
        <div
          className="boxContainer"
          style={{
            height: this.state.buttonsHeight
          }}
        >
          {node.title && <QuestionBox
            className="box"
            pose={isVisible ? 'visible' : 'hidden'}
          >
            <span className="title">&nbsp;</span>
            <p className="question">{node.title}</p>
          </QuestionBox>}
        </div>
        <div
          className={isPreviewing ? "buttons preview" : "buttons"}
          style={{
            flexDirection: node.options && node.options.length > 2 ? 'column' : 'row'
          }}
        >
          {buttons}
        </div>
      </div>
    )
  }
}

Question.propTypes = propTypes;
export default Question;
