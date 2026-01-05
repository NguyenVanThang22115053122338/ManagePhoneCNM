import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./supplier.module.css";
import supplierService from "../../services/supplierService";
import type { ISupplier } from "../../services/Interface";

const SupplierManagement: React.FC = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const data = await supplierService.getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Load suppliers failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((s) =>
    s.supplierName
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
  );

  const handleRowClick = (id: number) => {
    navigate(`/admin/supplier/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate("/admin/supplier/create");
  };

  return (
    <main className={styles["main-content"]}>
      <div className={styles["search-bar"]}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.Title}>
        <h1>QUẢN LÝ NHÀ CUNG CẤP</h1>
      </div>

      <div className={styles["add-button"]}>
        <button className={styles["filter-btn"]}>
          Tất cả ({filteredSuppliers.length})
        </button>
        <button
          className={styles["add"]}
          onClick={handleAddNew}
        >
          Thêm mới&nbsp;&nbsp;&nbsp;
          <span className={styles["plus-sign"]}>+</span>
        </button>
      </div>

      <section className={styles["table-container"]}>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className={styles["product-table"]}>
            <thead>
              <tr>
                <th>Mã nhà cung cấp</th>
                <th>Tên nhà cung cấp</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((item) => (
                  <tr
                    key={item.supplierId}
                    onClick={() => handleRowClick(item.supplierId)}
                  >
                    <td>{item.supplierId}</td>
                    <td>{item.supplierName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default SupplierManagement;
