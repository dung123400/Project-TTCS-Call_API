package com.webthuongmai.repository;
import com.webthuongmai.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCart_CartIDAndProductVariant_VariantID(Long cartId, Long variantId);
}