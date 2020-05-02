import React, {useState } from "react";
import { UIContext } from '../Store';
import { Space, Input, Button, message, notification } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { resetPassword } from "../lib/parse";
import "../styles.css";

export default function Reset() {
  const UI = React.useContext(UIContext);

  const [email, setEmail] = useState('');

  const handleReset = () => {
    message.loading('Reseting password...');
    resetPassword({
      email,
      onSuccess: (response) => {
        message.destroy();
        notification.success({ message: "Password was reset", description: response });
      },
      onError: (error) => {
        message.destroy();
        notification.error({ message: "Couldn't reset...", description: error });
      }
    });
  }

  return (
    <div>
      <Space>
      <Input size="large" placeholder="e-mail" prefix={<MailOutlined />} defaultValue={email} onChange={(e) => { setEmail(e.target.value) }} />
        <Button type="primary" onClick={handleReset}>Reset Password</Button>
      </Space>
    </div>
  );
}