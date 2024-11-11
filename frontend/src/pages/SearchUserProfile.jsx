import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Navbar from '@/shared/Navbar';
import { Pen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UpdateProfileDialog from './UpdateProfileDialog';
import { fetchUserPosts, fetchUserProfile } from '../redux/postSlice'; // Assuming you have fetchUserProfile action
import UserPostCard from './UserPostCard';
import { useParams } from 'react-router-dom'; // Import useParams to get route params

const SearchUserProfile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts, loading, error, userProfile } = useSelector(store => store.post); // Fetch userProfile from redux
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the user ID from the URL params

    useEffect(() => {
        if (id) {
            // Fetch posts and user profile based on the user ID in the URL
            dispatch(fetchUserPosts(id));
            dispatch(fetchUserProfile(id)); // Assuming a fetchUserProfile action
        }
    }, [dispatch, id]);

    const currentUser = user?.id === id; // Check if the profile being viewed is the logged-in user's profile

    if (error) {
        return <p className="text-center text-red-500">{error}</p>; // Show error message if any
    }

    return (
        <div className="w-full min-h-screen bg-gray-950 pb-5">
            <Navbar />
            <div className="flex flex-col items-center mt-2 p-4 w-full sm:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto bg-slate-900 text-white shadow-lg rounded-lg">
                <div className="flex flex-col md:flex-row md:gap-7 items-center text-center md:text-left">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32">
                        <AvatarImage src={userProfile?.avatar || '/default-avatar.png'} alt={userProfile?.name} />
                    </Avatar>
                    <div className="flex flex-col my-3">
                        <h1 className="text-2xl font-semibold">{userProfile?.name}</h1>
                        <p className="text-lg font-light">{userProfile?.email}</p>
                    </div>
                </div>
            </div>

            {/* Display user's posts */}
            <div className="mx-auto mt-8 px-4 sm:px-8">
                <h2 className="text-2xl font-semibold mb-6 text-white">Posts by {userProfile?.name}</h2>
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
        </div>
    );
};

export default SearchUserProfile;
