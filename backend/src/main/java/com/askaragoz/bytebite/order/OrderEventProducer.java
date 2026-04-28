package com.askaragoz.bytebite.order;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class OrderEventProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OrderEventProducer(KafkaTemplate<String, String> kafkaTemplate){
        this.kafkaTemplate = kafkaTemplate;
    }

    @Async
    public void publishOrderPlaced(Long orderId){
        kafkaTemplate.send("order-placed", ("order-placed" + orderId) );
    }
}
