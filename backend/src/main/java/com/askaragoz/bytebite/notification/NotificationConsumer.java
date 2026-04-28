package com.askaragoz.bytebite.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationConsumer {
    @RabbitListener(queues = "${rabbitmq.queue}")
    public void handleNotification(String message){
        log.info("Notification: {}", message);
    }
}
