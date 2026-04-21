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

    public Shop getShopById(Long id) {
        return shopRepository.findById(id).orElse(null);
    }
}