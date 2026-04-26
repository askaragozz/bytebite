package com.askaragoz.bytebite.menuitem;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/menu-items")
public class MenuItemController{
    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService){
        this.menuItemService = menuItemService;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> getAllMenuItems(@PathVariable Long restaurantId){
        return menuItemService.getAllMenuItems(restaurantId);
    }

    @PreAuthorize("hasAuthority('RESTAURANT_OWNER')")
    @PostMapping
    public MenuItem createMenuItem(@RequestBody MenuItem menuItem){
        return menuItemService.createMenuItem(menuItem);
    }
}
