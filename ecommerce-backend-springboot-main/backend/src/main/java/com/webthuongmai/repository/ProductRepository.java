package com.webthuongmai.repository;
import com.webthuongmai.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByProductNameContainingIgnoreCase(String name);

    List<Product> findByCategory_CategoryID(Long categoryId);

    List<Product> findByProductNameContainingIgnoreCaseAndCategory_CategoryID(String name, Long categoryId);

    List<Product> findByCategory_CategoryIDAndProductIDNot(Long categoryId, Long productId);

    List<Product> findByShop_ShopID(Long shopId);
}