import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Về Chúng Tôi</h1>
                    <p className="hero-subtitle">
                        Nơi công nghệ gặp gỡ sự tin cậy - Mang đến trải nghiệm mua sắm điện thoại tuyệt vời nhất
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story">
                <div className="story-container">
                    <div className="story-content">
                        <h2 className="section-title">Về chúng tôi</h2>
                        <p className="story-text">
                            ManagePhone được thành lập với sứ mệnh mang đến cho khách hàng những sản phẩm
                            điện thoại di động chính hãng, chất lượng cao với giá cả hợp lý nhất. Chúng tôi
                            hiểu rằng điện thoại không chỉ là một thiết bị, mà là người bạn đồng hành không
                            thể thiếu trong cuộc sống hiện đại.
                        </p>
                        <p className="story-text">
                            Với đội ngũ nhân viên giàu kinh nghiệm và am hiểu công nghệ, chúng tôi cam kết
                            tư vấn tận tâm, giúp bạn tìm được chiếc điện thoại phù hợp nhất với nhu cầu và
                            ngân sách của mình.
                        </p>
                    </div>
                    <div className="story-image">
                        <div className="image-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values">
                <h2 className="section-title">Giá Trị Cốt Lõi</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>
                        <h3 className="value-title">Chất Lượng</h3>
                        <p className="value-description">
                            100% sản phẩm chính hãng, được kiểm tra kỹ lưỡng trước khi đến tay khách hàng
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <h3 className="value-title">Uy Tín</h3>
                        <p className="value-description">
                            Cam kết bảo hành đầy đủ, chính sách đổi trả linh hoạt trong vòng 30 ngày
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <h3 className="value-title">Tận Tâm</h3>
                        <p className="value-description">
                            Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng 24/7 mọi lúc mọi nơi
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                            </svg>
                        </div>
                        <h3 className="value-title">Giá Tốt</h3>
                        <p className="value-description">
                            Cam kết giá cạnh tranh nhất thị trường với nhiều chương trình ưu đãi hấp dẫn
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="about-stats">
                <div className="stats-container">
                    <div className="stat-item">
                        <div className="stat-number">10K+</div>
                        <div className="stat-label">Khách Hàng Tin Tưởng</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">500+</div>
                        <div className="stat-label">Sản Phẩm Đa Dạng</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Thương Hiệu Uy Tín</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">99%</div>
                        <div className="stat-label">Khách Hàng Hài Lòng</div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="about-team">
                <h2 className="section-title">Đội Ngũ Của Chúng Tôi</h2>
                <p className="team-subtitle">
                    Những con người tận tâm đứng sau thành công của ManagePhone
                </p>
                <div className="team-grid">
                    <div className="team-member">
                        <div className="member-avatar" style={{ backgroundImage: "url('https://sf-static.upanhlaylink.com/img/image_202601096a91dc2de6b3087f17c8c49fa26425a9.jpg')" }}>
                        </div>
                        <h3 className="member-name">Nguyễn Văn Thắng</h3>
                        <p className="member-role">Founder & CEO</p>
                        <p className="member-description">
                            10+ năm kinh nghiệm trong ngành công nghệ di động
                        </p>
                    </div>

                    <div className="team-member">
                        <div className="member-avatar" style={{ backgroundImage: "url('https://sf-static.upanhlaylink.com/img/image_202601099bd8ce3ae9abf8d32173a3b848511dfd.jpg')" }}>
                        </div>
                        <h3 className="member-name">Lê Đại Thành</h3>
                        <p className="member-role">Giám đốc vận hành</p>
                        <p className="member-description">
                            Chuyên gia quản lý chuỗi cung ứng và logistics
                        </p>
                    </div>

                    <div className="team-member">
                        <div className="member-avatar" style={{ backgroundImage: "url('https://sf-static.upanhlaylink.com/img/image_202601098645883628fbb3c53bf983d8afd780c9.jpg')" }}>
                        </div>
                        <h3 className="member-name">Nguyễn Đức Thắng</h3>
                        <p className="member-role">Giám đốc công nghệ</p>
                        <p className="member-description">
                            Chuyên gia công nghệ với nhiều chứng chỉ quốc tế
                        </p>
                    </div>

                    <div className="team-member">
                        <div className="member-avatar" style={{ backgroundImage: "url('https://sf-static.upanhlaylink.com/img/image_202601093dc53a6a355e2653f988ad99b14cbd1f.jpg')" }}>
                        </div>
                        <h3 className="member-name">Phạm Thiện Tâm</h3>
                        <p className="member-role">Giám đốc khách hàng</p>
                        <p className="member-description">
                            Đam mê mang đến trải nghiệm tốt nhất cho khách hàng
                        </p>
                    </div>
                    <div className="team-member">
                        <div className="member-avatar" style={{ backgroundImage: "url('https://sf-static.upanhlaylink.com/img/image_20260109bdbde246b585868222a30a26a79302c1.jpg')" }}>
                        </div>
                        <h3 className="member-name">Nguyễn Viết Lâm Phong</h3>
                        <p className="member-role">Giám đốc sản phẩm</p>
                        <p className="member-description">
                            Đam mê mang đến trải nghiệm tốt nhất cho khách hàng
                        </p>
                    </div>
                </div>
            </section >

            {/* Contact CTA Section */}
            < section className="about-cta" >
                <div className="cta-content">
                    <h2 className="cta-title">Sẵn Sàng Trải Nghiệm?</h2>
                    <p className="cta-description">
                        Hãy để chúng tôi giúp bạn tìm được chiếc điện thoại hoàn hảo
                    </p>
                    <div className="cta-buttons">
                        <a href="/products" className="cta-button primary">
                            Khám Phá Sản Phẩm
                        </a>
                        <a href="/contact" className="cta-button secondary">
                            Liên Hệ Ngay
                        </a>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default AboutPage;
