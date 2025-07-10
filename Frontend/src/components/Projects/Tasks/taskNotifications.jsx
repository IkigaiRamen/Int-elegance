import React, { useState, useEffect } from 'react';
import { getUserById } from '../../../services/UserService';

const TaskNotifications = ({ project }) => {
    const [userData, setUserData] = useState({});

    // Check if the project or notifications are undefined or null
    if (!project || !Array.isArray(project.notifications)) {
        return (
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                <div className="card">
                    <div className="card-header py-3">
                        <h6 className="mb-0 fw-bold">Recent Activity</h6>
                    </div>
                    <div className="card-body mem-list">
                        <div className="text-muted">No recent activity.</div>
                    </div>
                </div>
            </div>
        );
    }

    // Function to fetch user by ID
    const fetchUser = async (userId) => {
        try {
            const user = await getUserById(userId);
            setUserData(prevState => ({ ...prevState, [userId]: user }));
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        // Fetch user data for all users in the notifications
        project.notifications.forEach(notification => {
            if (notification.user && !userData[notification.user]) {
                fetchUser(notification.user);
            }
        });
    }, [project.notifications, userData]);

    return (
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
            <div className="card">
                <div className="card-header py-3">
                    <h6 className="mb-0 fw-bold">Recent Activity</h6>
                </div>
                <div className="card-body mem-list">
                    {project.notifications.length > 0 ? (
                        project.notifications.map((notification, index) => (
                            <div
                                key={index}
                                className={`timeline-item ${notification.type === 'info' ? 'ti-info' : 'ti-danger'} border-bottom ms-2`}
                            >
                                <div className="d-flex">
                                    <span
                                        className="avatar d-flex justify-content-center align-items-center rounded-circle"
                                        style={{ backgroundColor: getAvatarColor(notification.type) }}
                                    >
                                        {/* Display user's profile picture if available */}
                                        {userData[notification.user] && userData[notification.user].profilePicture ? (
                                            <img
                                                src={userData[notification.user].profilePicture}
                                                alt="User Avatar"
                                                className="avatar rounded-circle small-avt"
                                            />
                                        ) : (
                                            notification.user && notification.user.firstName
                                                ? notification.user.firstName[0]
                                                : 'U'
                                        )}
                                    </span>
                                    <div className="flex-fill ms-3">
                                        <div className="mb-1">
                                            <strong>{notification.action || 'No action'}</strong>
                                        </div>
                                        {/* Check if createdAt exists before calling formatRelativeTime */}
                                        <span className="d-flex text-muted">
                                            {notification.createdAt ? formatRelativeTime(notification.createdAt) : 'Unknown time'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-muted">No recent activity.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper function to get the avatar background color based on notification type
const getAvatarColor = (type) => {
    switch (type) {
        case 'info':
            return '#5bc0de'; // Info color
        case 'danger':
            return '#d9534f'; // Danger color
        case 'success':
            return '#5cb85c'; // Success color
        default:
            return '#ccc'; // Default color
    }
};

// Helper function to format the relative time of the notification
const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const timeDifference = now - new Date(timestamp);
    const minutesAgo = Math.floor(timeDifference / 60000);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    if (minutesAgo < 60) return `${minutesAgo} Min ago`;
    if (hoursAgo < 24) return `${hoursAgo} Hr ago`;
    return `${daysAgo} Day ago`;
};

export default TaskNotifications;
