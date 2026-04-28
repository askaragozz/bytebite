package com.askaragoz.bytebite.order;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderEventProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OrderEventProducer(KafkaTemplate<String, String> kafkaTemplate){
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishOrderPlaced(Long orderId){
        kafkaTemplate.send("order-placed", ("order-placed" + orderId) );
    }
}
