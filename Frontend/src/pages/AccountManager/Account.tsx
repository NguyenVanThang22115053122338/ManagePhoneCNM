import React, { useState, useEffect, useRef } from 'react';
import './Account.css';
import { useAuth } from '../../context/AuthContext';
import type { IUser } from '../../services/Interface';
import { userService } from '../../services/UserService';
import { normalizeUser } from '../../utils/normalizeUser';

const AccountPage: React.FC = () => {
  const {
    user: authUser,
    loading: authLoading,
    updateUserContext
  } = useAuth();

  const [user, setUser] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [sdt, setSdt] = useState('');


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
    setSdt(authUser.sdt || '');
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
      const dto: any = {};

      if (fullName.trim() !== (user.fullName || '')) dto.fullName = fullName.trim();
      if (email.trim() !== (user.email || '')) dto.email = email.trim();
      if (address.trim() !== (user.address || '')) dto.address = address.trim();

      // 1️⃣ update info + avatar
      let updatedUser = user;

      if (Object.keys(dto).length > 0 || avatarFile) {
        const identifier = user.sdt || user.email!;
        const res = await userService.updateUser(
          identifier,
          dto,
          avatarFile || undefined
        );

        const backendUser = res.user ?? res;
        updatedUser = normalizeUser(backendUser);
      }

      // 2️⃣ update phone (google user thêm / user thường đổi)
      if (sdt && sdt !== user.sdt) {
        const phoneRes = await userService.updatePhone(sdt);
        updatedUser = { ...updatedUser, sdt: phoneRes.sdt };
      }

      setUser(updatedUser);
      updateUserContext(updatedUser);

      setAvatarFile(null);
      alert('Cập nhật thông tin thành công!');
      setIsEditing(false);

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setChangingPassword(true);

      await userService.changePassword(
        newPassword,
        user?.sdt ? oldPassword : null
      );

      alert("Đổi mật khẩu thành công");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      alert(e.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
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
          <div className="info-card change-password">
            <div className="card-header">
              <h3>Thông tin cá nhân</h3>
              {!isEditing ? (
                <button className="account-btn" onClick={() => setIsEditing(true)}>
                  <i className="fa-solid fa-pen"></i>
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

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={sdt}
                      onChange={(e) => setSdt(e.target.value)}
                      disabled={!!user.googleId}
                      placeholder="Nhập số điện thoại"
                    />

                    {user.googleId && (
                      <small className="hint">
                        Tài khoản Google không thể đổi số điện thoại
                      </small>
                    )}
                  </>
                ) : (
                  <p>{sdt}</p>
                )}
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
                <p>{user.role === 1 ? 'Quản trị viên' : 'Khách hàng'}</p>
              </div>
            </div>
          </div>

          {!user.googleId && (
            <div className="info-card change-password">
              <div className="card-header">
                <h3>Đổi mật khẩu</h3>
              </div>

              <div className="info-grid">
                <div className="info-item full-width">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="info-item">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="info-item">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="info-item full-width">
                  <button
                    className="save-btn"
                    disabled={changingPassword}
                    onClick={async () => {
                      if (newPassword !== confirmPassword) {
                        alert("Mật khẩu xác nhận không khớp");
                        return;
                      }

                      try {
                        setChangingPassword(true);
                        await userService.changePassword(
                          newPassword,
                          user?.sdt ? oldPassword : null
                        );

                        alert("Đổi mật khẩu thành công");
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      } catch (e: any) {
                        alert(e.response?.data || "Đổi mật khẩu thất bại");
                      } finally {
                        setChangingPassword(false);
                      }
                    }}
                  >
                    {changingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AccountPage;