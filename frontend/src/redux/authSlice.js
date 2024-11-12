import { USER_API_END_POINT } from "@/utils/constant";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const searchUsers = createAsyncThunk(
  'auth/searchUsers',
  async (query, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/search`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }, withCredentials: true,
        params: {query}
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null, // Set initial user state as null
    token: null,
    error: "",
    searchResults : [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token =action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSearchResults :(state, action) => {
      state.searchResults = action.payload;
    }
  },
  
});

export const { setLoading, setUser, setToken, setError, setSearchResults } = authSlice.actions;
export default authSlice.reducer;
