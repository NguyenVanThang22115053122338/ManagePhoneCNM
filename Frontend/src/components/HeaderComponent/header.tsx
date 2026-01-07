import React, { useState, useMemo, useEffect } from 'react';
import Logo from "../../assets/img/logo.png";
import "./header.css";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCog, ShoppingCart, History, LogOut } from 'lucide-react';
import CategoryService from "../../services/CategoryService";
import type { ICategory } from "../../services/Interface";

interface TabItem {
  key: string;
  label: string;
  route: string;
}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [keyword, setKeyword] = useState("");


  const displayName = useMemo(
    () => user?.fullName || "Người dùng",
    [user]
  );

  const avatarText = useMemo(
    () => displayName.slice(-3).toUpperCase(),
    [displayName]
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


  const categoryTabs: TabItem[] = useMemo(
    () =>
      categories.map(c => ({
        key: `cat-${c.categoryId}`,
        label: c.categoryName,
        route: `/products`,
      })),
    [categories]
  );

  const allProductsTab: TabItem = {
    key: "all",
    label: "Tất cả",
    route: "/products",
  };

  const staticTabs: TabItem[] = [
    { key: "blog", label: "Blog về chúng tôi", route: "/about" },
    { key: "history", label: "Lịch sử mua hàng", route: "/historyOrder" },
  ];

  const allTabs: TabItem[] = [
    allProductsTab,
    ...categoryTabs,
    ...staticTabs,
  ];


  const activeKey = useMemo(() => {
    if (categories.length === 0) return undefined;

    const params = new URLSearchParams(location.search);
    const categoryId =
      params.get("categoryId") || params.get("category_id");

    if (location.pathname === "/products" && !categoryId) {
      return "all";
    }

    if (categoryId) return `cat-${categoryId}`;

    const staticTab = staticTabs.find(t =>
      location.pathname.startsWith(t.route)
    );

    return staticTab?.key;
  }, [categories.length, location.pathname, location.search]);



  const handleTabChange = (key: string) => {
    const tab = allTabs.find(t => t.key === key);
    if (!tab) return;

    if (key === "all") {
      navigate("/products");
    }

    else if (key.startsWith("cat-")) {
      const categoryId = key.replace("cat-", "");
      const params = new URLSearchParams();

      params.set("categoryId", categoryId);

      if (keyword.trim()) {
        params.set("keyword", keyword.trim());
      }

      navigate(`/products?${params.toString()}`);
    }
    else {
      navigate(tab.route);
    }

    setDropdownOpen(false);
  };



  const items: TabsProps["items"] = allTabs.map(tab => ({
    key: tab.key,
    label: tab.label,
  }));


  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="header">
      <div className="navbar-top">
        <div className="top-left">
          <div className="logo" onClick={() => navigate('/')}>
            <img className="logo-link-img" src={Logo} alt="Logo" />
          </div>

          <div className="navbar-filter">
            <div className="search-wrapper">
              <i className="fa-solid fa-location-dot search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm sản phẩm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const params = new URLSearchParams();

                    if (keyword.trim()) params.set("keyword", keyword.trim());

                    navigate(`/products?${params.toString()}`);
                  }
                }}
              />
            </div>
            <div className="filter-wrapper">
              <i className="fa-solid fa-filter"></i>
              <span className="filter-text">Bộ lọc</span>
            </div>
          </div>
        </div>

        <div className="top-right-wrapper">
          <ul className="list-user-actions">
            <li className="list-user-item" onClick={() => navigate('/notification')}>
              <i className="fa-solid fa-bell"></i>
              <p className="list-user-item-text">Thông báo</p>
            </li>
            <li className="list-user-item" onClick={() => navigate('/cartShop')}>
              <i className="fa-solid fa-cart-shopping"></i>
              <p className="list-user-item-text">Giỏ hàng</p>
            </li>

            {user ? (
              <li className="list-user-item user-avatar-item">
                <div
                  className="user-avatar-trigger"
                  onClick={() => setDropdownOpen(v => !v)}
                >
                  <div className="avatar-circle">{avatarText}</div>
                  <div className="user-info">
                    <p className="greeting">Xin chào</p>
                    <p className="phone">{displayName}</p>
                  </div>
                  <svg
                    className={`arrow ${dropdownOpen ? 'rotated' : ''}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
              </li>
            ) : (
              <li
                className="list-user-item login-btn"
                onClick={() => navigate('/login')}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <p className="list-user-item-text">Đăng nhập</p>
              </li>
            )}
          </ul>

          {user && dropdownOpen && (
            <>
              <div
                className="dropdown-overlay"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p>Tài khoản của tôi</p>
                  <p className="phone-big">{displayName}</p>
                </div>

                <div className="dropdown-body">
                  <div
                    className="dropdown-item"
                    onClick={() => { navigate('/account'); setDropdownOpen(false); }}
                  >
                    <UserCog size={20} />
                    <div>
                      <p className="title">Quản lý hồ sơ</p>
                      <p className="desc">Thông tin cá nhân, đổi mật khẩu</p>
                    </div>
                  </div>

                  <div
                    className="dropdown-item"
                    onClick={() => { navigate('/cartShop'); setDropdownOpen(false); }}
                  >
                    <ShoppingCart size={20} />
                    <div>
                      <p className="title">Giỏ hàng & Thanh toán</p>
                    </div>
                  </div>

                  <div
                    className="dropdown-item"
                    onClick={() => { navigate('/historyOrder'); setDropdownOpen(false); }}
                  >
                    <History size={20} />
                    <div>
                      <p className="title">Lịch sử mua hàng</p>
                    </div>
                  </div>

                  <hr />

                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Đăng xuất</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="navbar-bot">
        {categories.length > 0 && (
          <Tabs
            className="list-category"
            activeKey={activeKey}
            items={items}
            onChange={handleTabChange}
          />
        )}
      </div>

    </div>
  );
};

export default Header;
