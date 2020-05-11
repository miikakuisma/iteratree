import React from "react";
import { tutorial } from "./TopMenu/Examples";

export let TreeContext = React.createContext();
export let UIContext = React.createContext();

export const initialAppState = tutorial;
export const initialUIState = {
  loading: false,
  questionnaire: false,
  shortcuts: false,
  modalOpen: false,
  userModal: false,
  codeModal: false,
  loggedIn: false,
  user: null,
  myTrees: []
}
