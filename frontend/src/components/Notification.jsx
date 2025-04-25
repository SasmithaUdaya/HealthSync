import React from 'react';
import { markNotificationAsRead, deleteNotification } from '../api/api';
import { CheckCircle, Trash } from 'lucide-react';

const Notification = ({ notification, onDelete }) => {
    const handleMarkAsRead = async () => {
        try {
            await markNotificationAsRead(notification.id);
            onDelete(notification.id);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteNotification(notification.id);
            onDelete(notification.id);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };
    console.log(notification)

    return (
        <div className="flex justify-between items-center bg-black text-white p-4 rounded-lg shadow-md mb-2">
           
            <div className="flex items-center space-x-2">
                <CheckCircle className={`text-xl ${notification.read ? 'text-green-500' : 'text-gray-500'}`} />
                <p className={notification.read ? 'text-gray-400 line-through' : 'text-gray-300'}>
                    {notification.message}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
                {!notification.read && (
                    <button
                        onClick={handleMarkAsRead}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition"
                    >
                        Mark as Read
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                >
                    <Trash className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default Notification;