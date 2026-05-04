import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/public/Shop.css';
import avt from './assets/avt-shop.jpg';
import defaultProductImg from './assets/muado.jpg';

export default function Shop() {
    const navigate = useNavigate();
    const { id } = useParams(); 

    const [shopData, setShopData] = useState(null);
    const [products, setProducts] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [savedVouchers, setSavedVouchers] = useState([]);

    useEffect(() => {
        const fetchShopData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.userID || user?.userid || user?.id;

            try {
                // 1. Lấy thông tin Shop
                const shopRes = await fetch(`http://localhost:8081/api/shops/${id}`);
                if (shopRes.ok) {
                    const data = await shopRes.json();
                    setShopData(data);
                    setFollowerCount(data.followerCount || 0);
                }

                // 2. Kiểm tra trạng thái follow từ Database
                if (userId) {
                    const followRes = await fetch(`http://localhost:8081/api/shops/${id}/check-follow?userId=${userId}`);
                    if (followRes.ok) {
                        setIsFollowed(await followRes.json());
                    }
                }

                // 3. Lấy Voucher của Shop
                const voucherRes = await fetch(`http://localhost:8081/api/vouchers/shop/${id}`);
                if (voucherRes.ok) {
                    setVouchers(await voucherRes.json());
                }

                // 4. Lấy sản phẩm (Bản DTO có giá và lượt bán)
                const productRes = await fetch(`http://localhost:8081/api/products/shop/${id}/all`);
                if (productRes.ok) {
                    setProducts(await productRes.json());
                }
            } catch (error) {
                console.error("Lỗi khi tải trang Shop:", error);
            }
        };
        fetchShopData();
    }, [id]);

    const handleFollow = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) { navigate('/login'); return; }
        const userId = user.userID || user.userid || user.id;
        const newStatus = !isFollowed;

        try {
            const res = await fetch(`http://localhost:8081/api/shops/${id}/follow?userId=${userId}&isFollowing=${newStatus}`, {
                method: "POST"
            });
            if (res.ok) {
                const updatedShop = await res.json();
                setIsFollowed(newStatus);
                setFollowerCount(updatedShop.followerCount);
            }
        } catch (error) { console.error("Lỗi follow:", error); }
    };

    const handleSaveVoucher = async (voucherId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) { navigate('/login'); return; }
        const userId = user.userID || user.userid || user.id;

        try {
            const res = await fetch(`http://localhost:8081/api/vouchers/save?userId=${userId}&voucherId=${voucherId}`, {
                method: "POST"
            });
            if (res.ok) {
                setSavedVouchers([...savedVouchers, voucherId]);
                alert("Lưu mã giảm giá thành công!");
            }
        } catch (error) { alert("Không thể lưu mã!"); }
    };

    const renderStars = (score) => "⭐".repeat(Math.round(score || 5)) + "☆".repeat(5 - Math.round(score || 5));

    if (!shopData) return <div style={{marginTop: '120px', textAlign: 'center'}}>Đang tải dữ liệu cửa hàng...</div>;

    return (
        <div className='shop-container'>
            <div className='shop-header'>
                <div className='shop-info'>
                    <div className='info-left'>
                        <img src={avt} alt="avatar" className='shop-avatar' />
                        <div className='shop-details'>
                            <h1>{shopData.shopName}</h1>
                            <div className='rating'>
                                <span>{renderStars(shopData.rating)} {shopData.rating || 5.0}</span>
                            </div>
                            <p className='description'>{shopData.description || "Cửa hàng uy tín trên ShopZone"}</p>
                        </div>
                    </div>
                    <div className='info-right'>
                        <button className={`btn-follow ${isFollowed ? 'followed' : ''}`} onClick={handleFollow}>
                            {isFollowed ? 'Đang theo dõi' : 'Theo dõi'}
                        </button>
                        <div className='stats'>
                            <div className='stat-item'><strong>{products.length}</strong><span>Sản phẩm</span></div>
                            <div className='stat-item'><strong>{followerCount}</strong><span>Theo dõi</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='shop-main-content'>
                <div className='shop-voucher'>
                    <h3>Voucher của Shop</h3>
                    <div className='voucher-list'>
                        {vouchers.map((v) => (
                            <div key={v.voucherID || v.voucherid} className="voucher-card">
                                <div className='voucher-left'>
                                    <p className='v-discount'>Giảm {v.discountValue}đ</p>
                                    <p className='v-target'>{v.voucherType}</p>
                                </div>
                                <div className='voucher-right'>
                                    <button onClick={() => handleSaveVoucher(v.voucherID || v.voucherid)} disabled={savedVouchers.includes(v.voucherID || v.voucherid)}>
                                        {savedVouchers.includes(v.voucherID || v.voucherid) ? 'Đã lưu' : 'Lưu'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='shop-products'>
                    <h3>Tất cả sản phẩm</h3>
                    <div className='shop-item'>
                        {products.map((item) => (
                            <div className='each-product' key={item.productID || item.productid} onClick={() => navigate(`/product/${item.productID || item.productid}`)}>
                                <img src={item.imageURL || defaultProductImg} className="shop-product-img" />
                                <div className="shop-product-name">{item.productName}</div>
                                <div className="rating">⭐ 5.0 <span>Đã bán {item.soldCount || 0}</span></div>
                                <div className="shop-product-bottom">
                                    <span className="shop-product-price">{item.price ? Number(item.price).toLocaleString('vi-VN') + " ₫" : "Liên hệ"}</span>
                                    <button className="shop-product-btn">Xem ngay</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}