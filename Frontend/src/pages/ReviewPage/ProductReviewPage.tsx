import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import reviewService from "../../services/ReviewService";

export default function ProductReviewPage() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);

    const handleSubmit = async () => {
        if (!productId) return;

        const formData = new FormData();
        formData.append("productID", productId);
        formData.append("rating", rating.toString());
        formData.append("comment", comment);

        if (photo) formData.append("photo", photo);
        if (video) formData.append("video", video);

        try {
            await reviewService.createReview(formData);
            alert("Đánh giá thành công");
            navigate(-1); // quay lại trang product
        } catch (e) {
            alert("Không thể gửi đánh giá");
        }
    };

    return (
        <div className="review-page">
            <h1>Đánh giá sản phẩm</h1>

            <div className="rating-input">
                {[1, 2, 3, 4, 5].map(n => (
                    <span
                        key={n}
                        style={{ cursor: "pointer", fontSize: 28 }}
                        onClick={() => setRating(n)}
                    >
                        {n <= rating ? "★" : "☆"}
                    </span>
                ))}
            </div>

            <textarea
                placeholder="Chia sẻ cảm nhận của bạn..."
                value={comment}
                onChange={e => setComment(e.target.value)}
            />

            <input
                type="file"
                accept="image/*"
                onChange={e => setPhoto(e.target.files?.[0] || null)}
            />

            <input
                type="file"
                accept="video/*"
                onChange={e => setVideo(e.target.files?.[0] || null)}
            />

            <button className="btn red" onClick={handleSubmit}>
                Gửi đánh giá
            </button>
        </div>
    );
}
