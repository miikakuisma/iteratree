import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input } from 'antd';
import {
  YoutubeOutlined,
} from '@ant-design/icons';

const propTypes = {
  editing: PropTypes.bool,
  editable: PropTypes.bool,
  content: PropTypes.string,
  onStartEditing: PropTypes.func,
  onChange: PropTypes.func
}

export function Video({ editing, editable, content, onStartEditing, onChange }) {

  const isYoutube = content && content.includes('youtube.com');
  const isVimeo = content && content.includes('vimeo.com');

  if (editing) {
    return (
      <Fragment>
        <Input
          placeholder="YouTube or Vimeo URL"
          autoFocus
          onBlur={onChange}
          defaultValue={content || ""}
        />
        <p style={{ color: 'rgba(255,255,255,0.5)'}}>Clear all text and leave editing to delete</p>
      </Fragment>
    )
  }

  if (content) {
    return (
      <div
        className={editable ? "the-content editable" : "the-content"}
        onClick={() => onStartEditing('video')}
      >
        {isYoutube && <iframe
          src={content.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')}
          frameBorder='0'
          allow='autoplay; encrypted-media'
          allowFullScreen
          title='video'
        />}
        {isVimeo && <iframe
          src={content.replace('https://vimeo.com/', 'https://player.vimeo.com/video/')}
          frameBorder='0'
          allow="autoplay; fullscreen"
          allowFullScreen
          title='video'
        >
        
        </iframe>}
        {editable && <YoutubeOutlined className="edit-icon" />}
      </div>
    )
  }

  return null;
}

Video.propTypes = propTypes;
export default Video;
