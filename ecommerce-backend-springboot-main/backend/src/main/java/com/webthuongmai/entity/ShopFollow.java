package com.webthuongmai.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Shop_Follows")
@Data
public class ShopFollow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "userid")
    private User user;

    @ManyToOne
    @JoinColumn(name = "shopid")
    private Shop shop;
}