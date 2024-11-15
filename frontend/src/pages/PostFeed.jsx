// src/components/PostFeed.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedPosts, fetchUserPosts } from '../redux/postSlice';
import PostCard from './PostCard';  //
import store from '../redux/store';

const PostFeed = () => {
    const dispatch = useDispatch();
    const { feedPosts, loading, error } = useSelector(store => store.post);
    const {user} = useSelector(store => store.auth);

    useEffect(() => {
        dispatch(fetchFeedPosts());
    }, [dispatch]);
    

    if (loading) return  <div className="spinner animate-spin border-t-4 border-gray-300 border-solid w-3 h-3 rounded-full mx-auto"></div>
    if (error) return <p className='text-gray-500 text-center'>{error}</p>;

    const postList = Array.isArray(feedPosts) ? feedPosts : [];

    return (
        <div className="pb-2">
            {postList.length > 0 ? (
                postList.map((post) => (
                    <PostCard key={post._id} post={post} />  // Render each post using PostCard
                ))
            ) : (
                <p className='text-gray-500'>No posts available</p>
            )}
        </div>
    );
};

export default PostFeed;
