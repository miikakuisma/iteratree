import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Button, Menu, Dropdown, message } from 'antd';
import { SettingFilled, LoadingOutlined } from '@ant-design/icons';
import { getImage, saveImage } from '../lib/parse';

const propTypes = {
  index: PropTypes.number,
  editing: PropTypes.bool,
  editable: PropTypes.bool,
  content: PropTypes.string,
  onStartEditing: PropTypes.func,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func
}

export function Photo({ index, editing, editable, content, onStartEditing, onChange, onCancel, onDelete, onMoveUp, onMoveDown }) {

  const [photo, setPhoto] = useState(null);
  const [enableUpload, setEnableUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Photo">
        <Menu.Item key="1" onClick={() => onMoveUp(index)}>Move Up</Menu.Item>
        <Menu.Item key="2" onClick={() => onMoveDown(index)}>Move Down</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3"onClick={() => onDelete(index)}>Remove</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async function handleUpload() {
    setUploading(true);
    const file = document.querySelector('#myfile').files[0];
    saveImage({
      name: file.name,
      type: file.type,
      size: file.size,
      base64: await toBase64(file)
    })
    .catch((error) => {
      message.error(error);
      setUploading(false);
    })
    .then((response) => {
      message.success("Image was uploaded");
      setUploading(false);
      onChange({ target: { value: response.objectId }});
    });
  }

  if (content) {
    getImage({ id: content })
    .then((response) => {
      setPhoto(response.photo.url);
    });  
  }

  if (editing) {
    return (
      <div className="photo-upload">
        <h3>Upload Photo</h3>
        <input type="file" id="myfile" onChange={() => { setEnableUpload(true) }} />
        <div style={{ margin: '30px 0 10px 0' }}>
          <Button onClick={onCancel}>Cancel</Button>
          &nbsp;
          <Button type="primary" icon={uploading && <LoadingOutlined />} disabled={!enableUpload} onClick={handleUpload}>Upload &amp; Add</Button>
        </div>
      </div>
    )
  }

  if (content) {
    return (    
      <div
        className={editable ? "the-content editable" : "the-content"}
        onClick={(e) => {
          if (!e.target.classList.contains("ant-dropdown-menu-item")) {
            onStartEditing();
          }
        }}
        style={{
          position: 'relative',
          color: '#949393',
          paddingTop: '3px'
        }}
      >
        <div className="photo"><img src={photo} /></div>
        {editable && <Dropdown overlay={menu} className="edit-icon"><SettingFilled /></Dropdown>}
      </div>
    )
  }

  return null;
}

Photo.propTypes = propTypes;
export default Photo;
