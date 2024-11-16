import { useSelector } from 'react-redux';
import { NOTIFICATION_API_END_POINT } from '@/utils/constant';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { user } = useSelector(store => store.auth);
    
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = user?.id;
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate(); // Use useNavigate hook for redirection

    // Function to mark notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.post(`${NOTIFICATION_API_END_POINT}/markAsRead/${notificationId}`, { withCredentials: true });

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === notificationId ? { ...notification, isRead: true } : notification
                )
            );

            setUnreadCount((prevCount) => prevCount - 1);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

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

    // Reset unread count to 0 when on the notifications page
    useEffect(() => {
        if (location.pathname.includes(`/b/notifications/${user.id}`)) {
            setUnreadCount(0);
        }
    }, [location, user.id]);

    // Handle notification click to navigate to specific post
    const handleNotificationClick = (notification) => {
        if (notification.postId) {
            // Assuming the notification contains a 'postId' field
            navigate(`/posts/${notification.postId}`); // Redirect to the specific post page
        } else {
            // Handle other types of notifications here
            console.log("Notification clicked, but no postId associated");
        }
    };

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
                                notification.isRead ? 'bg-gray-700' : 'bg-gray-800'
                            }`}
                            onClick={() => {
                                markNotificationAsRead(notification._id);
                                handleNotificationClick(notification);
                            }}
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
