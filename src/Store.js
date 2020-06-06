import React from "react";
import { tutorial } from "./lib/examples";

export let TreeContext = React.createContext();
export let UIContext = React.createContext();

export const initialAppState = tutorial;

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
  activeUiSection: null,
  user: null,
  myTrees: [],
  myImages: []
}
