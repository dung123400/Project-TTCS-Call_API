package com.webthuongmai.controller;
import com.webthuongmai.entity.Shop;
import com.webthuongmai.repository.ShopRepository;
import com.webthuongmai.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin("*")
public class ShopController {
    @Autowired
    private ShopService shopService;

    @GetMapping
    public List<Shop> getAll() {
        return shopService.getAllShops();
    }

    @Autowired
    private ShopRepository shopRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Shop> getShopInfo(@PathVariable Long id) {
        return shopRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Shop create(@RequestBody Shop shop) {
        return shopService.createShop(shop);
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Shop> followShop(
            @PathVariable Long id,
            @RequestParam boolean isFollowing) {
        return ResponseEntity.ok(shopService.updateFollowerCount(id, isFollowing));
    }
}