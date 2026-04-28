package com.askaragoz.bytebite.notification;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumer {
    @RabbitListener(queues = "${rabbitmq.queue}")
    public void handleNotification(String message){
        System.out.println("Notification: " + message);
    }
}
