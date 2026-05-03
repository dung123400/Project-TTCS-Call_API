import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/public/Home.css';
import book from './assets/book.png';
import cosmetics from './assets/cosmetics.png';
import fashion from './assets/fashion.png';
import household from './assets/household.png';
import international from './assets/international.png';
import phone from './assets/phone.png';
import selling from './assets/selling.png';
import sport from './assets/sport.png';
import qc1 from './assets/quangcao1.png';
import qc2 from './assets/quangcao2.png';
import defaultImg from './assets/muado.jpg';

export default function Home() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy từ khóa tìm kiếm từ URL
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search');

    // Fetch dữ liệu từ API (Tất cả hoặc Tìm kiếm)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let apiUrl = `http://localhost:8081/api/products`;
                if (searchTerm) {
                    apiUrl = `http://localhost:8081/api/products/search?keyword=${encodeURIComponent(searchTerm)}`;
                }

                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error("Lỗi API:", response.statusText);
                }
            } catch (error) {
                console.error("Không thể kết nối đến server:", error);
            }
        };
        fetchProducts();
    }, [searchTerm]);

    // Hàm Thêm vào giỏ hàng
    const handleAddToCart = async (e, variantId) => {
        e.stopPropagation(); // Chặn sự kiện click vào thẻ cha (chuyển trang chi tiết)

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Vui lòng đăng nhập để thêm đồ vào giỏ nhé!");
            navigate('/login');
            return;
        }

        const userId = user.userID || user.userid || user.id;

        try {
            const response = await fetch(`http://localhost:8081/api/carts/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    variantId: variantId, // Sử dụng mã biến thể chuẩn
                    quantity: 1
                })
            });

            if (response.ok) {
                alert("🛒 Đã thêm sản phẩm vào giỏ hàng thành công!");
            } else {
                const errorData = await response.json();
                alert("Lỗi: " + (errorData.message || "Không thể thêm vào giỏ."));
            }
        } catch (error) {
            alert("Không thể kết nối đến server!");
        }
    };

    return (
        <div className='home'>
            {/* Thanh điều hướng bên trái */}
            <div className='home_navbar_left'>
                <div className='home_options'><img className='home_options_img' src={selling} alt="" /><b>Sản phẩm bán chạy</b></div>
                <div className='home_options'><img className='home_options_img' src={international} alt="" /><b>Săn hàng quốc tế</b></div>
                <div className='home_options'><img className='home_options_img' src={fashion} alt="" /><b>Thời trang nữ</b></div>
                <div className='home_options'><img className='home_options_img' src={cosmetics} alt="" /><b>Làm đẹp</b></div>
                <div className='home_options'><img className='home_options_img' src={phone} alt="" /><b>Đồ điện tử</b></div>
                <div className='home_options'><img className='home_options_img' src={sport} alt="" /><b>Thể thao</b></div>
                <div className='home_options'><img className='home_options_img' src={book} alt="" /><b>Tài liệu Giáo dục</b></div>
                <div className='home_options'><img className='home_options_img' src={household} alt="" /><b>Đồ gia dụng</b></div>
            </div>

            {/* Nội dung chính giữa */}
            <div className='home_main_content'>
                {/* Banner quảng cáo */}
                <div className='home_ad'>
                    <img className='home_qc' src={qc1} alt="Ad 1" />
                    <img className='home_qc_2' src={qc2} alt="Ad 2" />
                </div>

                {/* Danh sách hiển thị sản phẩm */}
                <div className='home_products'>
                    {products.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px", width: "100%" }}>
                            Không tìm thấy sản phẩm nào phù hợp.
                        </p>
                    ) : (
                        products.map((item) => {
                            // Xử lý chuẩn xác các ID từ Backend trả về
                            const pid = item.productID || item.productid || item.id;
                            const vid = item.variantID || item.variantid || pid; // Fallback an toàn nếu chưa có biến thể
                            
                            return (
                                <div
                                    className='product'
                                    key={pid}
                                    onClick={() => navigate(`/product/${pid}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={item.imageURL || defaultImg} 
                                        alt={item.productName || "Sản phẩm"}
                                        className="product_img"
                                    />
                                    <div className="product_name">
                                        {item.productName || item.productname || "Sản phẩm chưa có tên"}
                                    </div>
                                    
                                    <div className="product_rating">
                                        {"⭐".repeat(Math.min(5, Math.floor(item.shopRating || 5)))}
                                        <span className="product_sold">
                                            {item.soldCount > 0 ? ` Đã bán ${item.soldCount}` : " Đã bán 0"}
                                        </span>
                                    </div>

                                    <div className="product_bottom">
                                        <span className="product_price">
                                            {item.price 
                                                ? Number(item.price).toLocaleString('vi-VN') + " ₫" 
                                                : "Liên hệ"}
                                        </span>
                                        <button 
                                            className="product_btn"
                                            onClick={(e) => handleAddToCart(e, vid)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}