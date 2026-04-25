package com.askaragoz.bytebite.menuitem;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {
    private final MenuItemRepository menuItemRepository;

    public MenuItemService (MenuItemRepository menuItemRepository){
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> getAllMenuItems(Long restaurantId){
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public MenuItem createMenuItem(MenuItem menuItem){
        return menuItemRepository.save(menuItem);
    }

}
