package com.webthuongmai.dto;

public interface ProductDTO {
    Long getProductID();
    Long getVariantID();
    String getProductName();
    String getImageURL();
    Double getPrice();
    Integer getSoldCount();
    Double getShopRating();
}