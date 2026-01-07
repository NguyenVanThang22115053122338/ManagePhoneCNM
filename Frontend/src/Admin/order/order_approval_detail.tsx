import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./order_approval_detail.module.css";

import OrderService from "../../services/OrderService";
import StatusService from "../../services/StatusService";
import OrderDetailService from "../../services/OrderDetailService";
import ProductService from "../../services/ProductService";

import type {
  OrderResponse,
  IUser,
} from "../../services/Interface";

/* ================= TYPES ================= */
type OrderDetailVM = {
  donHang: {
    idDon: number;
    ngayDat?: string | null;
    tenNguoiNhan: string;
    sdtNguoiNhan: string;
    diaChiNhan: string;
    ghiChu?: string;
    trangThai: string;
  };
  chiTietDonHang: {
    tenSanPham: string;
    donGia: number;
    soLuong: number;
    thanhTien: number;
    hinhAnh?: string | null;
  }[];
  tongTien: number;
  thanhTien: number;
  phuongThucThanhToan: string;
};

/* ================= HELPERS ================= */
const formatVND = (n: number) =>
  `${Number(n || 0).toLocaleString("vi-VN")}đ`;

const formatDate = (d?: string | null) => {
  if (!d || typeof d !== "string") return "—";
  return d.slice(0, 10).split("-").reverse().join("/");
};

const mapTrangThai = (status: string) => {
  switch (status) {
    case "PENDING": return "Chưa duyệt";
    case "APPROVED": return "Đã duyệt";
    case "SHIPPING": return "Đang giao";
    case "COMPLETED": return "Hoàn thành";
    case "REJECTED": return "Đã từ chối";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
};

/* ================= COMPONENT ================= */
const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<OrderDetailVM | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!id || isNaN(Number(id))) return;

    const load = async () => {
      try {
        setLoading(true);

        /* ===== 1️⃣ ORDER ===== */
        const order: OrderResponse = await OrderService.getById(Number(id));

        /* ===== 2️⃣ USER ===== */
        let user: IUser = {
          userId: 0,
          fullName: "—",
          sdt: "—",
          address: "—",
        };

        if (order.userID) {
          try {
            user = await StatusService.getUserById(order.userID);
          } catch {}
        }

        /* ===== 3️⃣ ORDER DETAILS ===== */
        const details = await OrderDetailService.getByOrderId(order.orderID);

        /* ===== 4️⃣ PRODUCTS ===== */
        const items = await Promise.all(
          details.map(async d => {
            const product = await ProductService.getProductById(d.productId);
            const price = Number(product.price || 0);

            return {
              tenSanPham: product.name,
              donGia: price,
              soLuong: d.quantity,
              thanhTien: price * d.quantity,
              hinhAnh: product.productImages?.[0]?.url ?? null,
            };
          })
        );

        const tongTien = items.reduce((s, i) => s + i.thanhTien, 0);

        setData({
          donHang: {
            idDon: order.orderID,
            ngayDat: order.orderDate ?? null,
            tenNguoiNhan: user.fullName ?? "—",
            sdtNguoiNhan: user.sdt ?? "—",
            diaChiNhan: user.address ?? "—",
            ghiChu: order.note ?? "",
            trangThai: mapTrangThai(order.status),
          },
          chiTietDonHang: items,
          tongTien,
          thanhTien: tongTien,
          phuongThucThanhToan: order.paymentMethod ?? "PayPal",
        });
      } catch (e) {
        console.error(e);
        alert("Không tải được chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= APPROVE / REJECT ================= */
  const updateStatus = async (status: "APPROVED" | "REJECTED") => {
    if (!data) return;

    try {
      await StatusService.updateStatus(data.donHang.idDon, status);
      setData(prev =>
        prev
          ? {
              ...prev,
              donHang: {
                ...prev.donHang,
                trangThai: status === "APPROVED" ? "Đã duyệt" : "Đã từ chối",
              },
            }
          : prev
      );
    } catch {
      alert("Cập nhật trạng thái thất bại");
    }
  };

  const canApproveReject = useMemo(() => {
    const st = data?.donHang.trangThai;
    return st === "Chưa duyệt";
  }, [data]);

  if (loading) return <div className={styles.page}>Đang tải dữ liệu...</div>;
  if (!data) return null;

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/admin/order_approval")}>
        ← Quay lại
      </button>

      <h2>Đơn hàng #{data.donHang.idDon}</h2>
      <p>Ngày đặt: {formatDate(data.donHang.ngayDat)}</p>
      <p>Khách hàng: {data.donHang.tenNguoiNhan}</p>
      <p>SĐT: {data.donHang.sdtNguoiNhan}</p>
      <p>Địa chỉ: {data.donHang.diaChiNhan}</p>
      <p>Trạng thái: {data.donHang.trangThai}</p>

      {canApproveReject && (
        <>
          <button onClick={() => updateStatus("APPROVED")}>Duyệt</button>
          <button onClick={() => updateStatus("REJECTED")}>Từ chối</button>
        </>
      )}

      <hr />

      {data.chiTietDonHang.map((p, i) => (
        <div key={i}>
          <strong>{p.tenSanPham}</strong> – x{p.soLuong} – {formatVND(p.thanhTien)}
        </div>
      ))}

      <h3>Tổng tiền: {formatVND(data.thanhTien)}</h3>
    </div>
  );
};

export default OrderDetailPage;