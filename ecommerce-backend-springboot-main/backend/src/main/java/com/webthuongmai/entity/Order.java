package com.webthuongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderid") // Khớp hoàn toàn với lowercase trong ảnh DB
    private Long orderID;

    @ManyToOne
    @JoinColumn(name = "buyerid") // Đổi BuyerID -> buyerid
    @JsonIgnoreProperties({"orders", "password", "role", "addresses"}) // Tránh vòng lặp JSON
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "shopid") // Đổi ShopID -> shopid
    @JsonIgnoreProperties({"user", "products", "vouchers"}) // Tránh vòng lặp JSON[cite: 5]
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "addressid") // Đổi AddressID -> addressid[cite: 5]
    @JsonIgnoreProperties("user")
    private Address address;

    @Column(name = "order_date", updatable = false) // Map chính xác order_date[cite: 5]
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "payment_status") // Map chính xác payment_status[cite: 5]
    private String paymentStatus = "Unpaid";

    @Column(name = "shipping_status") // Map chính xác shipping_status[cite: 5]
    private String shippingStatus = "Pending";

    @Column(name = "payment_method") // Nhớ chạy lệnh SQL ALTER TABLE đã nhắc để thêm cột này[cite: 5]
    private String paymentMethod;

    @Column(name = "expected_delivery_date") // Map chính xác expected_delivery_date[cite: 5]
    private LocalDateTime expectedDeliveryDate;

    @Column(name = "created_at", updatable = false) // Map chính xác created_at[cite: 5]
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at") // Map chính xác updated_at[cite: 5]
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", fetch = FetchType.EAGER) // Lấy luôn danh sách món hàng khi lấy đơn hàng
    @JsonIgnoreProperties("order") // Quan trọng: Ngắt vòng lặp từ Item quay lại Order
    private java.util.List<OrderItem> orderItems;
}