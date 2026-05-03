package com.webthuongmai.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
@Entity
@Table(name = "Order_Items")
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemID;

    // Tìm đến biến order trong OrderItem.java
    @ManyToOne
    @JoinColumn(name = "OrderID")
    @com.fasterxml.jackson.annotation.JsonIgnore // THÊM DÒNG NÀY
    private Order order;

    @ManyToOne
    @JoinColumn(name = "VariantID")
    private ProductVariant productVariant;


    private Integer quantity;
    private BigDecimal price;
}