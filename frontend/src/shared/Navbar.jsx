import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LogOut, User, User2, User2Icon } from 'lucide-react';

const Navbar = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User state in Navbar:", user); // Debug line
  }, [user]);


  const logoutHandler = async () => {
    dispatch(setUser(null));
    localStorage.removeItem('user');
    navigate("/login");
  };

  return (
    <div className="bg-slate-950">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <h1 className="text-2xl font-bold text-white">Blurb</h1>
        <div className="flex items-center gap-12">
          {loading ? (
            <p>Loading...</p>
          ) : !user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className='cursor-pointer'>
                  <AvatarImage src={user?.avatar} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-4 text-white bg-slate-950">
                <div className='flex gap-4 items-center'>
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-md">{user?.name}</h3>
                    <p className='text-gray-400 text-sm'>{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className='flex items-center gap-2'>
                    <User2 />
                    <Link to={`/profile/${user.id}`}><button className='outline-none font-semibold'>View Profile</button></Link>
                  </div>
                  <div className='flex items-center gap-2'>
                    <LogOut />
                    <button className='outline-none font-semibold' onClick={logoutHandler}>Logout</button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
