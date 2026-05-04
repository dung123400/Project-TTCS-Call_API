package com.webthuongmai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.webthuongmai.dto.ProductDTO;
import com.webthuongmai.entity.Product;
import com.webthuongmai.repository.ProductRepository;
import com.webthuongmai.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;


    // Lấy tất cả sản phẩm
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Hiển thị sản phẩm Trending (Cho "Sản phẩm bán chạy" hoặc Acc mới)
    @GetMapping("/trending")
    public ResponseEntity<List<Product>> getTrending() {
        return ResponseEntity.ok(productService.getTrendingProducts(10));
    }

    // Hiển thị theo lịch sử tìm kiếm (Gợi ý cho User)
    @GetMapping("/recommendations")
    public ResponseEntity<List<Product>> getRecommendations(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(productService.getRecommendedProducts(userId));
    }

    // Tìm kiếm và Lọc theo danh mục (Bên trái menu)
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

    // Lấy sản phẩm tương tự
    @GetMapping("/{id}/similar")
    public ResponseEntity<List<Product>> getSimilarProducts(
            @PathVariable Long id,
            @RequestParam Long categoryId) {
        return ResponseEntity.ok(productRepository.findByCategory_CategoryIDAndProductIDNot(categoryId, id));
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Product>> getOtherFromShop(
            @PathVariable Long shopId,
            @RequestParam Long excludeId) {
        return ResponseEntity.ok(productService.getOtherProductsByShop(shopId, excludeId));
    }

    @GetMapping("/{id}/related-by-category")
    public ResponseEntity<List<Product>> getRelatedProductsForDetail(
            @PathVariable Long id,
            @RequestParam Long categoryId) {
        return ResponseEntity.ok(productService.getSimilarProducts(categoryId, id));
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    // Lấy chi tiết 1 sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        // Tự tạo ObjectMapper và "dạy" nó cách đọc ngày tháng Java 8
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule()); // <-- DÒNG MA THUẬT NẰM Ở ĐÂY

        // Chuyển đối tượng Product thành Map
        Map<String, Object> response = mapper.convertValue(product, new TypeReference<Map<String, Object>>() {});

        // Gắn thêm Biến thể, Ảnh và Số lượng bán
        response.put("variants", productRepository.getVariantsByProductId(id));
        response.put("images", productRepository.getImagesByProductId(id));
        response.put("soldCount", productRepository.getSoldCountByProductId(id));

        // THÊM 2 DÒNG NÀY ĐỂ TRẢ VỀ SỐ LIỆU THẬT CỦA SHOP
        if (product.getShop() != null) {
            Long shopId = product.getShop().getShopID();
            response.put("shopProductCount", productRepository.countByShop_ShopID(shopId));
            response.put("shopTotalSales", productRepository.getTotalSalesByShopId(shopId));
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/shop/{shopId}/all")
    public ResponseEntity<List<ProductDTO>> getAllProductsByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(productRepository.findAllProductsWithDetailsByShop(shopId));
    }
}