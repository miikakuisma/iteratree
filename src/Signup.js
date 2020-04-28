import React, { useState } from "react";
import { UIContext } from './Store';
import { Layout } from 'antd';
import { signUp } from "./lib/user";
import "./styles.css";

const { Content } = Layout;

export default function Signup({ onSuccess, onError }) {
  const UI = React.useContext(UIContext);

  const handleSignUp = () => {
    signUp({
      username: "miika",
      password: "miika_dev",
      onSuccess: (response) => {
        UI.setState({
          loggedIn: true,
          user: response.payload
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
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
