package com.askaragoz.bytebite.config;

import com.askaragoz.bytebite.menuitem.MenuItem;
import com.askaragoz.bytebite.menuitem.MenuItemRepository;
import com.askaragoz.bytebite.restaurant.Restaurant;
import com.askaragoz.bytebite.restaurant.RestaurantService;
import com.askaragoz.bytebite.user.User;
import com.askaragoz.bytebite.user.UserRepository;
import com.askaragoz.bytebite.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RestaurantService restaurantService;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;
    private final CacheManager cacheManager;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        String pw = passwordEncoder.encode("password");
        LocalDateTime now = LocalDateTime.now();

        // Customers
        userRepository.save(new User(null, "Alice Chen", "alice@bytebite.dev", pw, UserRole.CUSTOMER, now));
        userRepository.save(new User(null, "Bob Smith", "bob@bytebite.dev", pw, UserRole.CUSTOMER, now));
        userRepository.save(new User(null, "Carol White", "carol@bytebite.dev", pw, UserRole.CUSTOMER, now));

        // Owners
        User owner1 = userRepository.save(new User(null, "Mario Rossi", "mario@bytebite.dev", pw, UserRole.RESTAURANT_OWNER, now));
        User owner2 = userRepository.save(new User(null, "Sarah Park", "sarah@bytebite.dev", pw, UserRole.RESTAURANT_OWNER, now));
        User owner3 = userRepository.save(new User(null, "James Wong", "james@bytebite.dev", pw, UserRole.RESTAURANT_OWNER, now));

        // Drivers
        userRepository.save(new User(null, "Dave Miles", "dave@bytebite.dev", pw, UserRole.DRIVER, now));
        userRepository.save(new User(null, "Eva Torres", "eva@bytebite.dev", pw, UserRole.DRIVER, now));
        userRepository.save(new User(null, "Frank Lee", "frank@bytebite.dev", pw, UserRole.DRIVER, now));

        // Mario's restaurants (Italian)
        Restaurant pizzeria = restaurantService.createRestaurant(new Restaurant(null, "Mario's Pizzeria", "Authentic Neapolitan pizza", "Italian", "123 Main St", true, 4.7, now, owner1.getId()));
        Restaurant trattoria = restaurantService.createRestaurant(new Restaurant(null, "La Trattoria", "Classic Italian comfort food", "Italian", "45 Olive Lane", true, 4.3, now, owner1.getId()));
        Restaurant gelato = restaurantService.createRestaurant(new Restaurant(null, "Gelato & Co", "Artisan gelato and espresso", "Italian", "8 Piazza Rd", false, 4.8, now, owner1.getId()));

        // Sarah's restaurants (Asian)
        Restaurant sushi = restaurantService.createRestaurant(new Restaurant(null, "Sakura Sushi", "Fresh rolls and nigiri", "Japanese", "77 Cherry Blvd", true, 4.6, now, owner2.getId()));
        Restaurant ramen = restaurantService.createRestaurant(new Restaurant(null, "Ramen House", "Rich tonkotsu and miso broths", "Japanese", "12 Noodle St", true, 4.4, now, owner2.getId()));
        Restaurant thai = restaurantService.createRestaurant(new Restaurant(null, "Bangkok Bites", "Authentic Thai street food", "Thai", "99 Spice Ave", true, 4.5, now, owner2.getId()));
        Restaurant dim = restaurantService.createRestaurant(new Restaurant(null, "Dim Sum Palace", "Traditional dim sum all day", "Chinese", "3 Dynasty Ct", false, 4.2, now, owner2.getId()));

        // James's restaurants (Western)
        Restaurant burger = restaurantService.createRestaurant(new Restaurant(null, "Burger Barn", "Juicy smash burgers", "American", "456 Oak Ave", true, 4.2, now, owner3.getId()));
        Restaurant bbq = restaurantService.createRestaurant(new Restaurant(null, "Smoke & Grill", "Slow smoked BBQ ribs and brisket", "BBQ", "88 Pitmaster Rd", true, 4.6, now, owner3.getId()));
        Restaurant taco = restaurantService.createRestaurant(new Restaurant(null, "Taco Loco", "Street tacos and fresh guac", "Mexican", "21 Fiesta Blvd", true, 4.3, now, owner3.getId()));
        Restaurant diner = restaurantService.createRestaurant(new Restaurant(null, "The Classic Diner", "All-day breakfast and comfort food", "American", "5 Retro Ave", true, 4.1, now, owner3.getId()));

        // Mario's Pizzeria menu
        menuItemRepository.saveAll(List.of(
            new MenuItem(null, "Margherita", "San Marzano tomato, fior di latte", 12.99f, "Pizza", true, now, pizzeria),
            new MenuItem(null, "Pepperoni", "Double pepperoni, chilli oil", 14.99f, "Pizza", true, now, pizzeria),
            new MenuItem(null, "Quattro Formaggi", "Four cheese blend", 15.99f, "Pizza", true, now, pizzeria),
            new MenuItem(null, "Caesar Salad", "Romaine, parmesan, house croutons", 9.99f, "Salad", true, now, pizzeria),
            new MenuItem(null, "Tiramisu", "House-made with mascarpone", 6.99f, "Dessert", true, now, pizzeria)
        ));

        // La Trattoria menu
        menuItemRepository.saveAll(List.of(
            new MenuItem(null, "Spaghetti Bolognese", "Slow cooked beef ragu", 13.99f, "Pasta", true, now, trattoria),
            new MenuItem(null, "Fettuccine Alfredo", "Butter and parmesan cream sauce", 12.99f, "Pasta", true, now, trattoria),
            new MenuItem(null, "Osso Buco", "Braised veal shank with gremolata", 22.99f, "Main", true, now, trattoria),
            new MenuItem(null, "Bruschetta", "Tomato, basil, garlic on sourdough", 7.99f, "Starter", true, now, trattoria),
            new MenuItem(null, "Panna Cotta", "Vanilla with berry coulis", 6.49f, "Dessert", true, now, trattoria)
        ));

        // Sakura Sushi menu
        menuItemRepository.saveAll(List.of(
            new MenuItem(null, "Salmon Nigiri (2pc)", "Fresh Atlantic salmon", 8.99f, "Nigiri", true, now, sushi),
            new MenuItem(null, "Dragon Roll", "Shrimp tempura, avocado, eel sauce", 14.99f, "Roll", true, now, sushi),
            new MenuItem(null, "Spicy Tuna Roll", "Tuna, sriracha mayo, cucumber", 12.99f, "Roll", true, now, sushi),
            new MenuItem(null, "Edamame", "Salted steamed soybeans", 4.99f, "Starter", true, now, sushi),
            new MenuItem(null, "Miso Soup", "Tofu, wakame, green onion", 3.99f, "Soup", true, now, sushi)
        ));

        // Ramen House menu
        menuItemRepository.saveAll(List.of(
            new MenuItem(null, "Tonkotsu Ramen", "Rich pork broth, chashu, soft egg", 14.99f, "Ramen", true, now, ramen),
            new MenuItem(null, "Spicy Miso Ramen", "Miso broth, corn, butter", 13.99f, "Ramen", true, now, ramen),
            new MenuItem(null, "Gyoza (6pc)", "Pan-fried pork dumplings", 7.99f, "Sides", true, now, ramen),
            new MenuItem(null, "Karaage Chicken", "Japanese fried chicken, kewpie mayo", 9.99f, "Sides", true, now, ramen),
            new MenuItem(null, "Matcha Ice Cream", "Two scoops", 4.99f, "Dessert", true, now, ramen)
        ));

        // Burger Barn menu
        menuItemRepository.saveAll(List.of(
            new MenuItem(null, "Smash Burger", "Double patty, cheddar, pickles", 11.99f, "Burger", true, now, burger),
            new MenuItem(null, "BBQ Bacon Burger", "Crispy bacon, smoky BBQ sauce", 13.99f, "Burger", true, now, burger),
            new MenuItem(null, "Veggie Burger", "Black bean patty, chipotle mayo", 10.99f, "Burger", true, now, burger),
            new MenuItem(null, "Crispy Fries", "Golden seasoned fries", 4.99f, "Sides", true, now, burger),
            new MenuItem(null, "Onion Rings", "Beer-battered onion rings", 5.49f, "Sides", true, now, burger),
            new MenuItem(null, "Chocolate Shake", "Thick hand-spun milkshake", 5.99f, "Drinks", true, now, burger)
        ));

        // Smoke & Grill menu
        menuItemRepository.saveAll(List.of(
            new MenuItem(null, "Beef Brisket (300g)", "12-hour smoked with dry rub", 22.99f, "BBQ", true, now, bbq),
            new MenuItem(null, "Pork Ribs (half rack)", "Fall-off-the-bone baby back ribs", 19.99f, "BBQ", true, now, bbq),
            new MenuItem(null, "Pulled Pork Sandwich", "Slow smoked, house slaw", 12.99f, "Sandwich", true, now, bbq),
            new MenuItem(null, "Mac & Cheese", "Smoked gouda mac", 7.99f, "Sides", true, now, bbq),
            new MenuItem(null, "Coleslaw", "Creamy house coleslaw", 3.99f, "Sides", true, now, bbq)
        ));

        // Taco Loco menu
        menuItemRepository.saveAll(List.of(
            new MenuItem(null, "Carne Asada Taco", "Grilled beef, cilantro, onion", 4.99f, "Taco", true, now, taco),
            new MenuItem(null, "Al Pastor Taco", "Marinated pork, pineapple", 4.99f, "Taco", true, now, taco),
            new MenuItem(null, "Shrimp Taco", "Grilled shrimp, chipotle crema", 5.99f, "Taco", true, now, taco),
            new MenuItem(null, "Guacamole & Chips", "Fresh made to order", 7.99f, "Starter", true, now, taco),
            new MenuItem(null, "Churros", "Cinnamon sugar, chocolate dip", 5.49f, "Dessert", true, now, taco)
        ));

        // Bangkok Bites and Dim Sum Palace — no extra items for now (open/closed as variety)

        // The Classic Diner menu
        menuItemRepository.saveAll(List.of(
            new MenuItem(null, "Full Breakfast", "Eggs, bacon, toast, hashbrown", 10.99f, "Breakfast", true, now, diner),
            new MenuItem(null, "Pancake Stack", "Buttermilk pancakes, maple syrup", 8.99f, "Breakfast", true, now, diner),
            new MenuItem(null, "Club Sandwich", "Turkey, bacon, lettuce, tomato", 11.99f, "Sandwich", true, now, diner),
            new MenuItem(null, "Beef Chili", "Slow cooked with cornbread", 9.99f, "Main", true, now, diner),
            new MenuItem(null, "Apple Pie", "Warm with vanilla ice cream", 6.49f, "Dessert", true, now, diner)
        ));

        var cache = cacheManager.getCache("restaurants");
        if (cache != null) cache.clear();
    }
}
