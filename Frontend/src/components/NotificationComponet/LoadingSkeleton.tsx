import React from 'react';
import './LoadingSkeleton.css'; // sẽ gửi CSS ở dưới

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="loading-container">
      {/* Header skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-logo"></div>
        <div className="skeleton-search"></div>
        <div className="skeleton-actions">
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      </div>

      {/* Page title skeleton */}
      <div className="skeleton-title"></div>

      {/* Product grid skeleton */}
      <div className="skeleton-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-lines">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-price"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile version - list style */}
      <div className="skeleton-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-list-item">
            <div className="skeleton-image-sm"></div>
            <div className="skeleton-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-price-sm"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;