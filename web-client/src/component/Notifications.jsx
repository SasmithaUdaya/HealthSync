import React, { useEffect, useState } from 'react';
import api from "../api/api.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      
      if (response.data && Array.isArray(response.data)) {
        const formattedNotifications = response.data.map((notif) => ({
          id: notif._id || notif.id,
          message: notif.message || 'No message',
          postId: notif.postId || 'N/A',
          // Ensure read is always a boolean
          read: Boolean(notif.read),
          createdAt: notif.createdAt || new Date().toISOString(),
        }));
        setNotifications(formattedNotifications);
      } else {
        throw new Error('Invalid notifications data format');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.response?.data?.message || 'Failed to load notifications');
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id, isRead) => {
    try {
      const response = await api.put(`/notifications/${id}/read`, { read: isRead });
      
      if (response.status === 200) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: isRead } : n)
        );
        toast.success(`Notification marked as ${isRead ? 'read' : 'unread'}`);
      }
    } catch (err) {
      console.error('Failed to update notification:', err);
      toast.error(err.response?.data?.message || 'Failed to update notification');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted successfully');
    } catch (err) {
      console.error('Failed to delete notification:', err);
      toast.error(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  if (loading) return <div className="p-4">Loading notifications...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications available</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-3 border rounded bg-white shadow-sm flex items-start justify-between ${
                notif.read ? 'opacity-75' : 'border-l-4 border-l-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(notif.read)} // Ensure boolean
                  onChange={(e) => markAsRead(notif.id, e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <p className="text-gray-800">{notif.message}</p>
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>Post ID: {notif.postId}</span>
                    <span>{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteNotification(notif.id)}
                className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 ml-4"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;