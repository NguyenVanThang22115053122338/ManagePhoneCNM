import { useEffect, useMemo, useState } from "react";
import styles from "./manage_account.module.css";
import { getAllUsers, deleteUser } from "../../services/UserService";
import type { IUser } from "../../services/Interface";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const AccountManagement = () => {
  const [accounts, setAccounts] = useState<IUser[]>([]);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      setAccounts(data);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách tài khoản");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];
    
    if (filterRole !== "all") {
      result = result.filter(a => String(a.role) === filterRole);
    }
    
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(a =>
        a.fullName?.toLowerCase().includes(s) ||
        a.sdt?.toLowerCase().includes(s) ||
        a.email?.toLowerCase().includes(s)
      );
    }
    
    return result;
  }, [accounts, filterRole, search]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE));
  const pagedAccounts = filteredAccounts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRole]);

  const handleEdit = (acc: IUser) => {
    navigate(`/admin/accounts/${acc.userId}`, { state: acc });
  };

  const handleDelete = async (acc: IUser) => {
    const identifier = acc.sdt || acc.email;
    const displayName = acc.fullName || identifier;

    if (!identifier) {
      alert("Không tìm thấy SĐT hoặc Email để xóa");
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${displayName}"?`
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      await deleteUser(identifier); 
      alert("Xóa tài khoản thành công!");
      await loadAccounts();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Xóa tài khoản thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate("/admin/accounts/create");
  };

  const getRoleName = (role?: number) => {
    if (role === 2) return "Admin";
    if (role === 1) return "Người dùng";
    return "Chưa phân quyền";
  };

  /* ===== RENDER ===== */
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Quản lý tài khoản</h1>
        <button 
          className={styles.addButton}
          onClick={handleAddNew}
          disabled={isLoading}
        >
          + Thêm tài khoản
        </button>
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên, SĐT, email..."
          disabled={isLoading}
        />

        <div className={styles.roleFilters}>
          <button
            className={filterRole === "all" ? styles.active : ""}
            onClick={() => setFilterRole("all")}
            disabled={isLoading}
          >
            Tất cả quyền hạn
          </button>
          <button
            className={filterRole === "2" ? styles.active : ""}
            onClick={() => setFilterRole("2")}
            disabled={isLoading}
          >
            Admin
          </button>
          <button
            className={filterRole === "1" ? styles.active : ""}
            onClick={() => setFilterRole("1")}
            disabled={isLoading}
          >
            Người dùng
          </button>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className={styles.loading}>Đang tải...</div>
      )}

      {/* TABLE */}
      {!isLoading && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SĐT</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Quyền hạn</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pagedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Không tìm thấy tài khoản nào
                  </td>
                </tr>
              ) : (
                pagedAccounts.map(acc => (
                  <tr key={acc.userId}>
                    <td>{acc.sdt || 'N/A'}</td>
                    <td>{acc.fullName}</td>
                    <td>{acc.email}</td>
                    <td>{acc.address}</td>
                    <td>{getRoleName(acc.role)}</td>
                    <td>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(acc)}
                      >
                        Sửa
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(acc)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {!isLoading && filteredAccounts.length > 0 && (
        <div className={styles.pagination}>
          <span>Trang {currentPage}/{totalPages}</span>
          <div className={styles.paginationButtons}>
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              ◀ Trước
            </button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              Sau ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;