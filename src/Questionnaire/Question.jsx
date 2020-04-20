import React from 'react'
import PropTypes from 'prop-types'
import BigButton from './BigButton'
import { QuestionBox } from './lib'
import './Questionnaire.css'

class Question extends React.Component {
  
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    node: PropTypes.object.isRequired,
    onClickNode: PropTypes.func.isRequired,
  }

  render() {
    const { isVisible, node, onClickNode } = this.props
    const buttons = node.options && node.options.map((option, index) => <BigButton
      key={index}
      label={option.title}
      onPressed={() => {
        onClickNode(option);
      }}
    />)
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

export default Question;
