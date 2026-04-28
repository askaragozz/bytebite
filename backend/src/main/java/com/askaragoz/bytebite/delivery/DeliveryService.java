package com.askaragoz.bytebite.delivery;

import com.askaragoz.bytebite.order.Order;
import com.askaragoz.bytebite.order.OrderRepository;
import com.askaragoz.bytebite.user.User;
import com.askaragoz.bytebite.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DeliveryEventProducer deliveryEventProducer;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           DeliveryEventProducer deliveryEventProducer,
                           OrderRepository orderRepository,
                           UserRepository userRepository){
        this.deliveryRepository = deliveryRepository;
        this.deliveryEventProducer = deliveryEventProducer;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public Delivery createDelivery(DeliveryRequest req) {
        Order order = orderRepository.findById(req.orderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        User driver = userRepository.findById(req.driverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setDriver(driver);
        delivery.setDeliveryAddress(req.deliveryAddress());
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setCreatedAt(LocalDateTime.now());
        return deliveryRepository.save(delivery);
    }

    public Optional<Delivery> getAllDeliveryByOrder(Long orderId){
        return deliveryRepository.findByOrderId(orderId);
    }

    public List<Delivery> getAllDeliveryByDriver(Long driverId){
        return deliveryRepository.findByDriverId(driverId);
    }

    public Delivery updateDeliveryStatus(Long deliveryId, DeliveryStatus status){
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        delivery.setStatus(status);
        deliveryRepository.save(delivery);
        deliveryEventProducer.publishDeliveryAssigned(deliveryId, status);
        return delivery;
    }
}
