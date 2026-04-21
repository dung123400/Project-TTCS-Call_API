package com.webthuongmai.service;
import com.webthuongmai.entity.ProductImage;
import com.webthuongmai.repository.ProductImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductImageService {
    @Autowired
    private ProductImageRepository productImageRepository;

    public List<ProductImage> getAllProductImages() {
        return productImageRepository.findAll();
    }

    public ProductImage createProductImage(ProductImage productImage) {
        return productImageRepository.save(productImage);
    }
}