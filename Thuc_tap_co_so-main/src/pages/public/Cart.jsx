import React, { useState, useEffect, useMemo } from "react";
import '../../styles/public/Cart.css';
import qc1 from './assets/cart-qc-1.png';
import qc2 from './assets/cart-qc-2.png';
import trash from './assets/trash.png';
import bia from './assets/muado.jpg';
import Order from './Order';

export default function Cart() {
    const [shops, setShops] = useState([]);
    const [isOrderOpen, setIsOrderOpen] = useState(false);

    // Lấy ID người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.userID || user?.userid || user?.id;

    // 1. Hàm lấy dữ liệu giỏ hàng từ Backend (Bản phòng thủ lỗi Array(0))
    const fetchCartData = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`http://localhost:8081/api/carts`);
            if (response.ok) {
                const allCarts = await response.json();
                
                // Tìm đúng giỏ hàng của User hiện tại
                const userCart = allCarts.find(c => 
                    c.user?.userID == userId || c.user?.userid == userId || c.user?.id == userId
                );

                // Kiểm tra mọi biến thể tên mảng sản phẩm mà Spring Boot có thể trả về
                const cartItemsArray = userCart?.items || userCart?.cartItems || userCart?.cartitems || [];

                if (cartItemsArray.length > 0) {
                    const grouped = {};
                    cartItemsArray.forEach(item => {
                        const pVariant = item.productVariant || item.productvariant || item.variant;
                        const product = pVariant?.product;
                        const shopName = product?.shop?.shopName || product?.shop?.shopname || "Cửa hàng ShopZone";
                        
                        if (!grouped[shopName]) {
                            grouped[shopName] = { shopName, items: [] };
                        }
                        grouped[shopName].items.push({
                            cartItemId: item.cartItemID || item.cartitemid || item.id, 
                            id: pVariant?.variantID || pVariant?.variantid,
                            title: product?.productName || product?.productname,
                            price: pVariant?.price || 0,
                            quantity: item.quantity,
                            selected: false,
                            image: bia // Có thể thay bằng ảnh thật product.imageUrl nếu có
                        });
                    });
                    setShops(Object.values(grouped));
                } else {
                    setShops([]);
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải giỏ hàng:", error);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, [userId]);

    // 2. Cập nhật số lượng (Dùng POST để lách lỗi CORS) - Đã fix lỗi mất dấu tick
    const handleUpdateQuantity = async (shopIndex, cartItemId, newQty) => {
        if (newQty < 1) return;
        try {
            const response = await fetch(`http://localhost:8081/api/cart-items/update/${cartItemId}?quantity=${newQty}`, {
                method: "POST"
            });
            
            if (response.ok) {
                // KHÔNG gọi fetchCartData() nữa để tránh reset trạng thái selected
                // Chỉ cập nhật đúng số lượng của món hàng đó trong state hiện tại
                setShops(prevShops => prevShops.map((shop, index) => {
                    if (index === shopIndex) {
                        return {
                            ...shop,
                            items: shop.items.map(item => 
                                item.cartItemId === cartItemId 
                                    ? { ...item, quantity: newQty } 
                                    : item
                            )
                        };
                    }
                    return shop;
                }));
            }
        } catch (error) {
            alert("Không thể cập nhật số lượng!");
        }
    };

    // 3. Xóa sản phẩm (Dùng POST để lách lỗi CORS)
    const handleDelete = async (shopIndex, cartItemId) => {
        if (!window.confirm("Xóa sản phẩm này khỏi giỏ hàng?")) return;
        try {
            const response = await fetch(`http://localhost:8081/api/cart-items/delete/${cartItemId}`, {
                method: "POST"
            });
            if (response.ok) {
                fetchCartData();
            }
        } catch (error) {
            alert("Lỗi khi xóa sản phẩm!");
        }
    };

    // --- Các hàm bổ trợ logic giao diện ---
    const formatCurrency = (value) => value.toLocaleString('en-US');
    const truncateTitle = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

    const handleToggleShop = (shopIndex, checked) => {
        setShops(prev => prev.map((shop, index) => 
            index === shopIndex ? { ...shop, items: shop.items.map(item => ({ ...item, selected: checked })) } : shop
        ));
    };

    const handleToggleItem = (shopIndex, cartItemId) => {
        setShops(prev => prev.map((shop, index) => 
            index === shopIndex ? { ...shop, items: shop.items.map(item => item.cartItemId === cartItemId ? { ...item, selected: !item.selected } : item) } : shop
        ));
    };

    const allSelected = useMemo(() => shops.length > 0 && shops.every(shop => shop.items.every(item => item.selected)), [shops]);
    
    const handleSelectAll = (checked) => {
        setShops(prev => prev.map(shop => ({ ...shop, items: shop.items.map(item => ({ ...item, selected: checked })) })));
    };

    const selectedItems = useMemo(() => {
        const items = [];
        shops.forEach(shop => shop.items.forEach(item => { if (item.selected) items.push({ ...item, shop: shop.shopName }); }));
        return items;
    }, [shops]);

    const subtotal = useMemo(() => shops.reduce((acc, shop) => acc + shop.items.filter(item => item.selected).reduce((sum, item) => sum + (item.price * item.quantity), 0), 0), [shops]);
    const shippingFee = subtotal > 0 ? 15000 : 0;
    const totalAmount = subtotal + shippingFee;

    return (
        <div className='cart'>
            <aside><img className='cart_img' src={qc1} alt=""/></aside>
            <section className="cart-content">
                <div className="cart-header">
                    <input type="checkbox" className="checkbox" checked={allSelected} onChange={(e) => handleSelectAll(e.target.checked)} />
                    <label>Chọn tất cả</label>
                </div>

                <div className="cart-items">
                    {shops.length === 0 ? <p style={{textAlign: 'center', padding: '20px'}}>Giỏ hàng trống trơn...</p> : 
                    shops.map((shop, shopIndex) => (
                        <div className="shop-group" key={shopIndex} >
                            <div className="shopName" >
                                <input type="checkbox" className="checkbox" checked={shop.items.every(i => i.selected)} onChange={(e) => handleToggleShop(shopIndex, e.target.checked)} />
                                <h4>{shop.shopName}</h4>
                            </div>
                            {shop.items.map((item) => (
                                <div className="shopItems" key={item.cartItemId} >
                                    <div className="shop-items-left">
                                        <input className="checkbox" type="checkbox" checked={item.selected} onChange={() => handleToggleItem(shopIndex, item.cartItemId)} />
                                        <img className="shop-items-img" src={item.image} alt="product"/>
                                        <div className="items-details">
                                            <h4 className="item-name">{truncateTitle(item.title, 40)}</h4>
                                            <div className="quantity-selector">
                                                <button className="sub" onClick={() => handleUpdateQuantity(shopIndex, item.cartItemId, item.quantity - 1)}>-</button>
                                                <input className="value-quantity" type="text" value={item.quantity} readOnly />
                                                <button className="add" onClick={() => handleUpdateQuantity(shopIndex, item.cartItemId, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shop-items-right">
                                        <p className="price">{formatCurrency(item.price)}đ</p>
                                        <img className="trash" src={trash} alt="delete" onClick={() => handleDelete(shopIndex, item.cartItemId)}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="cart-footer">
                    <div className="shipping">Phí vận chuyển: {formatCurrency(shippingFee)}đ</div>
                    <div className="total"><span>Tổng thanh toán: {formatCurrency(totalAmount)}đ</span></div>
                    <button className="order-btn" onClick={() => selectedItems.length > 0 ? setIsOrderOpen(true) : alert("Chọn sản phẩm đã!")}>Đặt hàng</button>
                </div>
            </section>
            <aside><img className='cart_img' src={qc2} alt=""/></aside>
            {isOrderOpen && <Order selectedItems={selectedItems} subtotal={subtotal} shippingFee={shippingFee} onClose={() => setIsOrderOpen(false)} />}
        </div>
    );
}