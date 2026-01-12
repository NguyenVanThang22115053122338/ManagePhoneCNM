import React, { useState, useEffect, useRef } from 'react';
import './Account.css';
import { useAuth } from '../../context/AuthContext';
import type { IUser } from '../../services/Interface';
import { updateUser } from '../../services/UserService';

const AccountPage: React.FC = () => {
  const { user: authUser, loading: authLoading, updateUserContext } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authUser) {
      setFullName(authUser.fullName || '');
      setEmail(authUser.email || '');
      setAddress(authUser.address || '');
    }
  }, [authUser?.fullName, authUser?.email, authUser?.address]);

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
    if (!authUser) return;

    setSaving(true);
    try {
      const dto: any = {};
      if (fullName.trim() !== (authUser.fullName || '')) dto.fullName = fullName.trim();
      if (email.trim() !== (authUser.email || '')) dto.email = email.trim();
      if (address.trim() !== (authUser.address || '')) dto.address = address.trim();

      const identifier = (authUser.sdt || authUser.email)!;
      const res = await updateUser(identifier, dto, avatarFile || undefined);
      
      const backendData: any = res.user ?? res; // ✅ Dùng any vì backend response khác format

      // ✅ Chuyển đổi từ backend format (PascalCase) sang IUser format (camelCase)
      const normalizedUser: IUser = {
        userId: backendData.UserID || authUser.userId,
        sdt: backendData.SDT || authUser.sdt,
        fullName: backendData.FullName,
        email: backendData.Email,
        address: backendData.Address,
        avatar: backendData.Avatar,
        role: backendData.RoleID || authUser.role,
      };

      // ✅ Cập nhật context với data đã chuẩn hóa
      updateUserContext(normalizedUser);
      
      setAvatarFile(null);

      alert('Cập nhật thông tin thành công!');
      setIsEditing(false);

    } catch (err: any) {
      console.error('❌ Lỗi cập nhật:', err);
      alert(err.response?.data?.message || 'Cập nhật thất bại!');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (authUser) {
      setFullName(authUser.fullName || '');
      setEmail(authUser.email || '');
      setAddress(authUser.address || '');
    }
    setAvatarPreview(null);
    setAvatarFile(null);
    setIsEditing(false);
  };

  if (authLoading || !authUser) {
    return (
      <div className="account-container">
        <div className="loading">Đang tải thông tin tài khoản...</div>
      </div>
    );
  }

  const displayAvatar = avatarPreview || authUser.avatar;

  return (
    <div className="account-container">
      <div className="account-wrapper">
        <main className="account-main">
          <h2 className="page-title">Thông tin tài khoản</h2>

          <div className="profile-header" style={{ marginBottom: '30px' }}>
            <div
              className="avatar-large"
              onClick={handleAvatarClick}
              style={{ cursor: isEditing ? 'pointer' : 'default' }}
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="avatar-img"
                />
              ) : (
                <div className="avatar-fallback">
                  {authUser.sdt?.slice(-3) || '???'}
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

          <div className="info-card">
            <div className="card-header">
              <h3>Thông tin cá nhân</h3>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={handleCancel}>
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
                <p className="readonly-text">{authUser.sdt}</p>
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

          <div className="info-card">
            <div className="card-header">
              <h3>Thông tin đăng nhập</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Phương thức</label>
                <p>{authUser.email ? 'Google' : 'Số điện thoại & Mật khẩu'}</p>
              </div>
              <div className="info-item">
                <label>Vai trò</label>
                <p>{authUser.role === 1 ? 'Khách hàng' : 'Quản trị viên'}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;