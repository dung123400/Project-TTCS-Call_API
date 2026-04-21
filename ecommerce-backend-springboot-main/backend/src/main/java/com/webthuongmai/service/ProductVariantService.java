package com.webthuongmai.service;
import com.webthuongmai.entity.ProductVariant;
import com.webthuongmai.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductVariantService {
    @Autowired
    private ProductVariantRepository productVariantRepository;

    public List<ProductVariant> getAllProductVariants() {
        return productVariantRepository.findAll();
    }

    public ProductVariant createProductVariant(ProductVariant productVariant) {
        return productVariantRepository.save(productVariant);
    }
}