package com.webthuongmai.service;
import com.webthuongmai.entity.Shop;
import com.webthuongmai.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ShopService {
    @Autowired
    private ShopRepository shopRepository;

    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    public Shop createShop(Shop shop) {
        return shopRepository.save(shop);
    }

    public Shop updateFollowerCount(Long shopId, boolean isFollowing) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Shop"));

        int currentCount = shop.getFollowerCount() != null ? shop.getFollowerCount() : 0;

        if (isFollowing) {
            shop.setFollowerCount(currentCount + 1); // Tăng 1 nếu bấm theo dõi
        } else {
            shop.setFollowerCount(Math.max(0, currentCount - 1)); // Giảm 1 nếu bỏ theo dõi (không cho âm)
        }
        return shopRepository.save(shop);
    }
}