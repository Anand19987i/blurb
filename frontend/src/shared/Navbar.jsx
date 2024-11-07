import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

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
    navigate("/register");
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
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
              </Link>
            </div>
          ) : (
            <><Avatar className="cursor-pointer">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                </Avatar><div className='flex text-white gap-2'>
                    <h4>{user?.name}</h4>
                    <p>{user?.email}</p>
                    <Button onClick={logoutHandler}>
                      Logout
                    </Button>
                  </div></>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
