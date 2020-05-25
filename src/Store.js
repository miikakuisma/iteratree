import React from "react";
import { happy } from "./lib/examples";

export let TreeContext = React.createContext();
export let UIContext = React.createContext();

export const initialAppState = happy;

export const initialUIState = {
  loading: false,
  questionnaire: false,
  sidebarOpen: true,
  shortcuts: false,
  modalOpen: false,
  browserOpen: false,
  editingContent: false,
  userModal: false,
  codeModal: false,
  loggedIn: false,
  user: null,
  myTrees: [],
  myImages: []
}
