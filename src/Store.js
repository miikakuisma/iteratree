import React from "react";
import { happy } from "./TopMenu/Examples";

export let TreeContext = React.createContext();
export let ContentContext = React.createContext();
export let UIContext = React.createContext();

export const initialAppState = happy;
export const initialContentState = [];
export const initialUIState = {
  loading: false,
  questionnaire: false,
  sidebarOpen: true,
  shortcuts: false,
  modalOpen: false,
  userModal: false,
  codeModal: false,
  loggedIn: false,
  user: null,
  myTrees: []
}
