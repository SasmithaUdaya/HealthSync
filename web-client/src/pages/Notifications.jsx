import React, { useEffect, useState } from 'react';
import { fetchPosts, getNotificationForAUser } from '../api/api'; 
import Notification from '../components/Notification';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await getNotificationForAUser(); 
            setNotifications(response.data);
        };
        fetchNotifications();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div>
                {notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        notification={notification}
                        onDelete={() => {
                            setNotifications(
                                notifications.filter((n) => n.id !== notification.id)
                            );
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Notifications;