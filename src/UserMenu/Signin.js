import React, {useState } from "react";
import { UIContext } from '../Store';
import { Space, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { signIn, getMyTrees } from "../lib/parse";
import "../styles.css";

export default function Signin() {
  const UI = React.useContext(UIContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    message.loading('Signing in..');
    signIn({
      username: username,
      password: password,
      onSuccess: (response) => {
        getMyTrees({
          onSuccess: (response2) => {
            UI.setState({
              ...UI.state, 
              loggedIn: true,
              user: response,
              userModal: false,
              myTrees: response2
            });
            message.destroy();
          },
          onError: () => {
            message.destroy();
            // couldn't get the trees (maybe there was none)
          }
        });
      },
      onError: () => {
        UI.setState({
          ...UI.state, 
          loggedIn: false,
          user: null
        });
      }
    });
  }

  return (
    <div>
      <Space>
        <Input size="large" placeholder="username" prefix={<UserOutlined />} defaultValue={username} onChange={(e) => { setUsername(e.target.value) }} autoFocus />
        <Input.Password size="large" placeholder="password" prefix={<LockOutlined />} defaultValue={password} onChange={(e) => { setPassword(e.target.value) }} onPressEnter={handleSignIn} />
        <Button type="primary" onClick={handleSignIn}>Sign In</Button>
      </Space>
    </div>
  );
}