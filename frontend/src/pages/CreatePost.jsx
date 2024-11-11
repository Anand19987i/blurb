import React, { useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { FaQuestionCircle, FaCommentAlt, FaShareSquare } from 'react-icons/fa';
import CreatePostDialog from './CreatePostDialog';

const CreatePost = () => {
    const { user } = useSelector((store) => store.auth);
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-slate-900 flex flex-col mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 my-3 rounded-md p-5 items-start">
            <div className="flex items-center gap-4 w-full mb-4">
                <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.avatar} />
                </Avatar>
                <input 
                    className="flex-grow text-md p-2 border border-gray-600 rounded-lg outline-none bg-gray-900 text-gray-200 placeholder-gray-200"
                    type="text"
                    placeholder="What do you want to ask or share?"
                    onClick={() => setOpen(true)} // Open the dialog on click
                />
            </div>

            {/* Buttons Section */}
            {/* <div className="flex gap-8 justify-between">
                <button type="button" onClick={() => setOpen(true)} className="text-gray-300 flex items-center gap-3">
                    <FaQuestionCircle /> Ask
                </button>
                <button type="button" onClick={() => setOpen(true)} className="text-gray-300 flex items-center gap-3">
                    <FaCommentAlt /> Answer
                </button>
                <button type="button" onClick={() => setOpen(true)} className="text-gray-300 flex items-center gap-3">
                    <FaShareSquare /> Post
                </button>
            </div> */}

            {/* Create Post Dialog */}
            <CreatePostDialog open={open} setOpen={setOpen} />
        </div>
    );
}

export default CreatePost;
