# Tài liệu API - Dự án Thương mại điện tử

Danh sách các endpoint dùng để kết nối Frontend và Backend.

---

# API Documentation

## 1. Đăng ký tài khoản
- **Method:** POST  
- **URL:** `/api/auth/register`

### Body (JSON)
```json
{
  "fullName": "Nguyễn Văn Test",
  "email": "test@gmail.com",
  "phone": "0987654321",
  "password": "123",
  "confirmPassword": "123",
  "birthday": "2005-01-01",
  "gender": "Nam"
}
```

---

## 2. Đăng nhập
- **Method:** POST  
- **URL:** `/api/auth/login`

### Body (JSON)
```json
{
  "emailOrPhone": "test@gmail.com",
  "password": "123"
}
```

---

## 3. Thêm mới danh mục
- **Method:** POST  
- **URL:** `/api/categories`

### Body (JSON)
```json
{
  "categoryName": "Điện thoại"
}
```

---

## 4. Thêm mới đơn vị vận chuyển
- **Method:** POST  
- **URL:** `/api/shipping-units`

### Body (JSON)
```json
{
  "name": "Giao Hàng Nhanh",
  "price": 30000
}
```

---

## 5. Thêm mới Role (Quyền)
- **Method:** POST  
- **URL:** `/api/roles`

### Body (JSON)
```json
{
  "roleName": "ADMIN"
}
```

---

## 6. Thêm mới Người dùng
- **Method:** POST  
- **URL:** `/api/users`

### Body (JSON)
```json
{
  "fullName": "Nguyen Van A",
  "email": "test_thanh_cong_123@gmail.com",
  "password": "123",
  "role": {
    "roleID": 1
  }
}
```

---

## 7. Thêm mới cửa hàng
- **Method:** POST  
- **URL:** `/api/shops`

### Body (JSON)
```json
{
  "shopName": "Cửa hàng Công nghệ",
  "user": {
    "userID": 1
  }
}
```

---

## 8. Thêm mới sản phẩm
- **Method:** POST  
- **URL:** `/api/products`

### Body (JSON)
```json
{
  "productName": "Laptop Gaming Pro 2026",
  "price": 25000000,
  "description": "Cấu hình mạnh mẽ cho lập trình viên",
  "category": {
    "categoryID": 1
  },
  "shop": {
    "shopID": 1
  }
}
```

---

## 9. Lấy danh sách tất cả sản phẩm
- **Method:** GET  
- **URL:** `/api/products`

---

## 10. Thêm sản phẩm vào giỏ
- **Method:** POST  
- **URL:** `/api/carts/add?userId=1&variantId=1`

---

## 11. Lấy danh sách & Tìm kiếm sản phẩm
- **Method:** GET  
- **URL:** `/api/products/search`

---

## 12. Lấy sản phẩm tương tự
- **Method:** GET  
- **URL:** `/api/products/5/similar?categoryId=1`