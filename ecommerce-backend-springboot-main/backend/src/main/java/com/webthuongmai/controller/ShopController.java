package com.webthuongmai.controller;
import com.webthuongmai.entity.Shop;
import com.webthuongmai.repository.ShopRepository;
import com.webthuongmai.repository.ShopFollowRepository;
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

    // Sửa lại API này
    @PostMapping("/{id}/follow")
    public ResponseEntity<Shop> followShop(
            @PathVariable Long id,
            @RequestParam Long userId, // <--- THÊM DÒNG NÀY
            @RequestParam boolean isFollowing) {

        // Truyền thêm userId vào hàm service
        return ResponseEntity.ok(shopService.updateFollowerCount(id, userId, isFollowing));
    }

    // Nhớ khai báo thêm cái này ở đầu Class
    @Autowired
    private com.webthuongmai.repository.ShopFollowRepository shopFollowRepository;

    // THÊM API NÀY XUỐNG CUỐI FILE
    @GetMapping("/{id}/check-follow")
    public ResponseEntity<Boolean> checkFollowStatus(@PathVariable Long id, @RequestParam Long userId) {
        boolean isFollowed = shopFollowRepository.existsByUser_UserIDAndShop_ShopID(userId, id);
        return ResponseEntity.ok(isFollowed);
    }
}