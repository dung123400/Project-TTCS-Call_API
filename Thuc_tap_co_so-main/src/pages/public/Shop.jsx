import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/public/Shop.css';
import avt from './assets/avt-shop.jpg';
import productImg from './assets/muado.jpg';

export default function Shop() {
    const { id } = useParams(); 
    const [shopData, setShopData] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Logic theo dõi (Follow)
    const [isFollowed, setIsFollowed] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);

    // 1. Gọi dữ liệu từ Backend khi mở trang
    useEffect(() => {
        const fetchShopData = async () => {
            try {
                // Lấy thông tin sốp
                const shopRes = await fetch(`http://localhost:8081/api/shops/${id}`);
                if (shopRes.ok) {
                    const data = await shopRes.json();
                    setShopData(data);
                    // Giả lập số người theo dõi nếu DB chưa có trường này
                    setFollowerCount(8200); 
                }

                // Lấy sản phẩm của sốp
                const productRes = await fetch(`http://localhost:8081/api/products/shop/${id}`);
                if (productRes.ok) {
                    setProducts(await productRes.json());
                }
            } catch (error) {
                console.error("Lỗi khi kết nối API sốp:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchShopData();
    }, [id]);

    // 2. Các hàm bổ trợ
    const handleFollow = () => {
        setIsFollowed(!isFollowed);
        setFollowerCount(prev => isFollowed ? prev - 1 : prev + 1);
    };

    const formatNumber = (num) => {
        return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
    };

    const renderStars = (score) => {
        const s = Math.round(score || 5);
        return "⭐".repeat(s) + "☆".repeat(5 - s);
    };

    const [savedVouchers, setSavedVouchers] = useState([]);
    const handleSaveVoucher = (vId) => {
        if (!savedVouchers.includes(vId)) setSavedVouchers([...savedVouchers, vId]);
    };

    // Vouchers mẫu (Khi nào Backend có API voucher thì thay sau)
    const vouchers = [
        { id: 1, discount: "100k", target: "Sản phẩm nhất định", expiry: "30.04.2026", status: "Còn" },
        { id: 2, discount: "50k", target: "Tất cả sản phẩm", expiry: "15.05.2026", status: "Còn" }
    ];

    if (loading) return <div style={{padding: '100px', textAlign: 'center'}}>Đang tìm sốp... 🔎</div>;
    if (!shopData) return <div style={{padding: '100px', textAlign: 'center'}}>Sốp không tồn tại! 😅</div>;

    const handleAddToCart = async (productId) => {
    // Tạm thời lấy variantId trùng với productId để test (Vì trang Shop chưa cho chọn size/màu)
    const variantId = productId; 
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.userID || 1;

    try {
        // CHÚ Ý: URL phải là /api/carts/add (Có chữ S)
        const response = await fetch('http://localhost:8081/api/carts/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                variantId: variantId, // Phải là variantId để khớp với Backend
                quantity: 1,
                userId: userId 
            })
        });

        if (response.ok) {
            alert("Thêm thành công! 🎉");
        } else {
            alert("Lỗi server rồi!");
        }
        } catch (error) {
            alert("Vẫn không kết nối được! Hãy kiểm tra xem Backend port 8081 đã RUN chưa?");
        }
    };
    
    return (
        <div className='shop-container'>
            <div className='shop-header'>
                <div className='shop-info'>
                    <div className='info-left'>
                        {/* Avatar thật hoặc ảnh mẫu */}
                        <img src={avt} alt="avatar" className='shop-avatar' />
                        <div className='shop-details'>
                            {/* shopName lấy đúng từ Entity Shop.java */}
                            <h1>{shopData.shopName}</h1>
                            <div className='rating'>
                                {renderStars(shopData.rating)}
                                <span className='rating-score'>{shopData.rating || 5.0} (Dữ liệu thật)</span>
                            </div>
                            <p className='description'>{shopData.description || "Chào mừng bạn đến với sốp!"}</p>
                        </div>
                    </div>

                    <div className='info-right'>
                        <div className='action-buttons'>
                            <button className={`btn-follow ${isFollowed ? 'followed' : ''}`} onClick={handleFollow}>
                                {isFollowed ? 'Đang theo dõi' : 'Theo dõi'}
                            </button>
                        </div>
                        <div className='stats'>
                            <div className='stat-item'>
                                <strong>{products.length}</strong>
                                <span>Sản phẩm</span>
                            </div>
                            <div className='stat-item'>
                                <strong>{formatNumber(followerCount)}</strong>
                                <span>Theo dõi</span>
                            </div>
                            <div className='stat-item'>
                                <strong>45k</strong>
                                <span>Lượt bán</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='shop-main-content'>
                {/* Phần Voucher */}
                <div className='shop-voucher'>
                    <h3>Voucher của Shop</h3>
                    <div className='voucher-list'>
                        {vouchers.map((v) => (
                            <div key={v.id} className={`voucher-card ${v.status === 'Hết' ? 'disabled' : ''}`}>
                                <div className='voucher-left'>
                                    <div className='voucher-content'>
                                        <p className='v-discount'>Giảm {v.discount}</p>
                                        <p className='v-target'><span>{v.target}</span></p>
                                        <p className='v-expiry'>HSD: {v.expiry}</p>
                                    </div>
                                    <div className='sawtooth'></div>
                                </div>
                                <div className='voucher-right'>
                                    <button className={`btn-save ${savedVouchers.includes(v.id) ? 'saved' : ''}`} onClick={() => handleSaveVoucher(v.id)}>
                                        {savedVouchers.includes(v.id) ? 'Dùng ngay' : 'Lưu'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phần Sản phẩm */}
                <div className='shop-products'>
                    <h3>Sản phẩm đang bán</h3>
                    <div className='shop-item'>
                        {products.map((item) => (
                            <div className='each-product' key={item.productID}>
                                <img src={productImg} alt={item.productName} className="shop-product-img" />
                                <div className="shop-product-name">{item.productName}</div>
                                <div className="shop-product-rating">
                                    {renderStars(5)} 
                                    <span className="product_sold">Đã bán 1.2k</span>
                                </div>
                                <div className="shop-product-bottom">
                                    <span className="shop-product-price">
                                        {item.price?.toLocaleString('vi-VN') || "120.000"}đ
                                    </span>
                                    <button 
                                        className="shop-product-btn" 
                                        onClick={() => handleAddToCart(item.productID)} // <--- Gắn sự kiện click vào đây
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}