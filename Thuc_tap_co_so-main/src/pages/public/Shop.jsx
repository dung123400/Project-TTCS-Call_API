import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/public/Shop.css';
import avt from './assets/avt-shop.jpg';
import productImg from './assets/muado.jpg';

export default function Shop() {
    const navigate = useNavigate();
    const { name } = useParams();

    const decodedName = name ? decodeURIComponent(name) : "";

    const shopData = {
        name: decodedName,
        avatar: avt,
        rating: 4.2,
        reviews: "1.2k",
        description: "Unique, ethically sourced handmade goods from global artisans. Since 2018.",
        products: 158,
        followers: 8200,
        sales: "45k"
    };

    const vouchers = [
        { id: 1, discount: "100k", target: "Sản phẩm nhất định", expiry: "30.04.2026", status: "Còn" },
        { id: 2, discount: "50k", target: "Tất cả sản phẩm", expiry: "15.05.2026", status: "Còn" },
        { id: 3, discount: "10%", target: "Sản phẩm mới", expiry: "01.06.2026", status: "Hết" },
    ];

    const products = [
        { id: 1, name: "The Java Handbook siêu dài abc xyz 1", price: 29.99, rating: 4, sold: "1.2k", image: productImg },
        { id: 2, name: "Clean Code: A Handbook of Agile Software Craftsmanship", price: 35.50, rating: 5, sold: "800", image: productImg },
        { id: 3, name: "JavaScript: The Good Parts", price: 25.00, rating: 4, sold: "2.5k", image: productImg },
        { id: 4, name: "Design Patterns: Elements of Reusable Object-Oriented Software", price: 45.99, rating: 5, sold: "500", image: productImg },
        { id: 5, name: "Pragmatic Programmer, The: From Journeyman to Master", price: 39.00, rating: 4, sold: "1.1k", image: productImg },
        { id: 6, name: "Introduction to Algorithms, 3rd Edition", price: 60.00, rating: 5, sold: "300", image: productImg },
        { id: 7, name: "Cracking the Coding Interview", price: 28.50, rating: 4, sold: "4.2k", image: productImg },
        { id: 8, name: "Refactoring: Improving the Design of Existing Code", price: 42.00, rating: 5, sold: "150", image: productImg },
    ];

    // Logic theo dõi
    const [isFollowed, setIsFollowed] = useState(false);
    const [followerCount, setFollowerCount] = useState(shopData.followers);

    const handleFollow = () => {
        if (!isFollowed) {
            setFollowerCount(prev => prev + 1);
        } else {
            setFollowerCount(prev => prev - 1);
        }
        setIsFollowed(!isFollowed);
    };

    // Format số 
    const formatNumber = (num) => {
        return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
    };

    // Rating 
    const renderStars = (score) => {
        const positiveStars = Math.round(score); 
        return "⭐".repeat(positiveStars) + "☆".repeat(5 - positiveStars);
    };

    // Lưu voucher
    const [savedVouchers, setSavedVouchers] = useState([]);
    const handleSaveVoucher = (id) => {
        if (!savedVouchers.includes(id)) {
            setSavedVouchers([...savedVouchers, id]);
        }
    };

    const handleProductClick = (id) => {
        navigate(`/product/${id}`); 
    };

    return (
        <div className='shop-container'>
            <div className='shop-header'>
                <div className='shop-info'>
                    <div className='info-left'>
                        <img src={shopData.avatar} alt="avatar" className='shop-avatar' />
                        <div className='shop-details'>
                            <h1>{shopData.name}</h1>
                            <div className='rating'>
                                {renderStars(shopData.rating)}
                                <span className='rating-score'>{shopData.rating} ({shopData.reviews} Đánh giá)</span>
                            </div>
                            <p className='description'>{shopData.description}</p>
                        </div>
                    </div>

                    <div className='info-right'>
                        <div className='action-buttons'>
                            <button 
                                className={`btn-follow ${isFollowed ? 'followed' : ''}`} 
                                onClick={handleFollow}
                            >
                                {isFollowed ? 'Đang theo dõi' : 'Theo dõi'}
                            </button>
                        </div>
                        <div className='stats'>
                            <div className='stat-item'>
                                <strong>{shopData.products}</strong>
                                <span>Sản phẩm</span>
                            </div>
                            <div className='stat-item'>
                                <strong>{formatNumber(followerCount)}</strong>
                                <span>Theo dõi</span>
                            </div>
                            <div className='stat-item'>
                                <strong>{shopData.sales}</strong>
                                <span>Lượt bán</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='shop-main-content'>
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
                                    <button 
                                        className={`btn-save ${savedVouchers.includes(v.id) ? 'saved' : ''}`}
                                        onClick={() => handleSaveVoucher(v.id)}
                                        disabled={v.status === 'Hết'}
                                    >
                                        {v.status === 'Hết' ? 'Hết' : (savedVouchers.includes(v.id) ? 'Dùng ngay' : 'Lưu')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='shop-products'>
                    <h3>Sản phẩm</h3>
                    <div className='shop-item'>
                        {products.map((item) => (
                            <div 
                                className='each-product' 
                                key={item.id}
                                onClick={() => handleProductClick(item.id)}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="shop-product-img"
                                />

                                <div className="shop-product-name">
                                    {item.name}
                                </div>

                                <div className="rating">
                                    {renderStars(item.rating)} 
                                    <span className="product_sold">Đã bán {item.sold}</span>
                                </div>

                                <div className="shop-product-bottom">
                                    <span className="shop-product-price">${item.price}</span>
                                    <button className="shop-product-btn">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className='product-footer'>Không còn sản phẩm nào!</p>
                </div>
            </div>
        </div>
    )
}