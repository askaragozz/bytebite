package com.askaragoz.bytebite.restaurant;

import java.util.List;

public interface RestaurantSearchRepository{
    void index(RestaurantDocument document);
    List<RestaurantDocument> search(String query);
}
