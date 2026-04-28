package com.askaragoz.bytebite.delivery;

public record DeliveryRequest(Long orderId, Long driverId, String deliveryAddress) {}
