import { useEffect, useMemo, useState } from "react";
import styles from "./manage_account.module.css";
import { getAllUsers } from "../../services/UserService";
import type { LoginResponse } from "../../services/Interface";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const AccountManagement = () => {
  /* ===== DATA ===== */
  const [accounts, setAccounts] = useState<LoginResponse[]>([]);
  const navigate = useNavigate();
  /* ===== UI STATE ===== */
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] =
    useState<LoginResponse | null>(null);

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    getAllUsers()
      .then(setAccounts)
      .catch(err => console.error("Load user failed", err));
  }, []);

  /* ===== FILTER + SEARCH ===== */
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (filterRole !== "all") {
      result = result.filter(
        a => String(a.role) === filterRole
      );
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(a =>
        a.fullName.toLowerCase().includes(s)
      );
    }

    return result;
  }, [accounts, filterRole, search]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE)
  );

  const pagedAccounts = filteredAccounts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRole]);

  /* ===== HANDLERS ===== */
  const openEdit = (acc: LoginResponse) => {
    setEditingAccount(acc);
    setShowEditModal(true);
  };

const getRoleName = (role: any) => {
  const roleId = role?.roleId;
  const roleName = role?.roleName;

  if (roleId === 2 || roleName === "ADMIN") return "Admin";
  if (roleId === 1 || roleName === "USER") return "Người dùng";

  return "Chưa phân quyền";
};
  /* ===== RENDER ===== */
  return (
    <div className={styles.container}>
      <div className={styles["content-container"]}>
        {/* HEADER */}
        <div className={styles["content-header"]}>
          <h1>Quản lý tài khoản</h1>

          <div className={styles["search-filter-container"]}>
            <div className={styles["search-box"]}>
              <i className="fas fa-search" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm tài khoản theo tên"
              />
            </div>

            <div className={styles["filter-dropdown"]}>
           
              <div className={styles["filter-content"]}>
                <button onClick={() => setFilterRole("all")}>
                  Tất cả quyền hạn
                </button>
                <button onClick={() => setFilterRole("2")}>
                  Admin
                </button>
                <button onClick={() => setFilterRole("1")}>
                  Người dùng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className={styles["accounts-table"]}>
          <table>
            <thead>
              <tr>
                <th>SĐT</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Quyền hạn</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {pagedAccounts.map(acc => (
                <tr key={acc.userId}>
                  
                  <td>
                    <span className={styles["phone-badge"]}>
                      {acc.sdt}
                    </span>
                  </td>
                  <td>{acc.fullName}</td>
                  <td>{acc.email}</td>
                  <td>{acc.address}</td>
                  <td>{getRoleName(acc.role)}</td>
                  <td>
                    <button
                      className={styles["edit-btn"]}
                      onClick={() =>
                        navigate(`/admin/accounts/${acc.userId}`, {
                          state: acc
                        })
                      }
                    >
                      <i className="fas fa-edit" />
                    </button>

                    <button
                      className={styles["lock-btn"]}
                      onClick={() =>
                        confirm(`Xoá tài khoản ${acc.sdt}?`)
                      }
                    >
                      <i className="fas fa-lock" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className={styles["pagination-container"]}>
          <div className={styles["pagination-info"]}>
            Trang {currentPage}/{totalPages}
          </div>

          <div className={styles["pagination-controls"]}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ◀
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              ▶
            </button>
          </div>
          
          <button
            className={styles["add-account-btn"]}
            onClick={() => navigate("/admin/accounts/create")}
          >
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showEditModal && editingAccount && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <h2>Sửa tài khoản</h2>
            <button onClick={() => setShowEditModal(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
