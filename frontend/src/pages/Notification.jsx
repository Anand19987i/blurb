import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Notifications from './Notifications';
import { useSelector } from 'react-redux';
import Navbar from '@/shared/Navbar';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const {user} = useSelector(store => store.auth);// Fetch from local storage or state
    const userId = user?.id;

    useEffect(() => {
        // If the user is on the notifications page, reset unread count to 0
        if (location.pathname.includes(`$/b/notifications/${user.id}`)) {
          setUnreadCount(0);
        }
      }, [location]);
    useEffect(() => {
        const socket = io('http://localhost:5173');

        socket.on('newNotification', (data) => {
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                data,
            ]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className='bg-gray-950'>
            <Navbar/>
        <div className="my-2 p-3 min-h-screen">
            <Notifications userId={userId} />
        </div>
        </div>
    );
};

export default Notification;
