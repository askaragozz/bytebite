package com.askaragoz.bytebite.delivery;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class DeliveryEventProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public DeliveryEventProducer(KafkaTemplate<String, String> kafkaTemplate){
        this.kafkaTemplate = kafkaTemplate;
    }

    @Async
    public void publishDeliveryAssigned(Long deliveryId, DeliveryStatus status){
        kafkaTemplate.send("delivery-assigned",
                ("Delivery " + deliveryId + " status: " + status)
        );
    }

}
