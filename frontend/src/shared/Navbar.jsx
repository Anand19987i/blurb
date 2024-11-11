import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LogOut, User, User2, User2Icon } from 'lucide-react';
import { AiFillHome } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import axios from 'axios'; // Import axios for API requests
import { USER_API_END_POINT } from '@/utils/constant';

const Navbar = () => {
  const { user, loading, error } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Handle the search input change
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) { // Trigger search if query length is more than 2
      try {
        const response = await axios.get(`${USER_API_END_POINT}/search?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]); // Clear results if the query length is less than 3
    }
  };

  // Check if user is logged in from localStorage
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));  // Update Redux state from localStorage
      }
    }
  }, [dispatch, user]);

  const logoutHandler = async () => {
    dispatch(setUser(null));
    navigate("/login");
  };

  return (
    <div className="bg-gray-900 sticky">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 relative">
        <h1 className="text-2xl font-bold text-white">Blurb</h1>
        <div className='flex gap-10'>
          <Link to="/"><AiFillHome className="h-8 w-8 text-white" /></Link>
          <div className='flex items-center bg-gray-950 px-3 rounded-lg relative'>
            <IoSearch className="h-6 w-6 text-white" />
            <input
              className='bg-gray-950 p-2 text-white outline-none'
              placeholder='Search'
              value={searchQuery}
              onChange={handleSearchChange} // Trigger search on input change
            />
            {/* Display search results just below the input field */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 bg-gray-800 p-4 w-full max-h-60 overflow-y-auto rounded-md shadow-lg z-100">
                {searchResults.map(result => (
                  <Link to={`/search/profile/${result._id}`} key={result._id} className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
                    <Avatar className="mr-3">
                      <AvatarImage src={result.avatar || '/default-avatar.png'} />
                    </Avatar>
                    <p className="text-white">{result.name}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-12">
          {loading ? (
            <p>Loading...</p>
          ) : !user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="hidden sm:block">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="hidden bg-gray-800 sm:block">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.avatar} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-4 text-white bg-slate-950">
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={user?.avatar || '/default-avatar.png'} />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-md">{user?.name}</h3>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <User2 />
                    <Link to={`/profile/${user?.id}`}><button className="outline-none font-semibold">View Profile</button></Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <LogOut />
                    <button className="outline-none font-semibold" onClick={logoutHandler}>Logout</button>
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
