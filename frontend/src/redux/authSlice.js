import { USER_API_END_POINT } from "@/utils/constant";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null, // Set initial user state as null
    error: "",
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  
});

export const { setLoading, setUser, setError } = authSlice.actions;
export default authSlice.reducer;
