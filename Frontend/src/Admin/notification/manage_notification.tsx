import { useEffect, useMemo, useState } from "react";
import styles from "./manage_notification.module.css";
import type { Notification } from "../../services/Interface";
import { notificationService } from "../../services/NotificationService";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const NotificationManagement = () => {
  /* ================= DATA ================= */
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  /* ================= UI ================= */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= FORM (CREATE ONLY) ================= */
  const [title, setTitle] = useState("");
  const [notificationType, setNotificationType] =
    useState<Notification["notificationType"]>("SYSTEM");
  const [content, setContent] = useState("");

  /* ================= LOAD NOTIFICATIONS ================= */
  useEffect(() => {
    notificationService
      .getAll()
      .then(setNotifications)
      .catch(err => console.error("Load notifications failed", err));
    }, []);

    useEffect(() => {
    if (!successMsg) return;

    const timer = setTimeout(() => {
      setSuccessMsg("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMsg]);

  /* ================= SEARCH ================= */
  const filteredNotifications = useMemo(() => {
    if (!search.trim()) return notifications;
    return notifications.filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, notifications]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE)
  );

  const pagedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ================= DELETE ================= */
  const handleDelete = async (notificationId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;

    try {
      await notificationService.delete(notificationId);
      setNotifications(prev =>
        prev.filter(n => n.notificationId !== notificationId)
      );
    } catch (err) {
      console.error("Xóa thông báo thất bại", err);
    }
  };

  /* ================= CREATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await notificationService.create({
        title,
        content,
        notificationType,
        sendToAll: true
      });

      setShowModal(false);

      setSuccessMsg("Đăng thông báo thành công!");

      setTitle("");
      setContent("");
      setNotificationType("SYSTEM");

      const updated = await notificationService.getAll();
      setNotifications(updated);
    } catch (err) {
      console.error("Đăng thông báo thất bại", err);
    }
  };


  /* ================= RENDER ================= */
  return (
    <div className={styles["main-content"]}>
      {/* HEADER */}
      <div className={styles["content-header"]}>
        <h1>Quản lý thông báo</h1>

        <div className={styles["search-bar"]}>
          <input
            placeholder="Tìm kiếm theo tiêu đề"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className={styles.container}>
       {pagedNotifications.length > 0 ? (
          pagedNotifications.map(tb => (
            <div
              key={tb.notificationId}
              className={styles["notification-card"]}
              onClick={() =>
                navigate(`/admin/notifications/${tb.notificationId}`, {
                  state: tb
                })
              }
            >
              <div className={styles["notification-header"]}>
                <span>{tb.notificationType}</span>

                <button
                  className={styles["delete-btn"]}
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(tb.notificationId);
                  }}
                >
                  Xoá
                </button>
              </div>

              <div className={styles["notification-content"]}>
                <h3>{tb.title}</h3>
                <p>{tb.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có thông báo nào.</p>
        )}


        {/* PAGINATION */}
        <div className={styles["pagination-area"]}>
          Trang {currentPage}/{totalPages}
        </div>

        <button
          className={styles["create-notification-btn"]}
          onClick={() => setShowModal(true)}
        >
          Đăng thông báo
        </button>
      </div>

      {/* MODAL CREATE */}
      {showModal && (
        <div
          className={styles.modal}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles["modal-content"]}
            onClick={e => e.stopPropagation()}
          >
            <h2>Đăng thông báo</h2>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Tiêu đề"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />

              <select
                value={notificationType}
                onChange={e =>
                  setNotificationType(
                    e.target.value as Notification["notificationType"]
                  )
                }
              >
                <option value="SYSTEM">SYSTEM</option>
                <option value="PROMOTION">PROMOTION</option>
                <option value="PERSONAL">PERSONAL</option>
                <option value="ORDER">ORDER</option>
              </select>

              <textarea
                placeholder="Nội dung thông báo"
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />

              <button type="submit">Đăng</button>
            </form>
          </div>
        </div>
      )}
      {successMsg && (
        <div className={styles["success-toast"]}>
          {successMsg}
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
