import React, { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ICategory,CategoryDropdownProps ,Brand } from "../../services/Interface";
import './CategoryDropdown.css';
import { brandService } from "../../services/BrandService";


const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories, onClose }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [brands, setBrands] = useState<Brand[]>([]);
  
    useEffect(() => {
      brandService.getAll()
        .then(setBrands)
        .catch(err => console.error("Load brands error:", err));
    }, []);
  
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
              onMouseEnter={() => setActiveTab(index)}
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
              <div className="header-title">
                <span>{cat.description}</span>
                <i className="fas fa-angle-right angle-icon"></i>
              </div>
  
              <div className="brands-list">
                {brands.map(brand => (
                  <div
                    key={brand.brandId}
                    className="brand-item"
                    onClick={() => handleBrandClick(brand.brandId!)}
                  >
                    <span className="brand-name">{brand.name}</span>
                    <span className="brand-country">{brand.country}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CategoryDropdown;