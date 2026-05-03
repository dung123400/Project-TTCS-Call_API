package com.webthuongmai.dto;

import java.util.List;
import lombok.Data;

@Data
public class OrderRequestDTO {
    private Long userId;
    private Long addressId;
    private Long shopId;
    private List<Long> cartItemIds;
    private String paymentMethod;
}