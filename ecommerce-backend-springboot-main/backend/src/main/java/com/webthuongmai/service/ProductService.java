package com.webthuongmai.service;
import com.webthuongmai.entity.Product;
import com.webthuongmai.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Thêm vào trong class ProductService
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
}