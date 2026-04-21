package com.webthuongmai.controller;

import com.webthuongmai.entity.CartItem;
import com.webthuongmai.service.CartItemService;
import com.webthuongmai.repository.CartItemRepository; // Bổ sung import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Bổ sung import
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
@CrossOrigin("*")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    // --- PHẦN MỚI THÊM 1: Nhúng Repository vào để chọc thẳng xuống Database ---
    @Autowired
    private CartItemRepository cartItemRepository;

    @GetMapping
    public List<CartItem> getAll() {
        return cartItemService.getAllCartItems();
    }

    @PostMapping
    public CartItem create(@RequestBody CartItem cartItem) {
        return cartItemService.createCartItem(cartItem);
    }

    // --- PHẦN MỚI THÊM 2: API Cập nhật số lượng (Lách luật bằng @PostMapping) ---
    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        return cartItemRepository.findById(id).map(item -> {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
            return ResponseEntity.ok("Cập nhật số lượng thành công");
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- PHẦN MỚI THÊM 3: API Xóa sản phẩm khỏi giỏ (Lách luật bằng @PostMapping) ---
    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        if(cartItemRepository.existsById(id)) {
            cartItemRepository.deleteById(id);
            return ResponseEntity.ok("Xóa sản phẩm thành công");
        }
        return ResponseEntity.notFound().build();
    }
}