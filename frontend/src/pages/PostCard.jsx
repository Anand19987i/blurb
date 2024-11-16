import React, { useState, useEffect } from 'react';
import { MdThumbUp, MdOutlineThumbUp, MdComment, MdShare } from 'react-icons/md';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { POST_API_END_POINT } from '../utils/constant';

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [liked, setLiked] = useState(post.likes?.includes(user?.id) || false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [commentInput, setCommentInput] = useState('');
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : 0);


    useEffect(() => {
        if (post.likes && user) {
            setLiked(post.likes.includes(user.id));
        }
    }, [post.likes, user]);


    useEffect(() => {
        // Update the comments state whenever post.comments changes
        if (post.comments) {
            setComments(post.comments);
        }
    }, [post.comments]);

    const handleCommentClick = () => {
        setShowComments(!showComments);
    };

    const handleCommentInputChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handleAddComment = async () => {
        if (commentInput.trim()) {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                // Create the new comment with user info (name and avatar from the logged-in user)
                const newComment = {
                    user: { _id: user.id, name: user.name, avatar: user.avatar }, // Correctly using logged-in user data
                    text: commentInput,
                };

                // Optimistically update the UI by adding the new comment
                setComments((prevComments) => [...prevComments, newComment]);

                // Send the comment to the server
                const response = await axios.post(
                    `${POST_API_END_POINT}/posts/${post._id}/comment`,
                    { userId: user.id, text: commentInput },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Update comments with the latest response data from the server
                setComments(response.data.comments);
                setCommentInput('');  // Clear the input field

            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    const handleLikeClick = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('No token found');
            return;
        }
        setLikesCount(likesCount + 1);
        setLiked(true);
        try {
            await axios.post(`${POST_API_END_POINT}/posts/${post._id}/like`, { userId: user.id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
        } catch (error) {
            console.error('Error liking post:', error);
            setLikesCount(likesCount - 1);
            setLiked(false);
        }
    };

    const handleUnlikeClick = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('No token found');
            return;
        }
        setLikesCount(likesCount - 1);
        setLiked(false);

        try {
            const response = await axios.post(
                `${POST_API_END_POINT}/posts/${post._id}/like`,
                { userId: user.id },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            setLikesCount(response.data.post.likes.length);
            setLiked(false);
        } catch (error) {
            console.error('Error unliking post:', error);
            setLikesCount(likesCount + 1);
            setLiked(true);
        }
    };

    const handleShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this post on Blurb!',
                text: 'Here’s a great post you might like on Blurb.',
                url: window.location.href,
            }).then(() => console.log('Post shared successfully!'))
                .catch((error) => console.log('Error sharing:', error));
        } else {
            console.log('Share not supported on this browser.');
        }
    };

    const formattedTime = moment(post.createdAt).fromNow();

    const handleReadMoreToggle = () => {
        setIsContentExpanded(!isContentExpanded);
    };

    const truncatedContent = post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content;

    return (
        <div className="bg-slate-900 flex flex-col mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 my-3 rounded-sm p-4">
            <div className="flex gap-3 items-center p-3">
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src={post?.userId?.avatar || '/default-avatar.png'} />
                </Avatar>
                <div className="text-white text-sm sm:text-md">
                    <p className="font-semibold">{post?.userId?.name || 'Anonymous'}</p>
                    <span className="text-xs text-gray-300 sm:text-sm">{formattedTime}</span>
                </div>
            </div>

            <div className="text-white px-3 text-sm sm:text-base md:px-4">
                <p>
                    {isContentExpanded ? post.content : truncatedContent}
                    {post.content.length > 200 && (
                        <button
                            onClick={handleReadMoreToggle}
                            className="text-blue-400 text-sm ml-2"
                        >
                            {isContentExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    )}
                </p>
            </div>

            {post.imageUrl && (
                <div className="my-2">
                    <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-full h-auto rounded-md"
                    />
                </div>
            )}

            <div className="flex items-center justify-around sm:justify-between p-3">
                <button onClick={liked ? handleUnlikeClick : handleLikeClick} className={`flex items-center gap-2 p-2 rounded-md ${liked ? 'text-blue-500' : 'text-gray-400'}`}>
                    {liked ? <MdThumbUp size={20} /> : <MdOutlineThumbUp size={20} />}
                    <span>{likesCount} {liked ? 'Like' : 'Like'}</span>
                </button>

                <button onClick={handleCommentClick} className="flex items-center gap-2 p-2 rounded-md text-gray-400">
                    <MdComment size={20} />
                    <span>Comment</span>
                </button>

                <button onClick={handleShareClick} className="flex items-center gap-2 p-2 rounded-md text-gray-400">
                    <MdShare size={20} />
                    <span>Share</span>
                </button>
            </div>

            {showComments && (
                <div className="px-4 py-2">
                    <input
                        type="text"
                        value={commentInput}
                        onChange={handleCommentInputChange}
                        placeholder="Write a comment..."
                        className="w-full p-2 bg-slate-800 text-white rounded-md text-sm"
                    />
                    <button onClick={handleAddComment} className="mt-2 bg-blue-500 text-white p-2 rounded-md w-full text-sm">
                        Add Comment
                    </button>

                    {comments.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h3 className="text-white text-lg">Comments</h3>
                            {comments.map((comment) => (
                                <div key={comment._id} className="flex items-start gap-2 mt-2">
                                    {/* Check if the user data is available */}
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage
                                            src={comment.user ? comment.user.avatar || '/default-avatar.png' : '/default-avatar.png'}
                                            alt={comment.user ? comment.user.name : 'Anonymous'}
                                        />
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-white font-semibold">
                                            {comment.user ? comment.user.name : 'Anonymous'}
                                        </p>
                                        <p className="text-xs text-gray-300">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default PostCard;
