package com.askaragoz.bytebite.delivery;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DeliveryEventConsumer {
    @KafkaListener(topics = "delivery-assigned", groupId = "bytebite-group")
    public void handleDeliveryAssigned(String message){
        log.info("Delivery Assigned: {}", message);
    }
}
