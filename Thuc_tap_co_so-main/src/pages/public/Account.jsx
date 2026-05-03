import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/public/Account.css"
import avt from './assets/avt-shop.jpg';

export default function Account() {
    const { active_tab } = useParams();
    const navigate = useNavigate(); 
    const activeTab = active_tab || "profile";

    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [reviewTarget, setReviewTarget] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [isEditing, setIsEditing] = useState(false);

    // 1. STATE DỮ LIỆU USER (Trống mặc định)
    const [userData, setUserData] = useState({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        address: "Chưa cập nhật",
        password: "",
        birthday: "", 
        gender: "Nữ",
        avatar: avt
    });

    // 2. TỰ ĐỘNG LOAD DATA TỪ LOCALSTORAGE KHI MỞ TRANG
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserData({
                username: storedUser.email ? storedUser.email.split('@')[0] : "user",
                fullName: storedUser.fullName || "",
                email: storedUser.email || "",
                phone: storedUser.phone || "",
                address: "Chưa cập nhật", 
                password: "", 
                birthday: storedUser.birthday ? storedUser.birthday.split('T')[0] : "", 
                gender: storedUser.gender || "Nữ",
                avatar: avt
            });
        } else {
            alert("Vui lòng đăng nhập để xem thông tin!");
            navigate('/login');
        }
    }, [navigate]);

    // Dữ liệu lịch sử cứng (Sẽ nối API ở bước sau)
    // 1. Khởi tạo mảng rỗng, không dùng dữ liệu ảo nữa
    const [orderedHistory, setOrderedHistory] = useState([]);

    // 2. Tự động gọi API kéo danh sách đơn hàng khi chuyển sang tab "Lịch sử"
    useEffect(() => {
        const fetchOrderHistory = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) return;
            const userId = storedUser.userID || storedUser.userid || storedUser.id;

            try {
                const response = await fetch(`http://localhost:8081/api/orders/user/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    
                    const formattedHistory = data.map(order => ({
                        key: order.orderID || order.orderid,
                        status: order.shippingStatus === "Pending" ? "Đang giao" : 
                               (order.shippingStatus === "Confirmed" || order.shippingStatus === "Completed" ? "Đã giao" : order.shippingStatus),
                        
                        // Lấy tên sản phẩm thật từ orderItems, nếu không có thì hiện tên Shop
                        name: order.orderItems && order.orderItems.length > 0 
                            ? order.orderItems.map(item => item.productVariant?.product?.productName).filter(Boolean).join(", ")
                            : `Đơn hàng từ ${order.shop?.shopName || 'Cửa hàng'}`, 
                            
                        quantity: order.orderItems ? order.orderItems.length : 1, 
                        price: order.paymentMethod === "COD" ? "Thanh toán khi nhận" : "Đã thanh toán", 
                        date: order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : "Chưa cập nhật",
                        review: "", 
                        rating: 0, 
                        reviewDate: ""
                    }));
                    
                    setOrderedHistory(formattedHistory);
                }
            } catch (error) {
                console.error("Lỗi khi tải lịch sử mua hàng:", error);
            }
        };

        if (activeTab === "history") {
            fetchOrderHistory();
        }
    }, [activeTab]);

    const handleTabChange = (tabName) => {
        navigate(`/account/${tabName}`); 
        setIsEditing(false);
    };

    // 3. HÀM LƯU THAY ĐỔI XUỐNG BACKEND
    const handleProfileButtonClick = async () => {
        if (!isEditing) {
            setIsEditing(true);
        } else {
            const requiredFields = ["email", "phone", "fullName"];
            const isAnyFieldEmpty = requiredFields.some(field => !userData[field] || userData[field].trim() === "");

            if (isAnyFieldEmpty) {
                alert("Vui lòng điền đầy đủ Tên, Email và Số điện thoại!");
                return; 
            }

            const confirmChange = window.confirm("Bạn có chắc chắn muốn lưu thông tin này?");
            if (confirmChange) {
                try {
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    const userId = storedUser.userID || storedUser.userid || storedUser.id;

                    const response = await fetch(`http://localhost:8081/api/users/${userId}/profile`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            fullName: userData.fullName,
                            email: userData.email,
                            phone: userData.phone,
                            birthday: userData.birthday || null,
                            gender: userData.gender,
                            password: userData.password 
                        })
                    });

                    if (response.ok) {
                        alert("Cập nhật thông tin thành công!");
                        setIsEditing(false);
                        
                        const updatedUser = { ...storedUser, ...userData };
                        delete updatedUser.password; 
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    } else {
                        alert("Lỗi: Không thể cập nhật. Email hoặc SĐT có thể đã bị trùng!");
                    }
                } catch (error) {
                    console.error("Lỗi:", error);
                    alert("Không thể kết nối đến Server!");
                }
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleConfirmReceived = async (e, key) => {
        e.stopPropagation(); 
        
        // Gọi API cập nhật trạng thái đơn hàng sang "Confirmed" ở cổng 8081
        try {
            const response = await fetch(`http://localhost:8081/api/orders/${key}/receive`, {
                method: "PUT"
            });
            
            if (response.ok) {
                // Nếu Backend báo OK, ta mới cho UI đổi màu xanh "Đã giao"
                const updatedHistory = orderedHistory.map(item => {
                    if (item.key === key) {
                        return { ...item, status: "Đã giao" };
                    }
                    return item;
                });
                setOrderedHistory(updatedHistory);
                alert("Đã xác nhận nhận hàng thành công!");
            } else {
                alert("Có lỗi xảy ra khi cập nhật trạng thái!");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Không thể kết nối với Server Spring Boot!");
        }
    };

    const showDetail = (item) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    const openReviewModal = (e, item) => {
        e.stopPropagation(); 
        setReviewTarget(item);
        setIsReviewModalVisible(true);
    };

    const submitReview = () => {
        if (!reviewForm.comment.trim()) {
            alert("Vui lòng nhập lời nhận xét!");
            return;
        }

        const today = new Date().toLocaleDateString("vi-VN");
        
        const updatedHistory = orderedHistory.map(item => {
            if (item.key === reviewTarget.key && item.name === reviewTarget.name) {
                return { 
                    ...item, 
                    review: reviewForm.comment, 
                    rating: reviewForm.rating, 
                    reviewDate: today 
                };
            }
            return item;
        });

        setOrderedHistory(updatedHistory);
        alert("Đánh giá thành công!");
        setIsReviewModalVisible(false);
        setReviewForm({ rating: 5, comment: "" });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Đã giao":
                return { dot: "#218838", text: "#218838" }; 
            case "Đang giao":
                return { dot: "#f1c40f", text: "#b8860b" }; 
            default:
                return { dot: "#aaa", text: "#333" };
        }
    };

    return (
        <>
        <div className="account-container">
            <div className="account-sidebar">
                <div className="user-profile-brief">
                    <img src={avt} alt="Avatar" />
                    <p>{userData.username}</p>
                </div>

                <button 
                    className={`nav-item ${activeTab === "profile" ? "active" : ""}`} 
                    onClick={() => handleTabChange("profile")}
                >
                    <i className="bx bx-user"></i>
                    <p>Thông tin cá nhân</p>
                </button>

                <button 
                    className={`nav-item ${activeTab === "history" ? "active" : ""}`} 
                    onClick={() => handleTabChange("history")}
                >
                    <i className="bx bx-history"></i>
                    <p>Lịch sử đặt hàng</p>
                </button>
            </div>

            <div className="account-main-content">
                <div className="tab-content-wrapper">
                    {/* PROFILE SECTION */}
                    <div className="profile-details" style={{ display: activeTab === "profile" ? "flex" : "none" }}>
                        <div className="info-row">
                            <p className="info-label">Tên đăng nhập</p>
                            <p className="info-value">{userData.username}</p>
                        </div>
                        <div className="info-row">
                            <p className="info-label">Họ và tên</p>
                            <input 
                                name="fullName"
                                className={`info-value ${!isEditing ? "readonly-input" : "editing-input"}`}
                                value={userData.fullName}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="info-row">
                            <p className="info-label">Email</p>
                            <input 
                                name="email"
                                className={`info-value ${!isEditing ? "readonly-input" : "editing-input"}`}
                                value={userData.email}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="info-row">
                            <p className="info-label">Số điện thoại</p>
                            <input 
                                name="phone"
                                className={`info-value ${!isEditing ? "readonly-input" : "editing-input"}`}
                                value={userData.phone}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="info-row">
                            <p className="info-label">Địa chỉ hiện tại</p>
                            <input 
                                name="address"
                                className={`info-value ${!isEditing ? "readonly-input" : "editing-input"}`}
                                value={userData.address}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        {/* Biến Ngày sinh thành Input cho dễ sửa */}
                        <div className="info-row">
                            <p className="info-label">Ngày sinh</p>
                            {isEditing ? (
                                <input 
                                    type="date"
                                    name="birthday"
                                    className="info-value editing-input"
                                    value={userData.birthday}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p className="info-value">{userData.birthday || "Chưa cập nhật"}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <p className="info-label">Giới tính</p>
                            <div className="info-value">
                                <label style={{ marginRight: "50px" }}>
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="Nam"
                                        checked={userData.gender === "Nam" || userData.gender === "Male"}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    /> Nam
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="Nữ"
                                        checked={userData.gender === "Nữ" || userData.gender === "Female"}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    /> Nữ
                                </label>
                            </div>
                        </div>
                        <div className="info-row">
                            <p className="info-label">Mật khẩu mới</p>
                            <input 
                                name="password"
                                placeholder="Bỏ trống nếu không muốn đổi..."
                                className={`info-value ${!isEditing ? "readonly-input" : "editing-input"}`}
                                type={isEditing ? "text" : "password"}
                                value={userData.password}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button className="changeProfile" onClick={handleProfileButtonClick}>
                            {isEditing ? "Lưu thay đổi" : "Thay đổi"}
                        </button>
                    </div>

                    {/* HISTORY SECTION */}
                    <div className="history-list" style={{ display: activeTab === "history" ? "flex" : "none" }}>
                        {orderedHistory.map((item) => {
                            const styles = getStatusStyles(item.status);
                            return (
                                <div className="history-card" key={item.key} onClick={() => showDetail(item)}>
                                    <div className="item-ordered-info">
                                        <img className="item-ordered-img" src={avt} alt="item" />
                                        <div className="text-details">
                                            <h4>{item.name}</h4>
                                            <p>SL x {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="status-info">
                                        <p className="item-price">{item.price}</p>
                                        <div className="badge">
                                            <span className="badge-text" style={{ color: styles.text }}>{item.status}</span>
                                        </div>
                                        {item.status === "Đang giao" ? (
                                            <button 
                                                className="confirm-btn" 
                                                onClick={(e) => handleConfirmReceived(e, item.key)}
                                            >
                                                Đã nhận hàng
                                            </button>
                                        ) : (
                                            item.status === "Đã giao" && !item.review && (
                                                <button 
                                                    className="review-btn" 
                                                    onClick={(e) => openReviewModal(e, item)}
                                                >
                                                    Đánh giá
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>  

        {/* MODAL CHI TIẾT */}
        <div 
            className="modal-overlay" 
            style={{ display: isModalVisible ? "flex" : "none" }}
            onClick={(e) => e.target.className === 'modal-overlay' && closeModal()}
        >
            <div className="modal-box">
                <span className="modal-close-btn" onClick={closeModal}>&times;</span>
                <h2 className="modal-title">Chi tiết đơn hàng</h2>
                {selectedItem && (
                    <div className="modal-grid">
                        <div className="modal-col">
                            <div className="data-field field-centered">
                                <img className="item-ordered-img" src={selectedItem.image || avt} alt="item" />
                                <p>Tên sản phẩm: <strong>{selectedItem.name}</strong></p>
                            </div>
                            <div className="data-field">Số lượng: {selectedItem.quantity}</div>
                            <div className="data-field">Ngày đặt: {selectedItem.date}</div>
                        </div>
                        <div className="modal-col">
                            <div className="data-field">Trạng thái: <strong>{selectedItem.status}</strong></div>
                            <div className="data-field">Giá tiền: {selectedItem.price}</div>
                            <div className="data-field review-field">
                                Đánh giá: {selectedItem.review || "Chưa có"} 
                                {selectedItem.rating > 0 && ` (${selectedItem.rating} ★)`}
                            </div>
                            {selectedItem.reviewDate && <div className="data-field">Ngày đánh giá: {selectedItem.reviewDate}</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* MODAL VIẾT ĐÁNH GIÁ */}
        {isReviewModalVisible && (
            <div className="modal-overlay">
                <div className="modal-box review-modal">
                    <h2 className="modal-title">Viết đánh giá ngay</h2>
                    <div className="rating-input">
                        <p>Chọn mức độ hài lòng:</p>
                        <select 
                            value={reviewForm.rating} 
                            onChange={(e) => setReviewForm({...reviewForm, rating: e.target.value})}
                        >
                            <option value="5">5 ★ - Rất tốt</option>
                            <option value="4">4 ★ - Tốt</option>
                            <option value="3">3 ★ - Bình thường</option>
                            <option value="2">2 ★ - Tệ</option>
                            <option value="1">1 ★ - Rất tệ</option>
                        </select>
                    </div>
                    <textarea 
                        className="review-textarea"
                        placeholder="Nhập lời nhận xét của bạn về sản phẩm..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    ></textarea>
                    <div className="modal-actions">
                        <button className="cancel-btn" onClick={() => setIsReviewModalVisible(false)}>Hủy</button>
                        <button className="submit-btn" onClick={submitReview}>Gửi đánh giá</button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}