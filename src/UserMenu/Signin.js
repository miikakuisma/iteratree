
import React, {useState } from "react";
import { UIContext } from '../Store';
import { Space, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { signIn } from "../lib/parse";
import "../styles.css";

export default function Signin({ onSuccess, onError }) {
  const UI = React.useContext(UIContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    signIn({
      username: username,
      password: password,
      onSuccess: (response) => {
        UI.setState({
          loggedIn: true,
          user: response
        });
      },
      onError: () => {
        UI.setState({
          loggedIn: false,
          user: null
        });
      }
    });
  }

  return (
    <div>
      <Space>
        <Input size="large" placeholder="username" prefix={<UserOutlined />} defaultValue={username} onChange={(e) => { setUsername(e.target.value) }} />
        <Input.Password size="large" placeholder="password" prefix={<LockOutlined />} defaultValue={password} onChange={(e) => { setPassword(e.target.value) }} />
        <Button type="primary" onClick={handleSignIn}>Sign In</Button>
      </Space>
    </div>
  );
}