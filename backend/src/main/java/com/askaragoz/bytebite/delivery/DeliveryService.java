package com.askaragoz.bytebite.delivery;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;

    public DeliveryService(DeliveryRepository deliveryRepository){
        this.deliveryRepository = deliveryRepository;
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
        return deliveryRepository.save(delivery);
    }
}
