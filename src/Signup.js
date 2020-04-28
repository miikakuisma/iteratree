import React, { useState } from "react";
import { UIContext } from './Store';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Space, Input, Button, notification } from 'antd';
import { signUp } from "./lib/user";
import "./styles.css";

export default function Signup({ onSuccess, onError }) {
  const UI = React.useContext(UIContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const isAllOk = () => {
    if (username && email && password.length > 3 && (password === password2)) {
      return true;
    } else {
      return false;
    }
  }

  const handleSignUp = () => {
    signUp({
      username,
      password,
      email,
      onSuccess: (response) => {
        console.log(response)
        window.location.reload();
      },
      onError: (error) => {
        notification.error({
          message: 'Error while creating account',
          description: error.toString(),
        });
      }
    });
  }

  return (
    <div>
      <Space direction="vertical">
        <Input size="large" placeholder="username" prefix={<UserOutlined />} defaultValue={username} onChange={(e) => { setUsername(e.target.value) }} />
        <Input size="large" placeholder="e-mail" prefix={<MailOutlined />} defaultValue={email} onChange={(e) => { setEmail(e.target.value) }} />
        <Input.Password size="large" placeholder="password" prefix={<LockOutlined />} defaultValue={password} onChange={(e) => { setPassword(e.target.value) }} />
        <Input.Password size="large" placeholder="password" prefix={<LockOutlined />} defaultValue={password2} onChange={(e) => { setPassword2(e.target.value) }} />
        <Button type="primary" disabled={!isAllOk()} onClick={handleSignUp}>Submit</Button>
      </Space>
    </div>
  );
}
