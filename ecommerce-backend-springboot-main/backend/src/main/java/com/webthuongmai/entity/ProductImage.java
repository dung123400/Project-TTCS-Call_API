package com.webthuongmai.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Table(name = "Product_image")
@Data
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageID;

    @ManyToOne
    @JoinColumn(name = "ProductID")
    private Product product;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String imageURL;

    private Boolean isMain = false;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime deletedAt;
}