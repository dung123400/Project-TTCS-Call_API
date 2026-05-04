package com.webthuongmai.repository;

import com.webthuongmai.entity.ShopFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopFollowRepository extends JpaRepository<ShopFollow, Long> {
    // Kiểm tra xem User này đã follow Shop này chưa
    boolean existsByUser_UserIDAndShop_ShopID(Long userId, Long shopId);

    // Tìm bản ghi follow để xóa (khi unfollow)
    ShopFollow findByUser_UserIDAndShop_ShopID(Long userId, Long shopId);
}