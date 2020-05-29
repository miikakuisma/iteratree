import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { getImage } from '../lib/parse';
import Library from "../Library";
import { ContentImage } from "../Questionnaire/lib/animations";

const propTypes = {
  index: PropTypes.number,
  editing: PropTypes.bool,
  content: PropTypes.string,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
}

export function Photo({ index, editing, content, onChange, onCancel, onDelete }) {
  const [image, setImage] = useState(null);

  const containerRef = useRef(null);

  React.useEffect(() => {
    if (content) {
      getImage({ id: content })
      .then((response) => {
        setImage(response);
      });  
    }
  }, [content])

  if (editing) {
    return (
      <Library
        selected={content}
        onCancel={onCancel}
        onDelete={() => {
          onDelete(index);
        }}
        onSelect={(id) => {
          onChange({
            target: { value: id }
          });
        }}
      />
    )
  }

  if (image) {
    const aspectRatio = image ? (image.width / image.height) : 0;
    const imageWidth = containerRef.current && containerRef.current.offsetWidth - 2;
    const imageHeight = containerRef.current && (imageWidth / aspectRatio);

    return (    
      <ContentImage className="photo">
        <img src={image && image.photo.url} width={imageWidth} height={imageHeight} />
      </ContentImage>
    )
  }

  return null;
}

Photo.propTypes = propTypes;
export default Photo;
