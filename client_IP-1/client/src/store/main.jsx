import { configureStore } from "@reduxjs/toolkit";
import todoistReducer from "./todoistSlice"; // Import your todoist slice
import codeReducer from "./codeSlice";

export const store = configureStore({
  reducer: {
    todoist: todoistReducer, // Add the todoist reducer here
    code: codeReducer,
    // You can add other reducers for auth, codeChecker, etc. here later
  },
  // DevTools are enabled by default in development
});
