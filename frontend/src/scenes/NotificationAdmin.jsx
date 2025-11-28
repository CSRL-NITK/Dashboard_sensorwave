import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, X, RefreshCw, Send } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { appendAllNotifs, deleteNotif, setAllFilteredNotifs, setAllNotifs, setNotifCount, updateAllNotifs, updateRead } from '../redux/slices/notificationSlice';
import { toast } from 'react-toastify';
const socket = io("http://localhost:8000");

const NotificationAdmin = () => {
  const theme = useSelector((state) => state.theme.theme);
  // const uniqueId = sessionStorage.getItem("uniqueId");
  const vendorDetail = JSON.parse(sessionStorage.getItem("yourDetailAsCustomer"));
  const permissions = JSON.parse(sessionStorage.getItem('permissions'));

  const isDark = theme === 'dark';
  const dispatch = useDispatch();
  const roles = JSON.parse(sessionStorage.getItem("role"));
  const customer = roles && roles.includes("Customer");
  const notifications = useSelector(state => state.notification.allNotifs)

  function getVendorName(sender) {
    return vendorDetail[0].vendor_id === sender ? vendorDetail[0].vendor_name : "Unknown"
  }
  // States
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read', 'responded'


  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("NotificationFromVendor", (data) => {
      console.log("Notification From Vendor", data);
      dispatch(appendAllNotifs(data));
    });

    return () => {
      socket.off("NotificationFromVendor");
    };
  }, [socket]);

  const markAsRead = async (notificationId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const res = await axios.post(`http://localhost:8000/api/notification/readNotification`, {
        notification_id: notificationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        dispatch(updateRead({
          id: notificationId,
        }));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };


  const sendReply = async () => {
    if (!selectedNotification || !replyText.trim()) return;
    const date = new Date(Date.now()).toISOString();
    try {
      const token = sessionStorage.getItem('accessToken');
      const res = await axios.post(`http://localhost:8000/api/notification/sendReply`, {
        notification_id: selectedNotification.notification_id,
        replytext: replyText,
        replydate: date
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        dispatch(updateAllNotifs({
          id: selectedNotification.notification_id,
          replyText: replyText,
          replyDate: date
        }))
        setReplyText('');
        const newNotification = {
          sender: selectedNotification.receiver,
          receiver: selectedNotification.sender,
          title: selectedNotification.title,
          message: replyText,
          type: "general",
          created_at: date,
        };
        const res2 = await axios.post(`http://localhost:8000/api/notification/insertNotification`, newNotification, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res2.status === 200) {
          socket.emit("SendReply", res2.data);
          toast.success("Replied", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
          })
        }
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      await axios.post(`http://localhost:8000/api/notification/deleteNotification`, { ids: notificationId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      dispatch(deleteNotif({
        id: notificationId,
      }));
      if (selectedNotification !== null && selectedNotification.notification_id === notificationId) {
        setSelectedNotification(null);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);

    if (!notification.is_read) {
      markAsRead(notification.notification_id);

    }
  };

  const filteredNotifications = Object.values(notifications).filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.is_read;
      case 'read':
        return notification.is_read && !notification.replied;
      case 'responded':
        return notification.replied;
      default:
        return true;
    }
  });
  const fetchNotifications = async () => {
    const uniqueId = sessionStorage.getItem("uniqueId");
    const token = sessionStorage.getItem('accessToken');
    try {
      const res = await axios.post(
        'http://localhost:8000/api/notification/getNotificationsForUser',
        { receiver: uniqueId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.status === 200) {
        const filtered = res.data.filter(n => !n.is_read);
        dispatch(setAllFilteredNotifs(filtered));
        dispatch(setNotifCount(filtered.length));
        dispatch(setAllNotifs(res.data));
      }
    } catch (err) {
      console.error('Notification Fetch Error:', err.response?.data || err.message);
    }
  };

  return (
    <div className={`overflow-auto scrollbar-hide h-full flex flex-col p-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center">
          <Bell className="mr-2" /> Notifications
        </h1>
        <div className="flex space-x-2">
          <div className="">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-2 py-1 text-sm border rounded ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="responded">Responded</option>
            </select>
          </div>
          <button
            onClick={() => fetchNotifications()}
            className={`flex items-center px-3 py-1 text-sm rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-auto scrollbar-hide">
        {/* Notifications List */}
        <div className={`w-1/3 border-r ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-auto scrollbar-hide`}>
          {loading && notifications.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div
                key={notification.notification_id}
                onClick={() => handleSelectNotification(notification)}
                className={`p-4 border-b cursor-pointer ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                  } ${selectedNotification?.notification_id === notification.notification_id ?
                    (isDark ? 'bg-gray-800' : 'bg-blue-50') : ''
                  } ${!notification.is_read ? 'font-semibold' : ''
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    )}
                    <span className="font-bold">{notification.sender_name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {/* {new Date(notification.created_at || Date.now()).toLocaleDateString()} */}
                    {new Date(notification.created_at).toLocaleDateString()}

                  </span>
                </div>
                <p className="text-sm mt-1 truncate">
                  {notification.title || 'No title'}
                </p>
                <p className="text-sm mt-1 truncate">
                  {notification.message}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${notification.replied ?
                    'bg-green-100 text-green-800' :
                    notification.is_read ?
                      'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {notification.replied ? 'Responded' : notification.is_read ? 'Read' : 'New'}
                  </span>
                  {permissions.includes('delete:notification') && <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.notification_id);
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bell className="w-12 h-12 mb-2" />
              <p>No notifications found</p>
            </div>
          )}
        </div>

        {/* Notification Detail */}
        <div className="w-2/3 flex flex-col">
          {selectedNotification ? (
            <>
              <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">
                    {selectedNotification.title || 'No Title'}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>
                      {new Date(selectedNotification.created_at).toLocaleString('en-US', {
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="text-gray-500">From:</span>
                    <span className='font-bold'> {selectedNotification.sender_name}</span>
                  </div>
                  <div className="mb-6">
                    <span className="text-gray-500">Type:</span> {selectedNotification.type || 'General'}
                  </div>
                  <p className="mb-6">{selectedNotification.message}</p>

                  {/* Reply section if already replied */}
                  {selectedNotification.replied && (
                    <div className={`mt-6 p-4 rounded ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" /> Your Reply
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(selectedNotification.replydate).toLocaleString('en-US', {
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                      <p>{selectedNotification.replytext}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reply input area */}
              {permissions.includes('access:reply') && <div className="mt-auto p-4">
                <div className="flex flex-col">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className={`p-3 border rounded resize-none focus:ring-2 focus:outline-none ${isDark ?
                      'bg-gray-800 border-gray-700 focus:ring-gray-600' :
                      'bg-white border-gray-300 focus:ring-blue-200'
                      }`}
                    rows="4"
                    disabled={selectedNotification.replied}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim() || selectedNotification.replied}
                      className={`flex items-center px-4 py-2 rounded ${!replyText.trim() || selectedNotification.replied ?
                        (isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400') :
                        (isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')
                        } text-white`}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {selectedNotification.replied ? 'Already Replied' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </div>}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="w-16 h-16 mb-4" />
              <p className="text-lg">Select a notification to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationAdmin;