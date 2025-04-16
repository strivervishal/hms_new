const express = require('express');
const router = express.Router();

// Mock data for notifications
const notifications = [
  {
    id: 1,
    message: 'You have an appointment with Dr. Smith on April 10, 2025, at 10:00 AM.',
    type: 'appointment',
    read: false,
  },
  {
    id: 2,
    message: 'Your blood test results are now available.',
    type: 'test-result',
    read: false,
  },
  {
    id: 3,
    message: 'Your bill for $250 is due on April 15, 2025.',
    type: 'payment',
    read: true,
  },
];

// Route to fetch notifications
router.get('/notifications', (req, res) => {
  try {
    // Example: Filter unread notifications
    const unreadNotifications = notifications.filter((n) => !n.read);

    // Send the filtered notifications
    res.status(200).json(unreadNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Route to mark a notification as read
router.post('/notifications/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const notification = notifications.find((n) => n.id === parseInt(id));
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.read = true;
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

module.exports = router;