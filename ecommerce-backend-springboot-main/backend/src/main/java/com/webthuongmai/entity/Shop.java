package com.webthuongmai.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Table(name = "shop") // MySQL thường phân biệt hoa thường hoặc để chữ thường
@Data
public class Shop {
    @Id
    @Column(name = "ShopID") // Khớp với ảnh DB
    private Long shopID;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ShopID") // ID của sốp cũng là ID của User
    private User user;

    @Column(name = "ShopName", nullable = false) // Khớp PascalCase
    private String shopName;

    @Column(name = "Description")
    private String description;

    @Column(name = "Rating")
    private Double rating = 0.0;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "DeletedAt")
    private LocalDateTime deletedAt;
}