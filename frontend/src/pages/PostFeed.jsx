// src/components/PostFeed.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postSlice';  // Import the fetchPosts action
import PostCard from './PostCard';  // Import the PostCard component

const PostFeed = () => {
    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector(store => store.post);

    useEffect(() => {
        dispatch(fetchPosts()); 
        console.log(store.getState().post);  // Check the Redux state for posts
    }, [dispatch]);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>{error}</p>;

    // Ensure posts is an array before checking its length
    const postList = Array.isArray(posts) ? posts : [];

    return (
        <div className="pb-2">
            {postList.length > 0 ? (
                postList.map((post) => (
                    <PostCard key={post._id} post={post} />  // Render each post using PostCard
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default PostFeed;
