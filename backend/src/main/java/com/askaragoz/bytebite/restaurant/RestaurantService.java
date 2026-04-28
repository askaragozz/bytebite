package com.askaragoz.bytebite.restaurant;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final RestaurantSearchRepository restaurantSearchRepository;

    public RestaurantService (RestaurantRepository restaurantRepository, RestaurantSearchRepository restaurantSearchRepository){
        this.restaurantRepository = restaurantRepository;
        this.restaurantSearchRepository = restaurantSearchRepository;
    }

    @Cacheable("restaurants")
    public List<Restaurant> getAllRestaurants(){
        return restaurantRepository.findAll();
    }

    @CacheEvict(value="restaurants", allEntries = true)
    public Restaurant createRestaurant(Restaurant restaurant){
        restaurantRepository.save(restaurant);
        RestaurantDocument document = new RestaurantDocument(
                String.valueOf(restaurant.getId()),
                restaurant.getName(),
                restaurant.getDescription(),
                restaurant.getCuisineType()
        );
        restaurantSearchRepository.index(document);
        return restaurant;
    }

    public List<Restaurant> getRestaurantsByOwner(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId);
    }

    public List<RestaurantDocument> searchRestaurants(String query) {
        return restaurantSearchRepository.search(query);
    }

    @Cacheable(value = "restaurants", key = "#id")
    public Restaurant getRestaurantById(Long id){
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }
}
