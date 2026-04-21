package com.webthuongmai.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Table(name = "Product")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productID;

    @Column(nullable = false)
    private String productName;

    @ManyToOne
    @JoinColumn(name = "CategoryID")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "ShopID")
    private Shop shop;

    private String description;
    private String brand;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private LocalDateTime deletedAt;
}