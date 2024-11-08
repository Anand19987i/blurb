import React from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';

const CreatePost = () => {
    const { user } = useSelector((store) => store.auth);

    return (
        <div className='bg-slate-900 flex flex-col mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 my-3 rounded-md p-5 items-start'>
            <div className="flex items-center gap-4 w-full mb-4">
                <Avatar className='cursor-pointer'>
                    <AvatarImage src={user?.avatar} />
                </Avatar>
                <input 
                    className='flex-grow text-md p-2 rounded-md outline-none bg-gray-100 text-gray-800 placeholder-gray-500' 
                    type="text" 
                    placeholder='What do you want to ask or share?' 
                />
            </div>

            {/* Buttons Section */}
            <div className="flex gap-6 w-full justify-start">
                <button className="px-4 py-2 rounded-full border border-gray-300 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700">
                    Ask
                </button>
                <button className="px-4 py-2 rounded-full border border-gray-300 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700">
                    Answer
                </button>
                <button className="px-4 py-2 rounded-full border border-gray-300 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700">
                    Post
                </button>
            </div>
        </div>
    );
}

export default CreatePost;
