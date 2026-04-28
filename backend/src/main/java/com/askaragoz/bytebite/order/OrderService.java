package com.askaragoz.bytebite.order;

import com.askaragoz.bytebite.menuitem.MenuItem;
import com.askaragoz.bytebite.menuitem.MenuItemRepository;
import com.askaragoz.bytebite.notification.NotificationProducer;
import com.askaragoz.bytebite.restaurant.Restaurant;
import com.askaragoz.bytebite.restaurant.RestaurantRepository;
import com.askaragoz.bytebite.user.User;
import com.askaragoz.bytebite.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderEventProducer orderEventProducer;
    private final NotificationProducer notificationProducer;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        UserRepository userRepository,
                        RestaurantRepository restaurantRepository,
                        MenuItemRepository menuItemRepository,
                        OrderEventProducer orderEventProducer,
                        NotificationProducer notificationProducer){
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderEventProducer = orderEventProducer;
        this.notificationProducer = notificationProducer;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByRestaurant(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public Order createOrder(OrderRequest req){
        User user = userRepository.findById(req.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Restaurant restaurant = restaurantRepository.findById(req.restaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        double total = 0;
        for (OrderRequest.OrderItemRequest itemReq : req.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.menuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));
            total += menuItem.getPrice() * itemReq.quantity();
        }
        order.setTotalPrice(total);
        orderRepository.save(order);

        for (OrderRequest.OrderItemRequest itemReq : req.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.menuItemId()).get();
            orderItemRepository.save(new OrderItem(null, itemReq.quantity(), order, menuItem));
        }

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
