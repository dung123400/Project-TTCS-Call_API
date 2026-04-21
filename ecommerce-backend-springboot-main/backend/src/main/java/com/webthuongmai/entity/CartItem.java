package com.webthuongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore; // Đã thêm dấu chấm phẩy

@Entity
@Table(name = "Cart_Items")
@Data
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemID;

    @ManyToOne
    @JoinColumn(name = "CartID")
    @JsonIgnore // Đặt ĐÚNG CHỖ: Chỉ giấu biến cart này để cắt đứt vòng lặp vô tận
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "VariantID")
    private ProductVariant productVariant;

    private Integer quantity = 1;
}