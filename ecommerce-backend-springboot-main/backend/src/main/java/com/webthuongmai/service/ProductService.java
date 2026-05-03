package com.webthuongmai.service;
import com.webthuongmai.entity.Product;
import com.webthuongmai.dto.ProductDTO;
import com.webthuongmai.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAllProductsWithDetails();
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Hàm lấy sản phẩm theo danh mục
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategory_CategoryID(categoryId);
    }

    // Hàm lấy sản phẩm cho trang chủ (Trending)
    public List<Product> getTrendingProducts(int limit) {
        return productRepository.findTrendingProducts(PageRequest.of(0, limit));
    }

    public List<Product> getRecommendedProducts(Long userId) {
        // Giả sử bạn có SearchHistoryRepository để lấy từ khóa mới nhất
        // Ở đây mình làm demo logic đơn giản:
        // Nếu có userId, tìm sản phẩm theo tên khớp với từ khóa tìm kiếm gần nhất.
        // Nếu không có lịch sử hoặc userId null, trả về danh sách Trending.

        // return productRepository.findByProductNameContainingIgnoreCase(lastKeyword);
        // Hiện tại hãy mặc định trả về Trending cho dễ test
        return getTrendingProducts(10);
    }

    public List<Product> getOtherProductsByShop(Long shopId, Long productId) {
        return productRepository.findByShop_ShopIDAndProductIDNot(shopId, productId);
    }

    public List<Product> getSimilarProducts(Long categoryId, Long productId) {
        return productRepository.findByCategory_CategoryIDAndProductIDNot(categoryId, productId);
    }
}