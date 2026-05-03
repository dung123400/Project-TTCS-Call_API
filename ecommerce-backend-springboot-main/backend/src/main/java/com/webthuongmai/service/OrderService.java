package com.webthuongmai.service;

import com.webthuongmai.dto.OrderDetailModalDTO;
import com.webthuongmai.dto.OrderRequestDTO;
import com.webthuongmai.entity.CartItem;
import com.webthuongmai.entity.Order;
import com.webthuongmai.entity.OrderItem;
import com.webthuongmai.entity.Review;
import com.webthuongmai.entity.User;
import com.webthuongmai.entity.Address;
import com.webthuongmai.entity.Shop;
import com.webthuongmai.repository.CartItemRepository;
import com.webthuongmai.repository.OrderItemRepository;
import com.webthuongmai.repository.OrderRepository;
import com.webthuongmai.repository.ReviewRepository;
import com.webthuongmai.repository.UserRepository;
import com.webthuongmai.repository.AddressRepository;
import com.webthuongmai.repository.ShopRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AddressRepository addressRepository;
    @Autowired private ShopRepository shopRepository;
    @Autowired private ReviewRepository reviewRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Transactional
    public String placeOrder(OrderRequestDTO request) {

        User buyer = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Address"));

        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Shop"));

        Order newOrder = new Order();
        newOrder.setBuyer(buyer);
        newOrder.setAddress(address);
        newOrder.setShop(shop);
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setPaymentStatus("Unpaid");
        newOrder.setShippingStatus("Pending");

        newOrder.setPaymentMethod(request.getPaymentMethod());
        newOrder.setExpectedDeliveryDate(LocalDateTime.now().plusDays(3));

        Order savedOrder = orderRepository.save(newOrder);

        List<CartItem> cartItems = cartItemRepository.findAllById(request.getCartItemIds());
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem item : cartItems) {
            OrderItem detail = new OrderItem();
            detail.setOrder(savedOrder);
            detail.setProductVariant(item.getProductVariant());
            detail.setQuantity(item.getQuantity());
            detail.setPrice(item.getProductVariant().getPrice());

            orderItems.add(detail);
        }

        orderItemRepository.saveAll(orderItems);

        cartItemRepository.deleteAllById(request.getCartItemIds());

        return "Đặt hàng thành công!";
    }

    public List<Order> getOrderHistory(Long userId) {
        return orderRepository.findByBuyer_UserIDOrderByOrderDateDesc(userId);
    }

    public String markOrderAsReceived(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        order.setShippingStatus("Confirmed");

        orderRepository.save(order);
        return "Xác nhận nhận hàng thành công!";
    }

    public OrderDetailModalDTO getOrderItemDetails(Long orderItemId) {

        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết đơn hàng"));

        Order order = orderItem.getOrder();

        OrderDetailModalDTO dto = new OrderDetailModalDTO();
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setStatus(order.getShippingStatus());
        dto.setOrderDate(order.getOrderDate());

        Optional<Review> reviewOpt = reviewRepository.findByOrderItem(orderItem);
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            dto.setReviewComment(review.getComment());
            dto.setReviewDate(review.getReviewDate());
            dto.setReviewRating(review.getRating());
        }
        return dto;
    }
}