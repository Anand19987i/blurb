// src/components/PostFeed.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchUserPosts } from '../redux/postSlice';
import PostCard from './PostCard';  //
import store from '../redux/store';

const PostFeed = () => {
    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector(store => store.post);
    const {user} = useSelector(store => store.auth);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);
    

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>{error}</p>;

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
