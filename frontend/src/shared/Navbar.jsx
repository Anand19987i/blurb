import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';  // To access Redux store
import { USER_API_END_POINT } from '@/utils/constant';  // Replace with your actual API endpoint
import { setUser } from '@/redux/authSlice';  // Redux action to set user
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';


const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(setUser(null));  // Clear user data from Redux
      navigate("/register");

    } catch (error) {
      console.log(error);

    }
  };


  return (
    <div className="flex bg-slate-950">
      {user ? (
        <div className="flex">
        <Avatar>
          <AvatarImage src={user?.avatar} alt={user?.name} />
        </Avatar>
        <Button variant="outline" onClick={logoutHandler}>Logout</Button>
      </div>
        
      ) : (
        <div className="flex gap-3">
          <Link to="/login"><Button variant="outline">Login</Button></Link>
          <Link to="/register"><Button variant="outline">SignUp</Button></Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
