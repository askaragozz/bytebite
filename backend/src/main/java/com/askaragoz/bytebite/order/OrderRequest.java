package com.askaragoz.bytebite.order;

import java.util.List;

public record OrderRequest(Long userId, Long restaurantId, List<OrderItemRequest> items) {
    public record OrderItemRequest(Long menuItemId, Integer quantity) {}
}
