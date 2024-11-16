import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find notifications for the given user
        const notifications = await Notification.find({ recipients: userId })
            .sort({ createdAt: -1 }) // Sort by most recent
            .select('-recipients');  // Exclude recipients field for privacy

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({
                message: "No notifications found.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Notifications fetched successfully.",
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
