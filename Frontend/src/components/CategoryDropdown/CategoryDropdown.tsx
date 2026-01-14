import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ICategory, Brand } from "../../services/Interface";
import './CategoryDropdown.css';

interface CategoryDropdownProps {
  categories: ICategory[];
  brandsByCategory: Record<number, Brand[]>;
  onClose: () => void;
  isLoadingBrands: boolean;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ 
  categories, 
  brandsByCategory, 
  onClose,
  isLoadingBrands 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleMouseEnter = (index: number) => {
    setActiveTab(index);
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?categoryId=${categoryId}`);
    onClose();
  };

  const handleBrandClick = (brandId: number) => {
    navigate(`/products?brandId=${brandId}`);
    onClose();
  };

  return (
    <div className="dropdown-container">
      <div className="sidebar">
        {categories.map((cat, index) => (
          <div
            key={cat.categoryId}
            className={`sidebar-item ${activeTab === index ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleCategoryClick(cat.categoryId)}
          >
            {cat.description}
          </div>
        ))}
      </div>

      <div className="content-area">
        {categories.map((cat, index) => (
          <div
            key={cat.categoryId}
            className={`tab-content ${activeTab === index ? 'active' : ''}`}
          >
            <div className="header-title" onClick={() => handleCategoryClick(cat.categoryId)}>
              <span>{cat.description}</span>
              <i className="fas fa-angle-right angle-icon"></i>
            </div>

            <div className="brands-list">
              {isLoadingBrands && Object.keys(brandsByCategory).length === 0 ? (
                <div className="status-msg">Đang tải thương hiệu...</div>
              ) : !brandsByCategory[cat.categoryId] || brandsByCategory[cat.categoryId].length === 0 ? (
                <div className="status-msg">Không có thương hiệu</div>
              ) : (
                brandsByCategory[cat.categoryId].map(brand => (
                  <div
                    key={brand.brandId}
                    className="brand-item"
                    onClick={() => handleBrandClick(brand.brandId!)}
                  >
                    <span className="brand-name">{brand.name}</span>
                    <span className="brand-country">{brand.country}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;