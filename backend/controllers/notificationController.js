// controllers/notificationController.js
import Notification from "../models/Notification.js";
import Listing from "../models/Listing.js";

// 🟩 Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      include: [{ model: Listing, attributes: ["title"] }],
      order: [["createdAt", "DESC"]]
    });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const [updated] = await Notification.update(
      { read: true },
      { where: { id: req.params.id, userId: req.user.id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const notification = await Notification.findByPk(req.params.id);

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.user.id, read: false } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};