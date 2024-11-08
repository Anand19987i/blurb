import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Navbar from '@/shared/Navbar';
import { Pen } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UpdateProfileDialog from './UpdateProfileDialog';

const ViewProfile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='w-screen h-screen bg-slate-900'>
            <Navbar />
            <div className="flex flex-col items-center mt-7 p-5 md:w-1/2 lg:w-1/3 bg-slate-950 mx-auto text-white shadow-lg rounded-lg">
                <div className="flex flex-col md:flex-row md:gap-7 items-center">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                    </Avatar>
                    <div className="flex flex-col my-3 text-center md:text-left">
                        <h1 className='text-xl font-semibold'>{user?.name}</h1>
                        <p className='text-lg font-light'>{user?.email}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <Button onClick={() => setOpen(true)} variant='outline' className='text-black'>
                        <Pen /> Edit Profile
                    </Button>
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default ViewProfile;