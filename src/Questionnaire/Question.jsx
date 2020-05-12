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
  
  render() {
    const { isVisible, node, onClickNode } = this.props

    const buttons = node.options && node.options.map((option, index) => <BigButton
      key={index}
      label={option.title}
      nodeId={option.id}
      onPressed={() => {
        onClickNode(option);
      }}
      style={{
        width: node.options.length == 2 && '47%'
      }}
    />);

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <div
          className="boxContainer"
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
          className="buttons"
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
