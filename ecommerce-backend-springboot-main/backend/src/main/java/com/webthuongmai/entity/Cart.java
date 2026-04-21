package com.webthuongmai.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Cart")
@Data
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartID;

    @OneToOne
    @JoinColumn(name = "UserID")
    private User user;
    // THÊM ĐOẠN NÀY VÀO TRONG FILE Cart.java
    // Lệnh này ép Spring Boot: Khi lấy Cart, PHẢI lấy luôn toàn bộ CartItem (EAGER)
    @OneToMany(mappedBy = "cart", fetch = FetchType.EAGER)
    private java.util.List<CartItem> cartItems;
}