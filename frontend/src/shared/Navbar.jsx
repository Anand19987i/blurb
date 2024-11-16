import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AiFillHome } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { LogOut, User2 } from 'lucide-react';
import axios from 'axios';
import { USER_API_END_POINT, NOTIFICATION_API_END_POINT } from '@/utils/constant';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IoMdNotifications } from "react-icons/io";
import { FaBell } from 'react-icons/fa';
import { BiSolidBell, BiSolidHome } from "react-icons/bi";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputVisible, setSearchInputVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications and update unread count
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`${NOTIFICATION_API_END_POINT}/b/notifications/${user.id}`, { withCredentials: true });
          setNotifications(response.data.notifications);
          const unreadNotifications = response.data.notifications.filter(n => !n.isRead);
          setUnreadCount(unreadNotifications.length);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [user]);

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

  const logoutHandler = async () => {
    try {
      await axios.post(`${USER_API_END_POINT}/logout`);
      localStorage.removeItem('user');
      dispatch(setUser(null));
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="bg-gray-900 sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">Blurb</Link>

        {/* Search */}
        {/* Search */}
        <div className="relative flex justify-center items-center">
          <IoSearch
            className="h-8 w-8 text-white cursor-pointer"
            onClick={() => setSearchInputVisible((prev) => !prev)}
          />
          {searchInputVisible && (
            <div className="absolute top-12 transform -translate-x-1/2 left-1/2 bg-gray-800 p-3 rounded-lg shadow-lg w-60 sm:w-80">
              <div className="flex items-center bg-gray-900 px-3 py-2 rounded-lg">
                <IoSearch className="h-6 w-6 text-gray-400" />
                <input
                  className="bg-transparent p-2 text-white outline-none w-full"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <Link
                      to={`/search/profile/${result._id}`}
                      key={result._id}
                      className="flex items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      <Avatar className="mr-3">
                        <AvatarImage src={result.avatar || '/default-avatar.png'} />
                      </Avatar>
                      <p className="text-white">{result.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>


        {/* Icons */}
        <div className="flex items-center justify-center gap-6">
          <div className='flex gap-5 '>
            <Link to="/"><BiSolidHome className="h-8 w-8 text-white" /></Link>
            <Link to={`/b/notifications/${user?.id}`} onClick={() => setUnreadCount(0)}>
              <button className="relative">
                <BiSolidBell className="h-8 w-8 text-white cursor-pointer" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatar || '/default-avatar.png'} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="bg-gray-900 border-gray-800">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || '/default-avatar.png'} />
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-gray-300 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-white flex my-4 gap-1">
                    <User2 />
                    <Link to={`/profile/${user.id}`}>
                      <button className="text-white outline-none bg-none">View Profile</button>
                    </Link>
                  </div>
                  <div className="text-white flex my-4 gap-1">
                    <LogOut />
                    <button onClick={() => logoutHandler()} className="text-white outline-none bg-none">Logout</button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
