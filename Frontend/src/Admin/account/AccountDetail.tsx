import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateUser } from "../../services/UserService";
import type { LoginResponse } from "../../services/Interface";
import styles from "./account_detail.module.css";

const AccountDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const account = location.state as LoginResponse | null;
    if (!account) navigate("/admin/manage_account");

    const [fullName, setFullName] = useState(account?.fullName ?? "");
    const [email, setEmail] = useState(account?.email ?? "");
    const [address, setAddress] = useState(account?.address ?? "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    
    const handleUpdate = async () => {
    if (!account) return;

    await updateUser(
        account.sdt,
        { fullName, email, address },
        avatarFile
    );

    alert("Cập nhật tài khoản thành công");
    navigate("/admin/manage_account");
    };

  return (
    <div className={styles.container}>
      <h1>Chi tiết tài khoản</h1>

      <label>Họ tên</label>
      <input value={fullName} onChange={e => setFullName(e.target.value)} />

      <label>Email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} />

      <label>Địa chỉ</label>
      <input value={address} onChange={e => setAddress(e.target.value)} />

      <label>Avatar</label>
      <input type="file" onChange={e => setAvatarFile(e.target.files?.[0] || null)} />

      <div className={styles.actions}>
        <button onClick={handleUpdate}>Lưu</button>
        <button onClick={() => navigate(-1)}>Huỷ</button>
      </div>
    </div>
  );
};

export default AccountDetail;
