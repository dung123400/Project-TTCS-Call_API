package com.webthuongmai.controller;
import com.webthuongmai.entity.ProductImage;
import com.webthuongmai.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/product-images")
@CrossOrigin("*")
public class ProductImageController {
    @Autowired
    private ProductImageService productImageService;

    @GetMapping
    public List<ProductImage> getAll() {
        return productImageService.getAllProductImages();
    }

    @PostMapping
    public ProductImage create(@RequestBody ProductImage productImage) {
        return productImageService.createProductImage(productImage);
    }
}