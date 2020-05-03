import React from 'react'
import PropTypes from 'prop-types'
import BigButton from './BigButton'
import { QuestionBox } from './lib'
import './Questionnaire.css'

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  node: PropTypes.object.isRequired,
  onClickNode: PropTypes.func.isRequired,
}

class Question extends React.Component {
  
  render() {
    const { isVisible, node, onClickNode } = this.props
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
        <div className="boxContainer">
          <QuestionBox className="box" pose={isVisible ? 'visible' : 'hidden'}>
            <span className="title">&nbsp;</span>
            <p className="question">{node.title}</p>
          </QuestionBox>
        </div>
        <div className="buttons">
          {buttons}
        </div>
      </div>
    )
  }
}

Question.propTypes = propTypes;
export default Question;
