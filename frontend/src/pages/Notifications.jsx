import { useSelector } from 'react-redux';
import { NOTIFICATION_API_END_POINT } from '@/utils/constant';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
    // Get userId from Redux store
    const { user } = useSelector(store => store.auth);
    
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = user?.id;

    useEffect(() => {
        console.log("User ID from Redux before fetching notifications:", userId);
      
        if (!userId) {
            setError("Invalid user ID");
            setLoading(false);
            return;
        }
      
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(
                    `${NOTIFICATION_API_END_POINT}/b/notifications/${userId}`,
                    { withCredentials: true }
                );
                setNotifications(response.data.notifications);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setError("Failed to fetch notifications");
                setLoading(false);
            }
        };
      
        fetchNotifications();
    }, [userId]);
    useEffect(() => {
        // If the user is on the notifications page, reset unread count to 0
        if (location.pathname.includes(`$/b/notifications/${user.id}`)) {
          setUnreadCount(0);
        }
      }, [location]);

    if (loading) return (
        <div className="flex justify-center items-center">
            <div className="spinner animate-spin border-t-4 border-white-500 border-solid w-4 h-4 rounded-full"></div>
        </div>
    );

    if (error) return <p className="text-gray-300 text-center">{error}</p>;

    return (
        <div className="max-w-lg mx-auto p-4 bg-gray-900 border-gray-900 rounded shadow">
            <h2 className="text-lg font-semibold mb-4 text-white">Notifications</h2>
            {notifications.length > 0 ? (
                <ul>
                    {notifications.map((notification) => (
                        <li
                            key={notification._id}
                            className={`p-3 mb-2 rounded cursor-pointer transition hover:bg-gray-700 ${
                                notification.isRead ? 'bg-gray-100' : 'bg-gray-800'
                            }`}
                        >
                            <p className="text-white">{notification.message}</p>
                            <span className="text-sm text-gray-400">
                                {new Date(notification.createdAt).toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400 text-center">No notifications found.</p>
            )}
        </div>
    );
};

export default Notifications;
