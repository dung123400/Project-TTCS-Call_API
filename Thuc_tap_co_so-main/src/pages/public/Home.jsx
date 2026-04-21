import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Bổ sung 2 import quan trọng này
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
    
    // Khai báo công cụ chuyển trang và lấy URL
    const navigate = useNavigate();
    const location = useLocation();
    
    // Bắt từ khóa tìm kiếm trên URL (VD: /home?search=laptop)
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search');

    // Nâng cấp useEffect để vừa gọi All vừa gọi Search
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Đường dẫn mặc định lấy TẤT CẢ
                let apiUrl = `http://localhost:8081/api/products`;
                
                // Nếu có chữ gõ tìm kiếm, đổi sang đường dẫn API search
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
    }, [searchTerm]); // searchTerm thay đổi -> Tự động gọi lại API

    // Hàm Thêm vào giỏ hàng
    const handleAddToCart = async (e, productId) => {
    e.stopPropagation();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert("Vui lòng đăng nhập để thêm đồ vào giỏ nhé!");
        navigate('/login');
        return;
    }

    // Lấy ID chuẩn của User
    const userId = user.userID || user.userid || user.id;

    try {
        // CHỈNH SỬA: Gửi dữ liệu qua BODY thay vì URL
        const response = await fetch(`http://localhost:8081/api/carts/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                variantId: productId, // Tạm thời dùng productId làm variantId để test
                quantity: 1
            })
        });

        if (response.ok) {
            alert("🛒 Đã thêm sản phẩm vào giỏ hàng thành công!");
        } else {
            // Nếu vẫn lỗi, in ra lỗi chi tiết từ Backend
            const errorData = await response.json();
            alert("Lỗi: " + (errorData.message || "Không thể thêm vào giỏ."));
        }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ:", error);
            alert("Không thể kết nối đến server!");
        }
    };

    return (
        <div className='home'>
            {/* Thanh nav trái */}
            <div className='home_navbar_left'>
                <div className='home_options'><img className='home_options_img' src={selling} alt="" /><b className='home_options_text'>Sản phẩm bán chạy</b></div>
                <div className='home_options'><img className='home_options_img' src={international} alt="" /><b className='home_options_text'>Săn hàng quốc tế</b></div>
                <div className='home_options'><img className='home_options_img' src={fashion} alt="" /><b className='home_options_text'>Thời trang nữ</b></div>
                <div className='home_options'><img className='home_options_img' src={cosmetics} alt="" /><b className='home_options_text'>Làm đẹp</b></div>
                <div className='home_options'><img className='home_options_img' src={phone} alt="" /><b className='home_options_text'>Đồ điện tử</b></div>
                <div className='home_options'><img className='home_options_img' src={sport} alt="" /><b className='home_options_text'>Thể thao</b></div>
                <div className='home_options'><img className='home_options_img' src={book} alt="" /><b className='home_options_text'>Tài liệu Giáo dục</b></div>
                <div className='home_options'><img className='home_options_img' src={household} alt="" /><b className='home_options_text'>Đồ gia dụng</b></div>
            </div>

            {/* Nội dung chính */}
            <div className='home_main_content'>
                {/* Quảng cáo */}
                <div className='home_ad'>
                    <img className='home_qc' src={qc1} alt="" />
                    <img className='home_qc_2' src={qc2} alt="" />
                </div>

                {/* Danh sách sản phẩm */}
                <div className='home_products'>
                    {products.length === 0 ? (
                        <p style={{textAlign: "center", padding: "20px", width: "100%"}}>Không tìm thấy sản phẩm nào phù hợp.</p>
                    ) : (
                        products.map((item) => (
                            <div 
                                className='product' 
                                key={item.productID || item.productid || item.id}
                                onClick={() => navigate(`/product/${item.productID || item.productid || item.id}`)}
                                style={{cursor: 'pointer'}}
                            >
                                <img
                                    src={defaultImg} 
                                    alt={item.productName || item.productname}
                                    className="product_img"
                                />
                                <div className="product_name">{item.productName || item.productname}</div>
                                <div className="product_rating">⭐⭐⭐⭐☆ <span className="product_sold">Đã bán 1.2k</span></div>
                                <div className="product_bottom">
                                    <span className="product_price">{item.price ? item.price.toLocaleString('vi-VN') : 0}đ</span>
                                    <button 
                                        className="product_btn"
                                        onClick={(e) => handleAddToCart(e, item.productID || item.productid || item.id)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}