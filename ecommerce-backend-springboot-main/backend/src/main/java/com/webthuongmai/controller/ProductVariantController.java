package com.webthuongmai.controller;
import com.webthuongmai.entity.ProductVariant;
import com.webthuongmai.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/product-variants")
@CrossOrigin("*")
public class ProductVariantController {
    @Autowired
    private ProductVariantService productVariantService;

    @GetMapping
    public List<ProductVariant> getAll() {
        return productVariantService.getAllProductVariants();
    }

    @PostMapping
    public ProductVariant create(@RequestBody ProductVariant productVariant) {
        return productVariantService.createProductVariant(productVariant);
    }
}