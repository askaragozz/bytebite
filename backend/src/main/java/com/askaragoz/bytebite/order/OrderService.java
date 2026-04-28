package com.askaragoz.bytebite.order;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;

    public OrderService(OrderRepository orderRepository, OrderEventProducer orderEventProducer){
        this.orderRepository = orderRepository;
        this.orderEventProducer = orderEventProducer;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order createOrder(Order order){
        orderRepository.save(order);
        orderEventProducer.publishOrderPlaced(order.getId());
        return order;
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
