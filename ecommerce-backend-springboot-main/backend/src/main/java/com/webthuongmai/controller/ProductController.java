package com.webthuongmai.controller;
import com.webthuongmai.entity.Product;
import com.webthuongmai.repository.ProductRepository;
import com.webthuongmai.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductRepository productRepository;
    
    @Autowired
    private ProductService productService;

    ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Long categoryId
    ) {
        if (keyword != null && categoryId != null) {
            return ResponseEntity.ok(productRepository.findByProductNameContainingIgnoreCaseAndCategory_CategoryID(keyword, categoryId));
        } else if (keyword != null) {
            return ResponseEntity.ok(productRepository.findByProductNameContainingIgnoreCase(keyword));
        } else if (categoryId != null) {
            return ResponseEntity.ok(productRepository.findByCategory_CategoryID(categoryId));
        }
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<List<Product>> getSimilarProducts(
        @PathVariable Long id, 
        @RequestParam Long categoryId) {
    return ResponseEntity.ok(productRepository.findByCategory_CategoryIDAndProductIDNot(categoryId, id));
    }

    // Thêm vào trong class ProductController
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/shop/{shopId}")
    public List<Product> getProductsByShop(@PathVariable Long shopId) {
        return productRepository.findByShop_ShopID(shopId);
    }
}