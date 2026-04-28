package com.askaragoz.bytebite.notification;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationProducer {
    @Value("${rabbitmq.exchange}")
    private String exchangeName;
    @Value("${rabbitmq.routing-key}")
    private String routingKey;

    private final RabbitTemplate rabbitTemplate;

    public NotificationProducer(RabbitTemplate rabbitTemplate){
        this.rabbitTemplate = rabbitTemplate;
    }

    @Async
    public void sendNotification(String message){
        rabbitTemplate.convertAndSend(exchangeName, routingKey, message);
    }

}
