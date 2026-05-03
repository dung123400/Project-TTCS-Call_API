package com.webthuongmai.controller;
import com.webthuongmai.dto.ReviewRequestDTO;
import com.webthuongmai.entity.Review;
import com.webthuongmai.repository.ReviewRepository;
import com.webthuongmai.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public List<Review> getAll() {
        return reviewService.getAllReviews();
    }

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProduct_ProductID(productId));
    }

    @PostMapping("/create")
    public ResponseEntity<String> createReview(@RequestBody ReviewRequestDTO request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    @PostMapping
    public Review create(@RequestBody Review review) {
        return reviewService.createReview(review);
    }
}