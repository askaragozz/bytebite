package com.askaragoz.bytebite.order;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderEventConsumer {
    @KafkaListener(topics = "order-placed", groupId="bytebite-group")
    public void handleOrderPlaced(String message){
        System.out.println("Recieved:" + message);
    }
}
