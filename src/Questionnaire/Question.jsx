import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { TreeContext, ContentContext } from '../Store';
import { saveNodeContent, updateNodeContent } from '../lib/parse';
import BigButton from './BigButton'
import { QuestionBox } from './lib'
import './Questionnaire.css'
import Content from './Content'
import { message } from 'antd';

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
  const { tree } = store;
  const treeId = tree[0].root.id;
  const nodeId = node.id;
  const content = useContext(ContentContext);
  const thisContent = content.state && content.state.find(c => c.nodeId === node.id.toString());
  const contentId = thisContent && thisContent.objectId;

  const [saving, setSaving] = React.useState(false);

  const buttons = node.options && node.options.map((option, index) => <BigButton
    key={index}
    label={option.title}
    nodeId={option.id}
    onPressed={() => {
      onClickNode(option);
    }}
    style={{
      width: node.options.length === 2 && '47%',
      color: node.background || '#111',
      background: node.color || 'white',
      margin: node.options.length === 2 ? '5px' : '5px 0',
    }}
  />);

  const saveContentText = (text) => {
    setSaving(true);
    saveNodeContent({
      treeId,
      nodeId,
      content: {
        markdown: text
      }
    })
    .catch((e) => {
      setSaving(false);
      message.error(e)}
    )
    .then((response) => {
      setSaving(false);
      content.setState(response);
    });
  }

  const updateContentText = (text) => {
    setSaving(true);
    updateNodeContent({
      contentId,
      content: {
        markdown: text
      }
    })
    .catch((e) => {
      setSaving(false);
      message.error(e)}
    )
    .then((response) => {
      setSaving(false);
      content.setState(response);
    });
  }

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
          {!saving && <Content
            node={node}
            content={thisContent}
            editable={isPreviewing}
            onSave={saveContentText}
            onUpdate={updateContentText}
          />}
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
