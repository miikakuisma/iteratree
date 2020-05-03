import React from "react";
import { blank } from "./TopMenu/Examples";

export let TreeContext = React.createContext();
export let UIContext = React.createContext();

export const initialAppState = blank;
export const initialUIState = {
  questionnaire: false,
  shortcuts: false,
  userModal: false,
  codeModal: false,
  loggedIn: false,
  user: null,
  myTrees: []
}
