package com.webthuongmai.repository;
import com.webthuongmai.entity.OrderItem;
import com.webthuongmai.entity.Review;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_ProductID(Long productId);
    Optional<Review> findByOrderItem(OrderItem orderItem);
}