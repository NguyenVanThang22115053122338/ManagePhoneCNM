import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";
import styles from "./notification_detail.module.css";
import { notificationService } from "../../services/NotificationService";
import type { Notification } from "../../services/Interface";

/* ================= COMPONENT ================= */
const NotificationDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  /* ================= STATE ================= */
  const [notification, setNotification] =
    useState<Notification | null>(
      (location.state as Notification) ?? null
    );

  const [isEdit, setIsEdit] = useState(false);

  /* ================= GUARD ================= */
  useEffect(() => {
    if (!notification) {
      // reload page hoặc truy cập trực tiếp
      navigate("/admin/notifications");
    }
  }, [notification]);

  if (!notification) return null;

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      await notificationService.update(
        notification.notificationId,
        {
          title: notification.title,
          content: notification.content,
          notificationType: notification.notificationType,
          sendToAll: true
        }
      );

      alert("Cập nhật thông báo thành công!");
      setIsEdit(false);
    } catch (err) {
      console.error("Cập nhật thất bại", err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;

    try {
      await notificationService.delete(notification.notificationId);
      alert("Xóa thông báo thành công!");
      navigate("/admin/manage_notification");
    } catch (err) {
      console.error("Xóa thất bại", err);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles["main-content"]}>
      <div className={styles.container}>
        {/* ===== HEADER ===== */}
        <div className={styles["notification-header"]}>
          <span
            className={styles["back-icon"]}
            onClick={() => navigate(-1)}
          >
            &#10094;
          </span>

          <h1 className={styles["notification-title"]}>
            Chi tiết thông báo
          </h1>
        </div>

        {/* ===== BODY ===== */}
        <div className={styles["notification-body"]}>
          {/* TITLE */}
          {isEdit ? (
            <input
              className={styles["edit-input"]}
              value={notification.title}
              onChange={e =>
                setNotification({
                  ...notification,
                  title: e.target.value
                })
              }
            />
          ) : (
            <h2>{notification.title}</h2>
          )}

          {/* TYPE */}
          {isEdit ? (
            <select
              value={notification.notificationType}
              onChange={e =>
                setNotification({
                  ...notification,
                  notificationType:
                    e.target.value as Notification["notificationType"]
                })
              }
            >
              <option value="SYSTEM">SYSTEM</option>
              <option value="PROMOTION">PROMOTION</option>
              <option value="PERSONAL">PERSONAL</option>
              <option value="ORDER">ORDER</option>
            </select>
          ) : (
            <p className={styles["meta-text"]}>
              Loại thông báo:{" "}
              <strong>{notification.notificationType}</strong>
            </p>
          )}

          {/* CONTENT */}
          {isEdit ? (
            <textarea
              className={styles["edit-textarea"]}
              value={notification.content}
              onChange={e =>
                setNotification({
                  ...notification,
                  content: e.target.value
                })
              }
            />
          ) : (
            <div className={styles["content"]}>
              {notification.content}
            </div>
          )}
        </div>

        {/* ===== ACTIONS ===== */}
        <div className={styles["action-buttons"]}>
          {isEdit ? (
            <>
              <button
                className={`${styles.btn} ${styles["btn-primary"]}`}
                onClick={handleUpdate}
              >
                Lưu thay đổi
              </button>

              <button
                className={`${styles.btn} ${styles["btn-secondary"]}`}
                onClick={() => setIsEdit(false)}
              >
                Hủy
              </button>
            </>
          ) : (
            <>
              <button
                className={`${styles.btn} ${styles["btn-secondary"]}`}
                onClick={() => setIsEdit(true)}
              >
                Sửa
              </button>

              <button
                className={`${styles.btn} ${styles["btn-danger"]}`}
                onClick={handleDelete}
              >
                Xóa
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailPage;
