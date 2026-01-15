import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UserCog, ShoppingCart, History, LogOut, Bell, Search, BadgePercent } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CategoryService from "../../services/CategoryService";
import productService from "../../services/ProductService";
import type { ICategory, IProduct, Brand } from "../../services/Interface";
import { notificationService } from "../../services/NotificationService";
import CategoryDropdown from '../CategoryDropdown/CategoryDropdown';
import './header.css';
import Logo from "../../assets/img/logo.png";
import cartDetailService from "../../services/CartDetailService";
import cartService from '../../services/CartService';
import type { CartDetailResponse } from "../../services/Interface";


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brandsByCategory, setBrandsByCategory] = useState<Record<number, Brand[]>>({});
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<IProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    if (!user?.userId) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await notificationService.getUserNotifications(user.userId);
      const readKeys: string[] = JSON.parse(
        localStorage.getItem(`read_notification_keys_user_${user.userId}`) || "[]"
      );

      const buildBaseKey = (n: any) => `${n.notificationType}|${n.title}|${n.content}`;
      const unread = data.filter(n => !readKeys.includes(buildBaseKey(n))).length;


      setUnreadCount(unread);
    } catch (err) {
      console.error("Load unread notification count failed", err);
    }
  };

  const loadCartCount = async () => {
    if (!user?.userId) {
      setCartCount(0);
      return;
    }

    let cartId = localStorage.getItem("cartId");

    try {
      if (!cartId) {
        const cartRes = await cartService.getCartByUser(user.userId);
        const cart = cartRes.data;

        if (!cart?.cartId) {
          setCartCount(0);
          return;
        }

        cartId = String(cart.cartId);
        localStorage.setItem("cartId", cartId);
      }

      const details: CartDetailResponse[] =
        await cartDetailService.getByCartId(Number(cartId));

      const uniqueProductCount = new Set(
        details.map(d =>
          d.product.productId ??
          (d.product as any).ProductID ??
          (d.product as any).id
        )
      ).size;


      setCartCount(uniqueProductCount);
    } catch (err) {
      console.error("Load cart count failed", err);
      setCartCount(0);
    }
  };


  useEffect(() => {
    loadUnreadCount();
  }, [location.pathname, user]);

  // useEffect(() => {
  //   const syncUnread = () => loadUnreadCount();
  //   window.addEventListener("focus", syncUnread);
  //   window.addEventListener("notification-read", syncUnread);
  //   const reload = () => loadCartCount();
  //   window.addEventListener("cart-updated", reload);

  //   return () => {
  //     window.removeEventListener("cart-updated", reload);
  //   };
  // }, [user]);

  const displayName = useMemo(() => user?.fullName || "Người dùng", [user]);
  const avatarUrl = useMemo(() => user?.avatar || "src/assets/img/default-avatar.png", [user]);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    loadCartCount();

    const reload = () => loadCartCount();
    window.addEventListener("cart-updated", reload);
    window.addEventListener("focus", reload);

    return () => {
      window.removeEventListener("cart-updated", reload);
      window.removeEventListener("focus", reload);
    };
  }, [user]);


  // SỬA TẠI ĐÂY: Tải danh mục và tải luôn toàn bộ brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await CategoryService.getCategories();
        setCategories(cats);

        if (cats.length > 0) {
          setIsLoadingBrands(true);
          const brandPromises = cats.map(cat =>
            CategoryService.getBrandsByCategory(cat.categoryId)
              .then(brands => ({ id: cat.categoryId, brands }))
              .catch(() => ({ id: cat.categoryId, brands: [] }))
          );

          const results = await Promise.all(brandPromises);
          const brandMap: Record<number, Brand[]> = {};
          results.forEach(res => {
            brandMap[res.id] = res.brands;
          });
          setBrandsByCategory(brandMap);
          setIsLoadingBrands(false);
        }
      } catch (err: any) {
        console.error("Get initial data error:", err.message);
        setIsLoadingBrands(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!keyword.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await productService.getAllProducts(keyword.trim());
        setSearchSuggestions(results.slice(0, 4));
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams();
      if (keyword.trim()) params.set("keyword", keyword.trim());
      navigate(`/products?${params.toString()}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    navigate(`/products?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (productId: number) => {
    navigate(`/product-detail/${productId}`);
    setShowSuggestions(false);
    setKeyword("");
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("cart_items");
    localStorage.removeItem("cart_count");
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
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="header-container">
          <div className="header-content">
            <div className="header-logo" onClick={() => navigate('/')}>
              <img src={Logo} alt="CellphoneS" className="logo-img" />
            </div>

            <div className="header-search" ref={searchRef}>
              <div className="search-wrapper">
                <input type="text" name="email" autoComplete="username" style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0 }} />
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Bạn cần tìm gì?"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => { if (searchSuggestions.length > 0) setShowSuggestions(true); }}
                />
                <button type="button" className="search-btn" onClick={handleSearchClick}>
                  <Search size={18} />
                </button>
              </div>

              {keyword.trim() && (
                <div className="search-dropdown">
                  {isSearching ? (
                    <div className="search-loading">Đang tìm kiếm...</div>
                  ) : showSuggestions && searchSuggestions.length > 0 ? (
                    <>
                      <div className="search-dropdown-header"><span>Gợi ý sản phẩm</span></div>
                      <div className="search-dropdown-list">
                        {searchSuggestions.map((product) => (
                          <div key={product.productId} className="search-dropdown-item" onClick={() => handleSuggestionClick(product.productId!)}>
                            <img src={product.productImages?.[0]?.url || Logo} alt={product.name} className="search-item-img" />
                            <div className="search-item-info">
                              <p className="search-item-name">{product.name}</p>
                              <p className="search-item-price">{product.price?.toLocaleString('vi-VN')}đ</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="search-dropdown-footer">
                        <button className="search-view-all" onClick={handleSearchClick}>
                          Xem tất cả kết quả cho "{keyword}"
                        </button>
                      </div>
                    </>
                  ) : showSuggestions && searchSuggestions.length === 0 ? (
                    <div className="search-loading">Không tìm thấy sản phẩm</div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="hotline">
              <i className="fas fa-headset"></i> Hotline: 19001599
            </div>

            <div className="header-actions">
              <button className="action-btn" title="Thông báo" onClick={() => navigate('/notification')}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="action-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
              </button>

              <button className="action-btn" title="Giỏ hàng" onClick={() => navigate('/cartShop')}>
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="action-badge">{cartCount > 99 ? "99+" : cartCount}</span>}
              </button>

              {user ? (
                <div className="user-menu">
                  <button className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div className="user-avatar"><img src={avatarUrl} alt={displayName} /></div>
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="dropdown-overlay" onClick={() => setDropdownOpen(false)} />
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
                            <div><p className="item-title">Giỏ hàng & Thanh toán</p></div>
                          </button>

                          <div className="dropdown-item" onClick={() => { navigate('/discount'); setDropdownOpen(false); }}>
                            <BadgePercent size={20} />
                            <div><p className="title">Mã giảm giá</p></div>
                          </div>

                          <button className="dropdown-item" onClick={() => { navigate('/historyOrder'); setDropdownOpen(false); }}>
                            <History size={20} />
                            <div><p className="item-title">Lịch sử mua hàng</p></div>
                          </button>

                          <hr className="dropdown-divider" />

                          <button className="dropdown-item logout" onClick={handleLogout}>
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
            <div className="menu-left" ref={categoryRef} onMouseEnter={() => setShowCategoryMenu(true)} onMouseLeave={() => setShowCategoryMenu(false)}>
              <i className="fa fa-bars"></i>
              <span>Tất cả danh mục</span>

              {showCategoryMenu && (
                <CategoryDropdown
                  categories={categories}
                  brandsByCategory={brandsByCategory}
                  isLoadingBrands={isLoadingBrands}
                  onClose={() => setShowCategoryMenu(false)}
                />
              )}
            </div>

            <div className="nav-links">
              <a onClick={() => navigate('/')}>Trang chủ</a>
              <a onClick={() => navigate('/about')}>Giới thiệu</a>
              <a onClick={() => navigate('/products')}>Sản phẩm</a>
              <a onClick={() => navigate('/historyOrder')}>Lịch sử</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;