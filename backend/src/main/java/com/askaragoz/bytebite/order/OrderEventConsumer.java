package com.askaragoz.bytebite.order;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class OrderEventConsumer {

    @KafkaListener(topics = "order-placed", groupId="bytebite-group")
    public void handleOrderPlaced(String message){
        log.info("Received: {}", message);
    }
}
