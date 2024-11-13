import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { POST_API_END_POINT, USER_API_END_POINT } from "../utils/constant";

const postSlice = createSlice({
    name: "post",
    initialState: {
        loading: false,
        feedPosts: [], // Separate state for feed posts
        userPosts: [], // Separate state for user posts
        userProfile: null,
        error: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setFeedPosts: (state, action) => { // Update feed posts
            state.feedPosts = action.payload;
        },
        setUserPosts: (state, action) => { // Update user-specific posts
            state.userPosts = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setLoading, setFeedPosts, setUserPosts, setUserProfile, setError } = postSlice.actions;

// Fetch posts for the feed page
export const fetchFeedPosts = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.get(`${POST_API_END_POINT}/v/feed`, { withCredentials: true });
        console.log('Fetched Feed Posts:', response.data.posts);
        dispatch(setFeedPosts(response.data.posts));
    } catch (error) {
        dispatch(setError(error.response?.data?.message || "Failed to fetch feed posts"));
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch posts by a specific user for profile view
export const fetchUserPosts = (userId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.get(`${POST_API_END_POINT}/posts/user/${userId}`, { withCredentials: true });
        console.log('Fetched User Posts:', response.data.posts);
        dispatch(setUserPosts(response.data.posts));
    } catch (error) {
        console.error("Failed to fetch user posts:", error);
        dispatch(setError(error.response?.data?.message || "Failed to fetch user posts"));
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch user profile
export const fetchUserProfile = (userId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.get(`${USER_API_END_POINT}/search/profile/${userId}`, { withCredentials: true });
        console.log('Fetched User Profile:', response.data);
        dispatch(setUserProfile(response.data));
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to fetch user profile'));
    } finally {
        dispatch(setLoading(false));
    }
};

export default postSlice.reducer;
