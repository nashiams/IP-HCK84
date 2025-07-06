import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requirements: "",
  code: "",
  loading: false,
  error: null,
  analysisResult: null,
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setRequirements: (state, action) => {
      state.requirements = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAnalysisResult: (state, action) => {
      state.analysisResult = action.payload;
    },
    clearAll: (state) => {
      state.requirements = "";
      state.code = "";
      state.analysisResult = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setRequirements,
  setCode,
  setLoading,
  setError,
  setAnalysisResult,
  clearAll,
  clearError,
} = codeSlice.actions;

export default codeSlice.reducer;
