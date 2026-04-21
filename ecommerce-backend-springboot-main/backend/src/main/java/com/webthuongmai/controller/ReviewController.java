package com.webthuongmai.controller;
import com.webthuongmai.entity.Review;
import com.webthuongmai.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping
    public Review create(@RequestBody Review review) {
        return reviewService.createReview(review);
    }
}