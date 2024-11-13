import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Navbar from '@/shared/Navbar';
import { Pen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UpdateProfileDialog from './UpdateProfileDialog';
import { fetchUserPosts } from '../redux/postSlice';
import UserPostCard from './UserPostCard';

const ViewProfile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts, loading } = useSelector(store => store.post);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user && user.id) {
            dispatch(fetchUserPosts(user.id));
        }
    }, [dispatch, user]);

    return (
        <div className="w-full min-h-screen bg-gray-950 pb-5">
            <Navbar />
            <div className="flex flex-col items-center mt-2 p-4 w-full sm:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto bg-slate-900 text-white shadow-lg rounded-lg">
                <div className="flex flex-col md:flex-row md:gap-7 items-center text-center md:text-left"> {/* Add relative positioning */}
                    <Avatar className="w-24 h-24 md:w-32 md:h-32">
                        <AvatarImage src={user?.avatar || '/default-avatar.png'} alt={user?.name} className='z-auto' />
                    </Avatar>
                    <div className="flex flex-col my-3">
                        <h1 className="text-2xl font-semibold">{user?.name}</h1>
                        <p className="text-lg font-light">{user?.email}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <Button onClick={() => setOpen(true)} variant="outline" className=" text-black flex items-center gap-2">
                        <Pen /> Edit Profile
                    </Button>
                </div>
            </div>

            {/* Display user's posts */}
            <div className="mx-auto mt-8 px-4 sm:px-8">
                <h2 className="text-2xl font-semibold mb-6 lg:text-center md:text-center sm:text-center text-white">Posts by {user?.name}</h2>
                {loading ? (
                    <p className="text-center text-gray-400">Loading posts...</p>
                ) : (
                    <div className="space-y-6">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <UserPostCard key={post._id} post={post} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No posts available.</p>
                        )}
                    </div>
                )}
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default ViewProfile;
