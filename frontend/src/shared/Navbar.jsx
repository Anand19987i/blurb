import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AiFillHome } from "react-icons/ai";
import { IoSearch, IoMenu } from "react-icons/io5";
import { LogOut } from 'lucide-react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(`${USER_API_END_POINT}/search?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
      }
    }
  }, [dispatch, user]);

  const logoutHandler = () => {
    dispatch(setUser(null));
    navigate("/login");
  };

  return (
    <div className="bg-gray-900 sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold text-white">Blurb</Link>

        <button
          className="text-white sm:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <IoMenu className="h-8 w-8" />
        </button>

        <div className="hidden sm:flex items-center gap-10">
          <Link to="/"><AiFillHome className="h-8 w-8 text-white" /></Link>
          <div className="flex items-center bg-gray-950 px-3 rounded-lg relative">
            <IoSearch className="h-6 w-6 text-white" />
            <input
              className="bg-gray-950 p-2 text-white outline-none"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
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
          {user ? (
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.avatar || '/default-avatar.png'} />
            </Avatar>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline" className="hidden sm:block">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="hidden sm:block bg-gray-800">Signup</Button>
              </Link>
            </div>
          )}
        </div>

        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-gray-900 p-4 flex flex-col gap-4 sm:hidden">
            <div className="flex items-center bg-gray-800 px-3 rounded-lg">
              <IoSearch className="h-6 w-6 text-white" />
              <input
                className="bg-gray-800 p-2 text-white outline-none w-full"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            {searchResults.length > 0 && (
              <div className="bg-gray-800 p-4 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
            <Link to="/" className="text-white flex mx-auto items-center gap-2" onClick={() => setMenuOpen(false)}>
              <AiFillHome className="h-6 w-6" /> Home
            </Link>
            {user && (
              <>
                <Link to={`/profile/${user.id}`} className="text-white mx-auto flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                  <Avatar className="mr-3">
                    <AvatarImage src={user.avatar || '/default-avatar.png'} />
                  </Avatar>
                  View Profile
                </Link>
                <button
                  className="text-white flex items-center mx-auto gap-2"
                  onClick={() => {
                    logoutHandler();
                    setMenuOpen(false);
                  }}
                >
                  <LogOut className="h-6 w-6" /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
