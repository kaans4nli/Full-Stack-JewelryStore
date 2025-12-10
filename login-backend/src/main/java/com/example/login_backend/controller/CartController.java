package com.example.login_backend.controller;

import com.example.login_backend.dto.CartDto;
import com.example.login_backend.dto.CartItemDto;
import com.example.login_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public CartDto getCart(@PathVariable Long userId) {
        return cartService.getOrCreateCart(userId);
    }

    @GetMapping("/items/{cartId}")
    public List<CartItemDto> getItems(@PathVariable Long cartId) {
        return cartService.getCartItems(cartId);
    }

    @PostMapping("/add")
    public CartItemDto addItem(@RequestParam Long cartId,
                               @RequestParam Long jewelryId,
                               @RequestParam Integer quantity) {
        return cartService.addItemToCart(cartId, jewelryId, quantity);
    }

    @PutMapping("/item/{itemId}")
    public CartItemDto updateQuantity(@PathVariable Long itemId,
                                      @RequestParam Integer quantity) {
        return cartService.updateQuantity(itemId, quantity);
    }

    @DeleteMapping("/item/{itemId}")
    public void removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
    }
}
