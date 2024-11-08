import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MdThumbUp, MdOutlineThumbUp, MdComment, MdShare } from "react-icons/md";
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const PostCard = () => {
    const { user } = useSelector(store => store.auth)
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');

    const handleLikeClick = () => {
        setLiked(!liked);
    };

    const handleCommentClick = () => {
        setShowComments(!showComments);
    };

    const handleCommentInputChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handleAddComment = () => {
        if (commentInput.trim()) {
            setComments([...comments, commentInput]);
            setCommentInput('');
        }
    };

    const handleShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this post on Blurb!',
                text: 'Here’s a great post you might like on Blurb.',
                url: window.location.href,
            })
                .then(() => console.log('Post shared successfully!'))
                .catch((error) => console.log('Error sharing:', error));
        } else {
            console.log('Share not supported on this browser.');
        }
    };

    return (
        <div className='bg-slate-900 flex flex-col mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 my-3 rounded-sm p-4'>
            {/* Post Header */}
            <div className='flex gap-3 items-center p-3'>
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src="https://res.cloudinary.com/dh1yi22wx/image/upload/v1731054400/user_avatars/avatar_anandofficialxsrc%40gmail.com.jpg" />
                </Avatar>
                <div className='text-white text-sm sm:text-md'>
                    <p className='font-semibold'>Anand Pandey</p>
                    <span className='text-xs text-gray-300 sm:text-sm'>12h ago</span>
                </div>
            </div>

            {/* Post Content */}
            <div className='text-white px-3 text-justify text-sm sm:text-base md:px-4'>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit libero ut nulla cursus, id ornare odio suscipit.</p>
            </div>

            {/* Post Image */}
            {/* Post Image */}
            <div className='my-2'>
                <img
                    src="https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Post"
                    className='w-full h-60 object-cover rounded-md'
                />
            </div>


            {/* Action Buttons */}
            <div className='flex items-center justify-around sm:justify-between p-3'>
                <button
                    onClick={handleLikeClick}
                    className={`flex items-center gap-2 p-2 rounded-md ${liked ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    {liked ? <MdThumbUp size={20} /> : <MdOutlineThumbUp size={20} />}
                    <span>{liked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                    onClick={handleCommentClick}
                    className='flex items-center gap-2 p-2 rounded-md text-gray-400'
                >
                    <MdComment size={20} />
                    <span>Comment</span>
                </button>

                <button
                    onClick={handleShareClick}
                    className='flex items-center gap-2 p-2 rounded-md text-gray-400'
                >
                    <MdShare size={20} />
                    <span>Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className='px-4 py-2'>
                    {/* Comment Input */}
                    <input
                        type="text"
                        value={commentInput}
                        onChange={handleCommentInputChange}
                        placeholder="Write a comment..."
                        className='w-full p-2 bg-slate-800 text-white rounded-md text-sm'
                    />
                    <button onClick={handleAddComment} className='mt-2 bg-blue-500 text-white p-2 rounded-md w-full text-sm'>
                        Add Comment
                    </button>

                    {/* Display All Comments */}
                    {comments.length > 0 && (
                        <div className='mt-4 space-y-2'>
                            <h3 className='text-white text-lg'>Comments</h3>
                            {comments.map((comment, index) => (
                                <div key={index} className='flex items-start gap-2 mt-2'>
                                    <Avatar className='w-6 h-6'>
                                        <AvatarImage src={user?.avatar} />
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <p className='text-sm text-white font-semibold'>{user?.name}</p>
                                        <p className='text-xs text-gray-300'>{comment}</p>
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
