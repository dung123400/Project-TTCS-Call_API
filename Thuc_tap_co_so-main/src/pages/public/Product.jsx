import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/public/Product.css';
import defaultImg from './assets/muado.jpg'; 

export default function Product() {
    const { id } = useParams(); // Lấy ID từ thanh địa chỉ URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                // 1. Gọi API lấy chi tiết sản phẩm vừa tạo ở Backend
                const res = await fetch(`http://localhost:8081/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);

                    // 2. Gọi API lấy sản phẩm tương tự (Tính năng AI)
                    if (data.category) {
                        const categoryId = data.category.categoryID || data.category.id;
                        const similarRes = await fetch(`http://localhost:8081/api/products/${id}/similar?categoryId=${categoryId}`);
                        if (similarRes.ok) {
                            const similarData = await similarRes.json();
                            setSimilarProducts(similarData);
                        }
                    }
                }
            } catch (error) {
                console.error("Lỗi kết nối API:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProductData();
    }, [id]);

    if (loading) return <div className="loading-state">Đang tải thông tin sản phẩm...</div>;
    if (!product) return <div className="error-state">Không tìm thấy sản phẩm yêu cầu!</div>;

    return (
        <div className='product-detail-container'>
            {/* Nội dung chi tiết sản phẩm */}
            <div className='product-main-info'>
                <div className='product-image-section'>
                    <img src={defaultImg} alt={product.productName} className="main-product-img" />
                </div>
                <div className='product-info-section'>
                    <h1 className="product-name-title">{product.productName}</h1>
                    <div className="product-price-display">
                        {product.price?.toLocaleString('vi-VN')}đ
                    </div>
                    <div className='product-description-box'>
                        <h3>Mô tả chi tiết:</h3>
                        <p>{product.description || "Sản phẩm này hiện chưa có bài viết mô tả chi tiết."}</p>
                    </div>
                    <button className='add-cart-large-btn'>THÊM VÀO GIỎ HÀNG</button>
                </div>
            </div>

            {/* Danh sách sản phẩm tương tự (AI Gợi ý) */}
            {similarProducts.length > 0 && (
                <div className='similar-products-wrapper'>
                    <h2 className='section-title'>Sản phẩm tương tự có thể bạn quan tâm</h2>
                    <div className='similar-products-grid'>
                        {similarProducts.map(item => (
                            <div 
                                key={item.productID} 
                                className='similar-item-card' 
                                onClick={() => navigate(`/product/${item.productID}`)}
                            >
                                <img src={defaultImg} alt={item.productName} />
                                <div className='similar-info'>
                                    <p className='similar-name'>{item.productName}</p>
                                    <span className='similar-price'>{item.price?.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}