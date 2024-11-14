import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

// Search users by query
export const searchUsers = createAsyncThunk(
  'auth/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/search`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
        params: { query },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${USER_API_END_POINT}/profile/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      // After a successful profile update
      dispatch(setUser(response.data.user));
      ; // Returning updated user data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    token: null,
    error: "",
    searchResults: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update the user data after a successful profile update
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error if profile update fails
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload; // Store search results
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.error = action.payload; // Set error if search fails
      });
  },
});

export const { setLoading, setUser, setToken, setError, setSearchResults } = authSlice.actions;
export default authSlice.reducer;
