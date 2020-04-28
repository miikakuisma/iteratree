import React from "react";
import { blank } from "./Examples";

export let TreeContext = React.createContext();
export let UIContext = React.createContext();

export const initialAppState = blank;
export const initialUIState = {
  questionnaire: false,
  shortcuts: false,
  loggedIn: false,
  userID: null,
}
