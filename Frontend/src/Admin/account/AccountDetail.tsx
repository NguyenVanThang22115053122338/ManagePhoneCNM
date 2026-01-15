import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { updateUserByAdmin } from "../../services/UserService";
import type { IUser } from "../../services/Interface";
import styles from "./account_detail.module.css";

const AccountDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const account = location.state as IUser | null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('🔍 Account data from location.state:', account);
    
    if (!account) {
      alert("Không tìm thấy thông tin tài khoản");
      navigate("/admin/manage_account");
      return;
    }
    
    console.log('✅ Account loaded:', {
      sdt: account.sdt,
      fullName: account.fullName,
      email: account.email,
      userId: account.userId
    });
    
    setFullName(account.fullName || "");
    setEmail(account.email || "");
    setAddress(account.address || "");
  }, [account, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!account) {
      alert("Không có thông tin tài khoản");
      return;
    }
  
    if (!fullName.trim()) {
      alert("Vui lòng nhập họ tên");
      return;
    }
  
    if (!email.trim()) {
      alert("Vui lòng nhập email");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ");
      return;
    }
  
    // Lấy userId để gọi API admin
    const userId = account.userId;
    if (!userId) {
      alert("Không tìm thấy ID của tài khoản");
      console.error("❌ userId is missing:", account);
      return;
    }
  
    try {
      setIsLoading(true);
      
      const dto: any = {};
      if (fullName.trim() !== (account.fullName || '')) dto.fullName = fullName.trim();
      if (email.trim() !== (account.email || '')) dto.email = email.trim();
      if (address.trim() !== (account.address || '')) dto.address = address.trim();
  
      console.log('📝 Updating account:', {
        userId,
        dto,
        hasAvatar: !!avatarFile,
        avatarFileName: avatarFile?.name
      });
  
      // Gọi API admin với userId
      const res = await updateUserByAdmin(userId, dto, avatarFile || undefined);
      
      console.log('✅ Update response:', res);
  
      alert("Cập nhật tài khoản thành công!");
      navigate("/admin/manage_account");
    } catch (err: any) {
      console.error('❌ Update failed:', err);
      console.error('❌ Error details:', err.response?.data);
      alert(err.response?.data?.message || err.message || "Cập nhật tài khoản thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!account) {
      navigate("/admin/manage_account");
      return;
    }

    const hasChanges = 
      fullName !== (account.fullName || "") ||
      email !== (account.email || "") ||
      address !== (account.address || "") ||
      avatarFile !== null;

    if (hasChanges) {
      const confirmed = window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy?");
      if (!confirmed) return;
    }

    navigate("/admin/manage_account");
  };

  if (!account) return null;

  const displayAvatar = avatarPreview || account.avatar;

  return (
    <div className={styles.container}>
      <h1>Chi tiết tài khoản</h1>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Số điện thoại</label>
          <input 
            type="text" 
            value={account.sdt || 'N/A'} 
            disabled 
            className={styles.disabled}
          />
          <small>Không thể thay đổi số điện thoại</small>
        </div>

        <div className={styles.formGroup}>
          <label>Họ tên <span className={styles.required}>*</span></label>
          <input 
            type="text"
            value={fullName} 
            onChange={e => setFullName(e.target.value)}
            placeholder="Nhập họ tên"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email <span className={styles.required}>*</span></label>
          <input 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Địa chỉ</label>
          <input 
            type="text"
            value={address} 
            onChange={e => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Avatar</label>
          {displayAvatar && (
            <div className={styles.avatarPreview}>
              <img src={displayAvatar} alt="Avatar preview" />
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <small>Chọn ảnh mới để thay đổi avatar</small>
        </div>

        <div className={styles.formGroup}>
          <label>Quyền hạn</label>
          <input 
            type="text" 
            value={account.role === 2 ? "Admin" : "Người dùng"} 
            disabled 
            className={styles.disabled}
          />
          <small>Không thể thay đổi quyền hạn ở đây</small>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.saveButton}
          onClick={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <button 
          className={styles.cancelButton}
          onClick={handleCancel}
          disabled={isLoading}
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AccountDetail;