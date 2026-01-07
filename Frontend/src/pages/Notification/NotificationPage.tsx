import React, { useState, useEffect } from 'react';
import './NotificationPage.css';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/NotificationComponet/LoadingSkeleton';
import { 
  Package, 
  Percent, 
  Bell, 
  User, 
  Info, 
  Trash2 
} from 'lucide-react';

import { notificationService } from '../../services/NotificationService';
import type { Notification } from '../../services/Interface';

const NotificationsPage: React.FC = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = authUser?.userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('Vui lòng đăng nhập để xem thông báo');
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getUserNotifications(userId);
        setNotifications(data);
      } catch (err: any) {
        console.error('Lỗi tải thông báo:', err);
        setError('Không thể tải thông báo. Vui lòng thử lại sau.');

        // Tạm dùng fake data nếu muốn test giao diện khi API lỗi
        // setNotifications(fakeNotifications);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif => notif.notificationId === id ? { ...notif, isRead: true } : notif)
      );
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc');
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Lỗi đánh dấu tất cả');
    }
  };

  const deleteNotification = async (id: number) => {
    if (!confirm('Xóa thông báo này?')) return;
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.notificationId !== id));
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Package size={20} />;
      case 'PROMOTION': return <Percent size={20} />;
      case 'SYSTEM': return <Bell size={20} />;
      case 'ACCOUNT':
      case 'PERSONAL': return <User size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ORDER': return '#10b981';
      case 'PROMOTION': return '#f59e0b';
      case 'SYSTEM': return '#3b82f6';
      case 'PERSONAL':
      case 'ACCOUNT': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  // Loading từ auth hoặc fetch
  if (authLoading || loading) return <LoadingSkeleton />;

  if (error) return <div className="error-message">{error}</div>;

  if (!authUser) return <div className="error-message">Vui lòng đăng nhập</div>;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Thông báo của bạn</h1>
          {unreadCount > 0 && (
            <button className="mark-all-read" onClick={markAllAsRead}>
              Đánh dấu tất cả đã đọc ({unreadCount})
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell className="empty-icon" size={80} />
            <p>Chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div
                key={notif.notificationId}
                className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                onClick={() => !notif.isRead && markAsRead(notif.notificationId)}
              >
                <div className="notification-icon" style={{ backgroundColor: getTypeColor(notif.notificationType) }}>
                  {getTypeIcon(notif.notificationType)}
                </div>

                <div className="notification-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.content}</p>
                  {/* Nếu backend trả createdAt thì hiển thị */}
                  {/* <span className="notification-time">
                    {new Date(notif.createdAt).toLocaleString('vi-VN')}
                  </span> */}
                </div>

                <div className="notification-actions">
                  {!notif.isRead && <span className="unread-dot"></span>}
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.notificationId);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;