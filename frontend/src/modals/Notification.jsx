import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { Button, Typography, Avatar } from '@mui/material';
import axios from 'axios';
import { io } from 'socket.io-client';
import { appendAllNotifs, appendFilteredNotifs, incrementNotifCount, setNotifCount, updateAlertStatus, updateReadMany } from '../redux/slices/notificationSlice';

const socket = io('http://localhost:8000');

const Notification = ({ isOpen, onClose }) => {
    const theme = useSelector(state => state.theme.theme);
    // const notif_Count = useSelector(state => state.notification.notif_Count);
    const role = JSON.parse(sessionStorage.getItem('role'));
    const uniqueId = sessionStorage.getItem('uniqueId');
    const dispatch = useDispatch();

    const notifications = useSelector(state => state.notification.allFilteredNotifs);
    const readNotification = async () => {
        const ids = [];
        Object.values(notifications).forEach(notification => {
            if (notification?.notification_id) {
                ids.push(notification.notification_id);
            }
        });
        try {
            await axios({
                url: "http://localhost:8000/api/notification/readMany",
                method: 'POST',
                data: { ids },
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                    "Accept": 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(() => {
                dispatch(setNotifCount(0));
                dispatch(updateReadMany(ids))
            })
        } catch (error) {
            console.error("Axios error:", error);
        }
    };
    useEffect(() => {
        socket.emit('identify', { role: role[0], uniqueId: uniqueId });
    }, [])

    useEffect(() => {
        socket.on('sendingNotificationToSpecificUser', obj => {
            dispatch(incrementNotifCount(1));
            dispatch(appendAllNotifs(obj));
            dispatch(appendFilteredNotifs(obj));
            dispatch(updateAlertStatus({
                alert_id: obj.alert_id,
                resolved_status: "Cleared"
            }));
        })
        socket.on('receiveNotificationOnVendorEndOnly', async (obj) => {
            dispatch(incrementNotifCount(1));
            dispatch(appendAllNotifs(obj));
            dispatch(appendFilteredNotifs(obj));

            // Update alert status when vendor receives notification
            if (obj.type === 'alert') {
                console.log(obj);
                try {
                    const updateRes = await axios({
                        url: "http://localhost:8000/api/alert/updateAlerts",
                        method: 'PUT',
                        data: {
                            alert_id: obj.alert_id,
                        },
                        headers: {
                            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        }
                    });
                } catch (error) {
                    console.error("Failed to update alert status:", error.message);
                }
            }
        });
        socket.on("recieveReply", obj => {
            console.log(obj);
            dispatch(incrementNotifCount(1));
            dispatch(appendAllNotifs(obj));
            dispatch(appendFilteredNotifs(obj));
        })
        return () => {
            socket.off("sendingNotificationToSpecificUser");
            socket.off('receiveNotificationOnAdminEndOnly');
            socket.off("recieveReply");
        };
    }, [socket]);

    if (!isOpen) {
        return null;
    }

    // Helper function to get the sender's initials for avatar
    const getInitials = (senderName) => {
        if (!senderName) return "?";
        return senderName
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Helper function to get avatar color based on sender type
    const getAvatarColor = (senderType) => {
        const colors = {
            admin: '#4B5563', // gray
            vendor: '#3B82F6', // blue
            system: '#10B981', // green
            alert: '#EF4444'   // red
        };
        return colors[senderType?.toLowerCase()] || '#6B7280';
    };

    return (
        <div className={`fixed top-[50px] right-[10px] z-[1000] w-80 rounded-xl p-6 flex flex-col gap-4 shadow-lg animate-slideIn border overflow-auto scrollbar-hide max-h-[400px]
            ${theme === 'light'
                ? 'bg-white border-gray-200 text-black'
                : 'bg-gray-600 border-gray-500 text-white'}`}>

            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-500">
                <div className="flex items-center gap-3">
                    <NotificationsIcon className={theme === 'light' ? 'text-gray-800' : 'text-gray-100'} />
                    <Typography variant="h6" className={theme === 'light' ? 'text-gray-800' : 'text-gray-100'}>
                        Notifications
                    </Typography>
                </div>
                <CloseIcon
                    onClick={onClose}
                    className={`cursor-pointer ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'} hover:text-gray-500 transition-colors`}
                />
            </div>
            {
                Object.values(notifications).length > 0 ?
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                        {Object.values(notifications).map((notification) => (
                            <div
                                key={notification?.notification_id}
                                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:translate-y-[-2px] hover:shadow-md
                                ${notification.type === 'alert'
                                        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                                        : notification.type === 'success'
                                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                                            : 'bg-gray-100 border-gray-200 dark:bg-gray-700/30 dark:border-gray-600'}`}
                            >
                                <div className="flex items-start gap-2 mb-2">
                                    <Avatar
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            fontSize: '0.75rem',
                                            bgcolor: getAvatarColor(notification.type)
                                        }}
                                    >
                                        {notification.sender_name ? getInitials(notification.sender_name) : <PersonIcon fontSize="small" />}
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <Typography variant="subtitle2" className="font-semibold">
                                                {notification.title}
                                            </Typography>
                                            <Typography variant="caption" className="text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                                                {new Date(notification.created_at).toLocaleString('en-US', {
                                                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}
                                            </Typography>
                                        </div>
                                        <Typography variant="caption" className={`block mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                            {(notification.type)}
                                        </Typography>
                                        <Typography variant="body2" className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                                            {notification.message}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <div className='text-center text-gray-500 dark:text-gray-400'>No New Notification</div>
            }
            <Button
                variant='outlined'
                onClick={readNotification}
                className={theme === 'light' ? '' : 'text-gray-200 border-gray-400 hover:border-gray-200'}
            >
                Mark as Read
            </Button>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Notification;