// src/pages/ProductReviewPage/ProductReviewPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import reviewService from "../../services/ReviewService";
import "./ProductReviewPage.css";

export default function ProductReviewPage() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleRemovePhoto = () => {
        setPhoto(null);
        if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
            setPhotoPreview(null);
        }
    };

    const handleRemoveVideo = () => {
        setVideo(null);
        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
            setVideoPreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!productId) return;
        
        if (!comment.trim()) {
            alert("Vui lòng nhập nội dung đánh giá");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("productID", productId);
        formData.append("rating", rating.toString());
        formData.append("comment", comment.trim());

        if (photo) formData.append("photo", photo);
        if (video) formData.append("video", video);

        try {
            await reviewService.createReview(formData);
            alert("Đánh giá thành công! Cảm ơn bạn đã chia sẻ.");
            navigate(-1);
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRatingText = (rating: number) => {
        switch (rating) {
            case 5: return "Tuyệt vời";
            case 4: return "Hài lòng";
            case 3: return "Bình thường";
            case 2: return "Không hài lòng";
            case 1: return "Rất tệ";
            default: return "";
        }
    };

    return (
        <div className="review-page-container">
            <div className="review-form-card">
                <div className="form-header">
                    <button 
                        onClick={() => navigate(-1)}
                        type="button"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1>Đánh giá sản phẩm</h1>
                </div>

                <div className="rating-section">
                    <label>Đánh giá của bạn</label>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map(n => (
                            <span
                                key={n}
                                className={`star ${n <= rating ? "active" : ""}`}
                                onClick={() => setRating(n)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <span className="rating-text">
                        {getRatingText(rating)}
                    </span>
                </div>

                <div className="comment-section">
                    <label>
                        Nhận xét của bạn 
                        <span className="required">*</span>
                    </label>
                    <textarea
                        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={6}
                        maxLength={1000}
                    />
                    <div className="char-count">
                        {comment.length}/1000 ký tự
                    </div>
                </div>

                <div className="media-section">
                    <label>Thêm hình ảnh hoặc video (tùy chọn)</label>
                    <div className="media-upload">
                        <div className="upload-box">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                id="photo-upload"
                            />
                            <label htmlFor="photo-upload" className="upload-label">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="preview-img" />
                                ) : (
                                    <>
                                        <i className="fa-solid fa-image"></i>
                                        <span>Thêm ảnh</span>
                                    </>
                                )}
                            </label>
                            {photoPreview && (
                                <button 
                                    className="remove-btn" 
                                    onClick={handleRemovePhoto}
                                    type="button"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>

                        <div className="upload-box">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                id="video-upload"
                            />
                            <label htmlFor="video-upload" className="upload-label">
                                {videoPreview ? (
                                    <video src={videoPreview} className="preview-video" />
                                ) : (
                                    <>
                                        <i className="fa-solid fa-video"></i>
                                        <span>Thêm video</span>
                                    </>
                                )}
                            </label>
                            {videoPreview && (
                                <button 
                                    className="remove-btn" 
                                    onClick={handleRemoveVideo}
                                    type="button"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="media-note">
                        <i className="fa-solid fa-circle-info"></i>
                        Bạn có thể thêm 1 ảnh và 1 video để đánh giá sinh động hơn
                    </p>
                </div>

                <div className="form-actions">
                    <button 
                        className="btn-cancel" 
                        onClick={() => navigate(-1)}
                        type="button"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button 
                        className="btn-submit" 
                        onClick={handleSubmit}
                        type="button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-paper-plane"></i>
                                Gửi đánh giá
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}