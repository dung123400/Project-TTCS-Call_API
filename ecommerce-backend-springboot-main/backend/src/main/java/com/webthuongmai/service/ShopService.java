package com.webthuongmai.service;
import com.webthuongmai.entity.Shop;
import com.webthuongmai.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.webthuongmai.entity.User;

@Service
public class ShopService {
    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private com.webthuongmai.repository.ShopFollowRepository shopFollowRepository;

    @Autowired
    private com.webthuongmai.repository.UserRepository userRepository;

    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    public Shop createShop(Shop shop) {
        return shopRepository.save(shop);
    }

    // 2. Viết lại hàm này
    public Shop updateFollowerCount(Long shopId, Long userId, boolean isFollowing) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Shop"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        int currentCount = shop.getFollowerCount() != null ? shop.getFollowerCount() : 0;

        if (isFollowing) {
            // NẾU BẤM THEO DÕI: Ghi vào sổ và cộng 1
            if (!shopFollowRepository.existsByUser_UserIDAndShop_ShopID(userId, shopId)) {
                com.webthuongmai.entity.ShopFollow follow = new com.webthuongmai.entity.ShopFollow();
                follow.setUser(user);
                follow.setShop(shop);
                shopFollowRepository.save(follow); // <-- Lưu vào Database
                shop.setFollowerCount(currentCount + 1);
            }
        } else {
            // NẾU HỦY THEO DÕI: Xóa khỏi sổ và trừ 1
            com.webthuongmai.entity.ShopFollow follow = shopFollowRepository.findByUser_UserIDAndShop_ShopID(userId, shopId);
            if (follow != null) {
                shopFollowRepository.delete(follow); // <-- Xóa khỏi Database
                shop.setFollowerCount(Math.max(0, currentCount - 1));
            }
        }

        return shopRepository.save(shop);
    }


}