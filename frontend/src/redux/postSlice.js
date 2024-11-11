import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { POST_API_END_POINT, USER_API_END_POINT } from "../utils/constant";

const postSlice = createSlice({
    name: "post",
    initialState: {
        loading: false,
        posts: [],
        userProfile: null, // Add state for user profile
        error: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setUserProfile: (state, action) => { // Add a new action to set user profile
            state.userProfile = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setLoading, setPosts, setUserProfile, setError } = postSlice.actions;

// Fetch posts from the feed
export const fetchPosts = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.get(`${POST_API_END_POINT}/v/feed`);
        console.log('Fetched Posts:', response.data.posts); // Log response to inspect the data
        dispatch(setPosts(response.data.posts));
    } catch (error) {
        dispatch(setError("Failed to fetch posts"));
    } finally {
        dispatch(setLoading(false));
    }
};


// Fetch posts by a specific user
export const fetchUserPosts = (userId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.get(`${POST_API_END_POINT}/posts/user/${userId}`);
        dispatch(setPosts(response.data.posts));
    } catch (error) {
        console.error("Failed to fetch user posts", error);
        dispatch(setError("Failed to fetch user posts"));
    } finally {
        dispatch(setLoading(false));
    }
};
export const fetchUserProfile = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${USER_API_END_POINT}/search/profile/${userId}`);
    dispatch(setUserProfile(response.data)); // Dispatch user and posts to the Redux store
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    dispatch(setError('Failed to fetch user profile'));
  } finally {
    dispatch(setLoading(false));
  }
};


export default postSlice.reducer;
