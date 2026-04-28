package com.askaragoz.bytebite.order;

import com.askaragoz.bytebite.notification.NotificationProducer;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;
    private final NotificationProducer notificationProducer;

    public OrderService(OrderRepository orderRepository,
                        OrderEventProducer orderEventProducer,
                        NotificationProducer notificationProducer){
        this.orderRepository = orderRepository;
        this.orderEventProducer = orderEventProducer;
        this.notificationProducer = notificationProducer;
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
        orderRepository.save(order);
        notificationProducer.sendNotification("Order status changed to: " + status);
        return order;
    }
}
