import React, { useState, useEffect, useRef } from 'react';
import { Bell, Package, Percent, User, Info, Check } from 'lucide-react';
import { notificationService } from '../../services/NotificationService';
import type { Notification, NotificationDropdownProps } from '../../services/Interface';
import './NotificationDropdown.css';
import Logo from "../../assets/img/logo.png";

const DROPDOWN_WIDTH = 360; 

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  userId,
  isOpen,
  onClose,
  anchorRef,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  /* =======================
     FETCH NOTIFICATIONS
  ======================== */
  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await notificationService.getUserNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error('Error loading notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen, userId]);

  /* =======================
     POSITIONING (ANCHOR)
  ======================== */
  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();

    let left = rect.right - DROPDOWN_WIDTH;

    // ❗ không cho tràn trái màn hình
    if (left < 8) left = 8;

    setPosition({
      top: rect.bottom + 8, // nằm dưới nút chuông
      left,
    });
  }, [isOpen, anchorRef]);

  /* =======================
     CLICK OUTSIDE
  ======================== */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  /* =======================
     ACTIONS
  ======================== */
  const markAsRead = async (id: number) => {
    if (!userId) return;

    try {
      await notificationService.markAsRead(id, userId);
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === id ? { ...n, isRead: true } : n
        )
      );
      window.dispatchEvent(new Event('notification-read'));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      window.dispatchEvent(new Event('notification-read'));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  /* =======================
     HELPERS
  ======================== */
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Package size={18} />;
      case 'PROMOTION': return <Percent size={18} />;
      case 'SYSTEM': return <Bell size={18} />;
      case 'ACCOUNT':
      case 'PERSONAL': return <User size={18} />;
      default: return <Info size={18} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ORDER': return '#10b981';
      case 'PROMOTION': return '#f59e0b';
      case 'SYSTEM': return '#3b82f6';
      case 'ACCOUNT':
      case 'PERSONAL': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;

    return date.toLocaleDateString('vi-VN');
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  /* =======================
     RENDER
  ======================== */
  return (
    <>
      <div className="notification-overlay" onClick={onClose} />

      <div
        ref={dropdownRef}
        className="notification-dropdown-container"
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
        }}
      >
        <div className="notification-dropdown-header">
          <h3>Thông báo</h3>
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              <Check size={16} />
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        <div className="notification-dropdown-body">
          {loading ? (
            <div className="notification-loading">
              <div className="loading-spinner" />
              <p>Đang tải thông báo...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              <Bell size={48} strokeWidth={1.5} />
              <p>Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map(notif => (
                <div
                  key={notif.notificationId}
                  className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                  onClick={() => !notif.isRead && markAsRead(notif.notificationId)}
                >
                  <div
                    className="notification-icon-wrapper"
                    style={{ borderColor: getTypeColor(notif.notificationType) }}
                  >
                    <div className="notification-icon-inner">
                      <img
                        src={Logo}
                        alt="CellphoneS"
                        className="notification-logo-img"
                      />
                    </div>

                    <span
                      className="notification-type-dot"
                      style={{ backgroundColor: getTypeColor(notif.notificationType) }}
                    />
                  </div>



                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.content}</p>
                    {notif.createdAt && (
                      <span className="notification-time">
                        {formatTime(notif.createdAt)}
                      </span>
                    )}
                  </div>

                  {!notif.isRead && <div className="notification-unread-dot" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="notification-dropdown-footer">
            <button className="view-all-btn" onClick={onClose}>
              Đóng
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;
