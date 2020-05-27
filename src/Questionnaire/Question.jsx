import React, { useContext, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { TreeContext } from '../Store';
import BigButton from './BigButton'
import { QuestionBox } from './lib'
import './Questionnaire.css'
import Content from '../Content'
import { getImage } from '../lib/parse';

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
  const { onAddHistory } = store;

  const boxRef = useRef(null);
  const buttonsRef = useRef(null);

  const [background, setBackground] = useState(null);

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

  const [buttonStyle, setButtonStyle] = useState({});

  React.useEffect(() => {
    if (boxRef.current && buttonsRef.current && (boxRef.current.offsetHeight + buttonsRef.current.offsetHeight) < window.innerHeight) {
      setButtonStyle({
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
      })
    } else {
      setButtonStyle({
        position: 'relative'
      })
    }
    if (node.content && node.content.find(c => c.type === 'background')) {
      getImage({ id: node.content.find(c => c.type === 'background').value })
      .catch(() => {
        setBackground(null)
      })
      .then((response) => {
        if (response) {
          setBackground(response.photo.url);          
        }
      });  
    } else {
      setBackground(null)
    }
  }, [node]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div
        className="boxContainer"
        ref={boxRef}
      >
        <div className="background"
          style={{
            backgroundImage: `url(${background})`,
            backgroundColor: node.background || '#111111',
          }}
        />
        {background &&  <div className="background overlay"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />}
        {node.title && <QuestionBox
          className="box"
          pose={isVisible ? 'visible' : 'hidden'}
        >
          <span className="title">&nbsp;</span>
          {/* <p
            className="question"
            style={{
              color: node.color || 'white'
            }}
          >{node.title}</p> */}
          <Content
            content={node.content}
            editable={isPreviewing}
            onUpdate={(newContent) => {
              onAddHistory();
              node.content = newContent;
              // Update node title when the first title element is updated
              if (newContent.find(c => c.type === 'title')) {
                node.title = newContent.find(c => c.type === 'title').value;
              }
              store.onRefresh();
            }}
          />
        </QuestionBox>}
      </div>
      {buttons && <div
        ref={buttonsRef}
        className="buttons"
        style={{
          flexDirection: node.options && node.options.length > 2 ? 'column' : 'row',
          ...buttonStyle
        }}
      >
        {buttons}
      </div>}
    </div>
  )
}

Question.propTypes = propTypes;
export default Question;
