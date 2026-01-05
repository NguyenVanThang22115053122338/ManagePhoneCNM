// src/components/review/ReviewSection.tsx
import { useEffect, useMemo, useState } from "react";
import reviewService from "../../services/ReviewService";
import type { IReview } from "../../services/Interface";
import "./ReviewSection.css";

interface Props {
    productId: number;
}

export default function ReviewSection({ productId }: Props) {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        reviewService
            .getByProductId(productId)
            .then(res => {
                setReviews(res.data);
            })
            .catch(() => setReviews([]))
            .finally(() => setLoading(false));
    }, [productId]);


    const avgRating = useMemo(() => {
        if (!reviews.length) return 0;
        return (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        );
    }, [reviews]);

    if (loading) return <div className="review-loading">Đang tải đánh giá...</div>;

    return (
        <div className="review-box">
            <div className="review-summary">
                <div className="review-score">
                    <span className="score">{avgRating.toFixed(1)}</span>
                    <span className="stars">
                        {"★".repeat(Math.round(avgRating))}
                    </span>
                </div>
                <div className="review-count">
                    {reviews.length} đánh giá từ khách hàng
                </div>
            </div>

            {reviews.length === 0 && (
                <p className="review-empty">Chưa có đánh giá nào cho sản phẩm này</p>
            )}

            <div className="review-list">
                {reviews.map(r => (
                    <div key={r.reviewID} className="review-item">
                        <div className="review-header">
                            <strong>{r.userName}</strong>
                            <span className="stars">
                                {"★".repeat(r.rating)}
                            </span>
                        </div>

                        <p className="review-comment">{r.comment}</p>

                        {r.photoUrl && (
                            <img
                                src={r.photoUrl}
                                alt="review"
                                className="review-image"
                            />
                        )}

                        {r.videoUrl && (
                            <video
                                src={r.videoUrl}
                                controls
                                className="review-video"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
