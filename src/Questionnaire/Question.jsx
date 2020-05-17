import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { TreeContext } from '../Store';
import BigButton from './BigButton'
import { QuestionBox } from './lib'
import './Questionnaire.css'
import Content from './Content'

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isPreviewing: PropTypes.bool,
  node: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  onClickNode: PropTypes.func.isRequired,
}

export function Question({ isVisible, isPreviewing, node, onClickNode }) {
  const store = useContext(TreeContext);

  const buttons = node.options && node.options.map((option, index) => <BigButton
    key={index}
    label={option.title}
    nodeId={option.id}
    onPressed={() => {
      onClickNode(option);
    }}
    style={{
      width: node.options.length === 2 && '47%',
      color: option.color || '#111',
      background: option.background || 'white',
      borderColor: option.background || 'white',
      margin: node.options.length === 2 ? '5px' : '5px 0',
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
          <p
            className="question"
            style={{
              color: node.color || 'white'
            }}
          >{node.title}</p>
          <Content
            content={node.content}
            editable={isPreviewing}
            onUpdate={(markdown) => {
              node.content = markdown;
              store.onRefresh();
            }}
          />
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

Question.propTypes = propTypes;
export default Question;
