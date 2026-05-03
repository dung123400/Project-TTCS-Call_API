package com.webthuongmai.service;
import com.webthuongmai.dto.ReviewRequestDTO;
import com.webthuongmai.entity.Product;
import com.webthuongmai.entity.OrderItem;
import com.webthuongmai.entity.Review;
import com.webthuongmai.entity.User;
import com.webthuongmai.repository.ProductRepository;
import com.webthuongmai.repository.OrderItemRepository;
import com.webthuongmai.repository.ReviewRepository;
import com.webthuongmai.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public String createReview(ReviewRequestDTO request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Sản phẩm"));

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin đơn hàng"));

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setOrderItem(orderItem);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDateTime.now());
        review.setIsFake(false);

        reviewRepository.save(review);

        return "Gửi đánh giá thành công!";
    }
}