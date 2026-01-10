import React, { useState, useMemo, useEffect } from 'react';
import { UserCog, ShoppingCart, History, LogOut, Bell, Search, Filter, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CategoryService from "../../services/CategoryService";
import type { ICategory } from "../../services/Interface";
import './header.css'
import Logo from "../../assets/img/logo.png"

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);

  const displayName = useMemo(
    () => user?.fullName || "Người dùng",
    [user]
  );

  const avatarUrl = useMemo(
    () => user?.avatar || "src/assets/img/default-avatar.png",
    [user]
  );

  useEffect(() => {
    CategoryService.getCategories()
      .then(setCategories)
      .catch(err => console.error("GetCategory error:", err.message));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(location.search);

      if (keyword.trim()) {
        params.set("keyword", keyword.trim());
      } else {
        params.delete("keyword");
      }

      navigate(`/products?${params.toString()}`, { replace: true });
    }, 400);

    return () => clearTimeout(timeout);
  }, [keyword]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams();
      if (keyword.trim()) params.set("keyword", keyword.trim());
      navigate(`/products?${params.toString()}`);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="modern-header">
      {/* Top Bar */}
      <div className="header-top-bar">
        <div className="header-container">
          <div className="top-bar-content">
            <div className="top-bar-left">
              <span className="top-bar-item">
                <i className="fas fa-phone"></i> +0702-500-230
              </span>
              <span className="top-bar-item">
                <i className="fas fa-envelope"></i> thanh261220@gmail.com
              </span>
              <span className="top-bar-item">
                <i className="fas fa-map-marker-alt"></i> 48 Cao Thắng, TP. Đà Nẵng
              </span>
            </div>
            <div className="top-bar-right">
              <span className="top-bar-item">
                <i className="fas fa-dollar-sign"></i> Số dư
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <div className="header-logo" onClick={() => navigate('/')}>
              <img src={Logo} alt="CellphoneS" className="logo-img" />
            </div>

            {/* Search Bar */}
            <div className="header-search">
              <div className="search-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Bạn cần tìm gì?"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <button
                  type="button"
                  className="search-btn"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (keyword.trim()) params.set("keyword", keyword.trim());
                    navigate(`/products?${params.toString()}`);
                  }}
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Hotline */}
            <div className="hotline">
              <i className="fas fa-headset"></i> Hotline: 19001599
            </div>

            {/* Actions */}
            <div className="header-actions">
              <button className="action-btn" title="Thông báo" onClick={() => navigate('/notification')}>
                <Bell size={20} />
              </button>

              <button className="action-btn" title="Vị trí" onClick={() => console.log('Location')}>
                <i className="fas fa-map-marker-alt"></i>
                <span className="action-badge">5</span>
              </button>

              <button className="action-btn" title="Giỏ hàng" onClick={() => navigate('/cartShop')}>
                <ShoppingCart size={20} />
                <span className="action-badge">3</span>
              </button>

              {user ? (
                <div className="user-menu">
                  <button
                    className="user-trigger"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="user-avatar">
                      <img src={avatarUrl} alt={displayName} />
                    </div>
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        className="dropdown-overlay"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="user-dropdown">
                        <div className="dropdown-header">
                          <p className="dropdown-greeting">Tài khoản của tôi</p>
                          <p className="dropdown-name">{displayName}</p>
                        </div>

                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={() => { navigate('/account'); setDropdownOpen(false); }}>
                            <UserCog size={20} />
                            <div>
                              <p className="item-title">Quản lý hồ sơ</p>
                              <p className="item-desc">Thông tin cá nhân, đổi mật khẩu</p>
                            </div>
                          </button>

                          <button className="dropdown-item" onClick={() => { navigate('/cartShop'); setDropdownOpen(false); }}>
                            <ShoppingCart size={20} />
                            <div>
                              <p className="item-title">Giỏ hàng & Thanh toán</p>
                            </div>
                          </button>

                          <button className="dropdown-item" onClick={() => { navigate('/historyOrder'); setDropdownOpen(false); }}>
                            <History size={20} />
                            <div>
                              <p className="item-title">Lịch sử mua hàng</p>
                            </div>
                          </button>

                          <hr className="dropdown-divider" />

                          <button
                            className="dropdown-item logout"
                            onClick={handleLogout}
                          >
                            <LogOut size={20} />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button className="action-btn" title="Tài khoản" onClick={() => navigate('/login')}>
                  <i className="fas fa-user"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="header-nav">
        <div className="header-container">
          <div className="nav-content">
            <div className="nav-menu-left">
              <i className="fa fa-bars"></i>
              <span>Tất cả danh mục</span>
            </div>

            <div className="nav-tabs">
              <button className="nav-tab" onClick={() => navigate('/')}>
                Trang chủ
              </button>

              <button className="nav-tab" onClick={() => navigate('/about')}>
                Giới thiệu
              </button>

              <button className="nav-tab" onClick={() => navigate('/products')}>
                Sản phẩm
              </button>

              <button className="nav-tab" onClick={() => navigate('/historyOrder')}>
                Lịch sử
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;