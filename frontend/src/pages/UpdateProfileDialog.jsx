import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        name: user?.name || "",
        email: user?.email || "",
        avatar: null
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, avatar: file });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("email", input.email);
        if (input.avatar) {
            formData.append("avatar", input.avatar);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user)); // assuming `res.data.user` contains updated user data
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-slate-950" aria-describedby={undefined} onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle className='text-white font-md'>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='flex flex-col gap-4'>
                        <div className="flex flex-col text-white">
                            <label>Name<span className="text-amber-500"> *</span></label>
                            <input 
                                type="text" 
                                placeholder="Enter your name" 
                                onChange={changeEventHandler} 
                                name="name" 
                                value={input.name} 
                                className="p-3 rounded-lg outline-none text-black" 
                                required 
                            />
                        </div>
                        <div className="flex flex-col text-white">
                            <label>Email<span className="text-amber-500"> *</span></label>
                            <input 
                                type="email" 
                                placeholder="Enter your valid email" 
                                onChange={changeEventHandler} 
                                name="email" 
                                value={input.email} 
                                className="p-3 rounded-lg outline-none text-black" 
                                required 
                            />
                        </div>
                        <div className="flex flex-col text-white">
                            <label>Profile Image<span className="text-amber-500"> *</span></label>
                            <input 
                                type="file" 
                                onChange={fileChangeHandler} 
                                name="avatar" 
                                accept="image/*" 
                                className="p-3 rounded-lg outline-none text-slate-900 bg-white cursor-pointer" 
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-5">
                        <button type="submit" disabled={loading} className='bg-white text-black px-3 p-1 rounded-md font-semibold'>
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
