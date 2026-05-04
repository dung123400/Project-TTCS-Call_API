import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../styles/public/Product.css';

// Import ảnh mặc định phòng trường hợp API chưa có ảnh
import defaultImg from './assets/muado.jpg';
import avt from './assets/avt-shop.jpg';

export default function Product() {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- CÁC STATE LƯU DỮ LIỆU ---
    const [product, setProduct] = useState(null);
    const [shop, setShop] = useState(null);
    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);
    
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    
    const [currentImage, setCurrentImage] = useState(defaultImg);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    
    // Thêm State quản lý Số lượng mua
    const [quantity, setQuantity] = useState(1);
    
    // Thêm State quản lý Đánh giá sản phẩm
    const [reviews, setReviews] = useState([]);

    // 1. GỌI API LẤY CHI TIẾT SẢN PHẨM VÀ ĐÁNH GIÁ
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                // Kéo thông tin chi tiết sản phẩm
                const response = await fetch(`http://localhost:8081/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    setShop(data.shop || null);

                    const productImages = data.images || data.productImages || [];
                    if (productImages.length > 0) {
                        const imgUrls = productImages.map(img => img.imageURL || img.imageUrl);
                        setImages(imgUrls);
                        setCurrentImage(imgUrls[0]);
                    } else {
                        setImages([defaultImg]);
                        setCurrentImage(defaultImg);
                    }

                    const productVariants = data.variants || data.productVariants || [];
                    setVariants(productVariants);

                    if (productVariants.length > 0) {
                        const sizes = [...new Set(productVariants.map(v => v.size || v.sizeName).filter(Boolean))];
                        const colors = [...new Set(productVariants.map(v => v.color || v.colorName).filter(Boolean))];
                        
                        setAvailableSizes(sizes);
                        setAvailableColors(colors);

                        if (sizes.length > 0) setSelectedSize(sizes[0]);
                        if (colors.length > 0) setSelectedColor(colors[0]);

                        setCurrentPrice(productVariants[0].price || productVariants[0].productPrice || 0);
                        setSelectedVariantId(productVariants[0].variantID || productVariants[0].variantid || productVariants[0].id);
                    }
                }

                // Kéo danh sách đánh giá của sản phẩm
                const reviewRes = await fetch(`http://localhost:8081/api/reviews/product/${id}`);
                if (reviewRes.ok) {
                    const reviewData = await reviewRes.json();
                    setReviews(reviewData);
                }

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchProductDetail();
    }, [id]);

    // 2. TỰ ĐỘNG ĐỔI GIÁ VÀ VARIANT_ID KHI CHỌN SIZE/COLOR
    useEffect(() => {
        if (variants.length > 0) {
            const matchedVariant = variants.find(v => 
                (v.size || v.sizeName) === selectedSize && 
                (v.color || v.colorName) === selectedColor
            );

            if (matchedVariant) {
                setCurrentPrice(matchedVariant.price || matchedVariant.productPrice || 0);
                setSelectedVariantId(matchedVariant.variantID || matchedVariant.variantid || matchedVariant.id);
            } else if (variants.length > 0) {
                setCurrentPrice(variants[0].price || variants[0].productPrice || 0);
                setSelectedVariantId(variants[0].variantID || variants[0].variantid || variants[0].id);
            }
        }
    }, [selectedSize, selectedColor, variants]);

    // Hàm xử lý tăng giảm số lượng
    const handleDecrease = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    // 3. HÀM THÊM VÀO GIỎ HÀNG
    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Vui lòng đăng nhập để thêm đồ vào giỏ nhé!");
            navigate('/login');
            return;
        }

        if (!selectedVariantId) {
            alert("Vui lòng chọn Kích thước và Màu sắc hợp lệ!");
            return;
        }

        const userId = user.userID || user.userid || user.id;

        try {
            const response = await fetch(`http://localhost:8081/api/carts/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    variantId: selectedVariantId,
                    quantity: quantity
                })
            });

            if (response.ok) {
                alert(`🛒 Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
            } else {
                alert("Lỗi: Không thể thêm vào giỏ.");
            }
        } catch (error) {
            alert("Không thể kết nối đến server!");
        }
    };

    const renderStars = (score) => {
        const positiveStars = Math.floor(score || 5); 
        return "⭐".repeat(positiveStars);
    };

    if (!product) return <div style={{marginTop: '120px', textAlign: 'center'}}>Đang tải dữ liệu sản phẩm...</div>;

    return (
        <div className='product-container'>
            {/* Chi tiết Sản phẩm */}
            <div className='item-details'>
                <div className='item-img-group'>
                    <img className='item-main-img' src={currentImage} alt={product.productName} />
                    <div className='item-sub-images'>
                        {images.map((img, index) => (
                            <img 
                                key={index} 
                                src={img} 
                                alt={`sub-${index}`} 
                                className={`sub-img ${currentImage === img ? 'active-thumb' : ''}`}
                                onClick={() => setCurrentImage(img)} 
                            />
                        ))}
                    </div>
                </div>
                <div className='item-details-group'>
                    <h1 className='product-name'>{product.productName || product.productname}</h1>
                    
                    <div className='product-meta'>
                        {renderStars(shop?.rating || 5)}
                        <span className='sales'> | Đã bán {product.soldCount || "0"}</span>
                    </div>

                    <div className='product-price'>{Number(currentPrice).toLocaleString('vi-VN')} ₫</div>

                    <div className='product-description'>
                        <p>{product.description || "Đang cập nhật mô tả sản phẩm..."}</p>
                    </div>
                    <br />

                    <div className='selection-group'>
                        <p>Vận chuyển:</p>
                        <p className='shipping-date-text'>* Đảm bảo nhận hàng vào ngày 5/5 - 14/5</p>
                    </div>
                    <br />

                    {/* Kích thước */}
                    {availableSizes.length > 0 && (
                        <div className='selection-group'>
                            <p>Kích thước:</p>
                            <div className='options'>
                                {availableSizes.map(size => (
                                    <button 
                                        key={size}
                                        className={`opt-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <br />

                    {/* Màu sắc */}
                    {availableColors.length > 0 && (
                        <div className='selection-group'>
                            <p>Màu sắc: <strong>{selectedColor}</strong></p>
                            <div className='options'>
                                {availableColors.map(color => (
                                    <button 
                                        key={color}
                                        className={`opt-btn ${selectedColor === color ? 'active' : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <br />

                    {/* Khối chọn Số lượng */}
                    <div className='selection-group'>
                        <p>Số lượng:</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                            <button 
                                onClick={handleDecrease}
                                style={{ padding: '8px 15px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', borderRadius: '4px'}}
                            >
                                -
                            </button>
                            <span style={{ fontSize: '16px', fontWeight: '500', width: '30px', textAlign: 'center' }}>
                                {quantity}
                            </span>
                            <button 
                                onClick={handleIncrease}
                                style={{ padding: '8px 15px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', borderRadius: '4px'}}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className='add-to-cart'>
                        <button className='add-to-cart-btn' onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                        <button className='buy-now'>Mua ngay</button>
                    </div>
                </div>
            </div>

            {/* Đánh giá */}
            <div className='review-section'>
                <div className='review-header'>
                    <h3>Đánh giá ({shop?.rating || 5}⭐)</h3>
                    {reviews.length > 0 && <span className='show-more-text'>Hiển thị thêm</span>}
                </div>
                
                {reviews.length === 0 ? (
                    <p style={{padding: '10px 20px', color: '#666', fontStyle: 'italic'}}>
                        Sản phẩm này chưa có đánh giá nào.
                    </p>
                ) : (
                    reviews.map((rev) => {
                        const revId = rev.reviewID || rev.reviewid || rev.id;
                        return (
                            <div className='review-content' key={revId}>
                                <div className='review-user'>
                                    <strong>{rev.user?.fullName || "Khách hàng"}</strong>
                                    <span className='review-stars'>{rev.rating}⭐</span>
                                    <span className='review-date'>
                                        {rev.reviewDate ? new Date(rev.reviewDate).toLocaleDateString('vi-VN') : "Gần đây"}
                                    </span>
                                </div>
                                <p className='review-text'>{rev.comment}</p>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Shop Card */}        
            <div className='shop-card'>
                <div className='shop-info-left'>
                    <Link to={`/shop/${shop?.shopID || 1}`} style={{ textDecoration: 'none' }}>
                        <img src={avt} alt="shop-avatar" className='shop-avatar' />
                    </Link>
                    <div className='shop-details'>
                        <Link to={`/shop/${shop?.shopID || 1}`} style={{ textDecoration: 'none' }}>
                            <h3 className='shop-name'>{shop?.shopName || 'The Artisan Collective'}</h3>
                        </Link>
                        <p className='shop-rating'>
                            <span className='stars'>⭐⭐⭐⭐</span>⭐ {shop?.rating || 4.2} ({shop?.reviews || '1.2k'} Đánh giá)
                        </p>
                        <p className='shop-desc'>
                            {shop?.description || 'Unique, ethically sourced handmade goods from global artisans. Since 2018.'}
                        </p>
                    </div>
                </div>

                <div className='shop-metrics'>
                    <div className='metric'>
                        <strong>{product?.shopProductCount || 0}</strong>
                        <span>Sản phẩm</span>
                    </div>
                    <div className='metric'>
                        <strong>
                            {shop?.followerCount >= 1000 
                                ? (shop.followerCount / 1000).toFixed(1) + 'k' 
                                : (shop?.followerCount || 0)}
                        </strong>
                        <span>Theo dõi</span>
                    </div>
                    <div className='metric'>
                        <strong>
                            {product?.shopTotalSales >= 1000 
                                ? (product.shopTotalSales / 1000).toFixed(1) + 'k' 
                                : (product?.shopTotalSales || 0)}
                        </strong>
                        <span>Lượt bán</span>
                    </div>
                </div>
            </div>

            {/* Sản phẩm tương tự */}
            <div className='item-similar'>
                <h3 style={{fontSize: '20px', color: '#333'}}>Sản phẩm tương tự</h3>
            </div>
        </div>
    );
}