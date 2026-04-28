package com.askaragoz.bytebite.restaurant;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/restaurants")
public class RestaurantController {
    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService){
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants(){
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{restaurantId}")
    public Restaurant getRestaurantById(@PathVariable Long restaurantId){ return restaurantService.getRestaurantById(restaurantId); }

    @PreAuthorize("hasAuthority('RESTAURANT_OWNER')")
    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant){
        return restaurantService.createRestaurant(restaurant);
    }
}
