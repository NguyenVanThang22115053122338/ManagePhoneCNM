import { useEffect, useMemo, useState } from "react";
import reviewService from "../../services/ReviewService";
import type { IReview } from "../../services/Interface";
import "./ReviewSection.css";

interface Props {
    productId: number;
    refreshTrigger?: number;
}

export default function ReviewSection({ productId, refreshTrigger }: Props) {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 3;

    useEffect(() => {
        setLoading(true);
        reviewService
            .getByProductId(productId)
            .then(res => setReviews(res.data.data))
            .catch(() => setReviews([]))
            .finally(() => setLoading(false));
    }, [productId, refreshTrigger]);

    const avgRating = useMemo(() => {
        if (!reviews.length) return 0;
        return reviews.reduce((sum, r) => sum + r.Rating, 0) / reviews.length;
    }, [reviews]);

    const ratingCounts = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        reviews.forEach(r => {
            if (r.Rating >= 1 && r.Rating <= 5) {
                counts[r.Rating - 1]++;
            }
        });
        return counts.reverse();
    }, [reviews]);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const formatDate = (dateInput: string | Date) => {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        return date.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    if (loading) return <div className="review-loading">Đang tải...</div>;

    return (
        <div className="review-container">
            <div className="review-stats">
                <div className="stats-left">
                    <div className="avg-score">{avgRating.toFixed(1)}</div>
                    <div className="stars-display">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.round(avgRating) ? "star filled" : "star"}>
                                ★
                            </span>
                        ))}
                    </div>
                    <p className="total-reviews">{reviews.length} đánh giá</p>
                </div>

                <div className="stats-right">
                    {[5, 4, 3, 2, 1].map((star, idx) => {
                        const count = ratingCounts[idx];
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        
                        return (
                            <div key={star} className="rating-bar">
                                <span className="bar-label">{star} ★</span>
                                <div className="bar-wrapper">
                                    <div className="bar-fill" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="bar-count">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="no-reviews">
                    <p>Chưa có đánh giá nào</p>
                </div>
            ) : (
                <>
                    <div className="reviews-list">
                        {currentReviews.map(review => (
                            <div key={review.ReviewID} className="review-card">
                                <div className="review-top">
                                    <div className="user-info">
                                        <img 
                                            src={review.Avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.FullName)}&background=dc2626&color=fff&bold=true`} 
                                            alt={review.FullName}
                                            className="avatar"
                                        />
                                        <div>
                                            <div className="user-name">{review.FullName}</div>
                                            <div className="review-date">{formatDate(review.CreatedAt)}</div>
                                        </div>
                                    </div>
                                    <div className="rating-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < review.Rating ? "star filled" : "star"}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <p className="review-text">{review.Comment}</p>

                                {(review.Photo || review.Video) && (
                                    <div className="review-media">
                                        {review.Photo && (
                                            <div className="media-item">
                                                <img src={review.Photo} alt="Review" className="media-img" />
                                            </div>
                                        )}
                                        {review.Video && (
                                            <div className="media-item">
                                                <video src={review.Video} controls className="media-video" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="page-btn"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                ‹
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    className={currentPage === i + 1 ? "page-btn active" : "page-btn"}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            
                            <button 
                                className="page-btn"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}