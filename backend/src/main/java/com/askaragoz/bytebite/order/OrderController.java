package com.askaragoz.bytebite.order;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService){
        this.orderService = orderService;
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId){
        return orderService.getOrdersByUser(userId);
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PostMapping
    public Order createOrder(@RequestBody Order order){
        return orderService.createOrder(order);
    }

    @PreAuthorize("hasAuthority('RESTAURANT_OWNER') or hasAuthority('DRIVER')")
    @PutMapping("/{orderId}/status")
    public Order updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status){
        return orderService.updateOrderStatus(orderId, status);
    }
}
