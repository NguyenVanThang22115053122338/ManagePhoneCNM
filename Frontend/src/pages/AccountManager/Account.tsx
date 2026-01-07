import React, { useState, useEffect, useRef } from 'react';
import './Account.css';
import { useAuth } from '../../context/AuthContext';
import type { IUser } from '../../services/Interface';
import { userService } from '../../services/UserService';

const AccountPage: React.FC = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = authUser?.userId;

  useEffect(() => {
    if (!authUser) {
      setUser(null);
      return;
    }

    setUser(authUser);
    setFullName(authUser.fullName || '');
    setEmail(authUser.email || '');
    setAddress(authUser.address || '');
    setAvatarPreview(authUser.avatar || null);
  }, [authUser]);

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

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

 const handleSave = async () => {
  if (!userId || !user) return;

  setSaving(true);
  try {
    const dto: {
      fullName?: string;
      email?: string;
      address?: string;
    } = {};

    // Chỉ thêm field nếu người dùng thay đổi so với giá trị gốc
    if (fullName.trim() !== (user.fullName || '')) {
      dto.fullName = fullName.trim() || undefined;  
    }
    if (email.trim() !== (user.email || '')) {
      dto.email = email.trim() || undefined;
    }
    if (address.trim() !== (user.address || '')) {
      dto.address = address.trim() || undefined;
    }

    const updatedUser = await userService.updateUser(userId, dto, avatarFile || undefined);

    setUser(updatedUser);
    setAvatarPreview(updatedUser.avatar || null);
    setAvatarFile(null);

    alert('Cập nhật thông tin thành công!');
    setIsEditing(false);
  } catch (err: any) {
    console.error('Lỗi cập nhật:', err);
    alert(err.response?.data?.message || 'Cập nhật thất bại!');
  } finally {
    setSaving(false);
  }
};

  if (authLoading || !user) {
    return (
      <div className="account-container">
        <div className="loading">Đang tải thông tin tài khoản...</div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-wrapper">
        <main className="account-main">
          <h2 className="page-title">Thông tin tài khoản</h2>

          {/* Avatar lớn + upload */}
          <div className="profile-header" style={{ marginBottom: '30px' }}>
            <div
              className="avatar-large"
              onClick={handleAvatarClick}
              style={{ cursor: isEditing ? 'pointer' : 'default' }}
            >
              {avatarPreview || user.avatar ? (
                <img
                  src={avatarPreview || user.avatar!}
                  alt="Avatar"
                  className="avatar-img"
                />
              ) : (
                <div className="avatar-fallback">
                  {user.sdt.slice(-3)}
                </div>
              )}
              {isEditing && (
                <div className="avatar-overlay">
                  <i className="fa-solid fa-camera"></i>
                </div>
              )}
            </div>
            <h3>Xin chào, {fullName || 'Bạn'}!</h3>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Phần form thông tin cá nhân */}
          <div className="info-card">
            <div className="card-header">
              <h3>Thông tin cá nhân</h3>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Hủy
                  </button>
                  <button className="save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              )}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Họ và tên</label>
                {isEditing ? (
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                ) : (
                  <p>{fullName || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Số điện thoại</label>
                <p className="readonly-text">{user.sdt}</p>
              </div>

              <div className="info-item">
                <label>Email</label>
                {isEditing ? (
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                ) : (
                  <p>{email || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div className="info-item full-width">
                <label>Địa chỉ giao hàng mặc định</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ..."
                  />
                ) : (
                  <p>{address || 'Chưa có địa chỉ'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin đăng nhập giữ nguyên */}
          <div className="info-card">
            <div className="card-header">
              <h3>Thông tin đăng nhập</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Phương thức</label>
                <p>{user.email ? 'Google' : 'Số điện thoại & Mật khẩu'}</p>
              </div>
              <div className="info-item">
                <label>Vai trò</label>
                <p>{user.role === 1 ? 'Khách hàng' : 'Quản trị viên'}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;