package com.askaragoz.bytebite.delivery;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/deliveries")
public class DeliveryController {
    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService){
        this.deliveryService = deliveryService;
    }

    @PostMapping
    public Delivery createDelivery(@RequestBody DeliveryRequest request) {
        return deliveryService.createDelivery(request);
    }

    @GetMapping("/order/{orderId}")
    public Optional<Delivery> getAllDeliveryByOrder(@PathVariable Long orderId){
        return deliveryService.getAllDeliveryByOrder(orderId);
    }

    @GetMapping("/driver/{driverId}")
    public List<Delivery> getAllDeliveryByDriver(@PathVariable Long driverId){
        return deliveryService.getAllDeliveryByDriver(driverId);
    }

    @PutMapping("/{deliveryId}/status")
    public Delivery updateDeliveryStatus(@PathVariable Long deliveryId,
                                         @RequestParam DeliveryStatus status){
        return deliveryService.updateDeliveryStatus(deliveryId, status);
    }
}
