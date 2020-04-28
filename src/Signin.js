
import React, { useRef } from "react";
import { UIContext } from './Store';
import { signIn } from "./lib/user";
import "./styles.css";

export default function Signin({ onSuccess, onError }) {
  const UI = React.useContext(UIContext);

  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSignIn = () => {
    signIn({
      username: usernameRef.current.value,
      password: passwordRef.current.value,
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
      <input
        type="text"
        ref={usernameRef}
      />
      <input
        type="password"
        ref={passwordRef}
      />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}