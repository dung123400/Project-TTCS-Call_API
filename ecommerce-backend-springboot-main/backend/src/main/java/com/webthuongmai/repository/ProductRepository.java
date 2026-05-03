package com.webthuongmai.repository;
import com.webthuongmai.dto.ProductDTO;
import com.webthuongmai.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByProductNameContainingIgnoreCase(String name);

    List<Product> findByCategory_CategoryID(Long categoryId);

    List<Product> findByProductNameContainingIgnoreCaseAndCategory_CategoryID(String name, Long categoryId);

    List<Product> findByCategory_CategoryIDAndProductIDNot(Long categoryId, Long productId);

    // Query lấy sản phẩm Trending dựa trên số lượt tương tác trong bảng user_activities
    // Lưu ý: Các tên trường (productid, productName...) phải khớp chính xác với file Product Entity của bạn
    @Query("SELECT p FROM Product p JOIN UserActivity ua ON p.productID = ua.product.productID " +
            "GROUP BY p " +
            "ORDER BY COUNT(ua) DESC")
    List<Product> findTrendingProducts(Pageable pageable);

    List<Product> findByShop_ShopIDAndProductIDNot(Long shopId, Long productId);

    @Query(value = "SELECT p.productid AS productID, " +
            "p.product_name AS productName, " +
            "(SELECT TOP 1 image_url FROM product_image WHERE productid = p.productid ORDER BY is_main DESC) AS imageURL, " +
            "(SELECT MIN(price) FROM product_variant WHERE productid = p.productid) AS price, " +
            "(SELECT TOP 1 variantid FROM product_variant WHERE productid = p.productid ORDER BY price ASC) AS variantID, " + // THÊM DÒNG NÀY
            "ISNULL((SELECT SUM(oi.quantity) FROM order_items oi JOIN product_variant pv ON oi.variantid = pv.variantid WHERE pv.productid = p.productid), 0) AS soldCount, " +
            "ISNULL(s.rating, 5.0) AS shopRating " +
            "FROM product p " +
            "LEFT JOIN shop s ON p.shopid = s.shopid", nativeQuery = true)
    List<ProductDTO> findAllProductsWithDetails();

    // Lấy danh sách Biến thể (Size, Color, Giá, Mã)
    @Query(value = "SELECT variantid AS variantID, size AS sizeName, color AS colorName, price FROM product_variant WHERE productid = :productId", nativeQuery = true)
    List<Map<String, Object>> getVariantsByProductId(@Param("productId") Long productId);

    // Lấy danh sách Ảnh phụ
    @Query(value = "SELECT image_url AS imageURL FROM product_image WHERE productid = :productId", nativeQuery = true)
    List<Map<String, Object>> getImagesByProductId(@Param("productId") Long productId);

    // Tính tổng số lượng đã bán
    @Query(value = "SELECT ISNULL(SUM(oi.quantity), 0) FROM order_items oi JOIN product_variant pv ON oi.variantid = pv.variantid WHERE pv.productid = :productId", nativeQuery = true)
    Integer getSoldCountByProductId(@Param("productId") Long productId);

}