package com.example.login_backend.service;

import com.example.login_backend.dto.CartDto;
import com.example.login_backend.dto.CartItemDto;
import com.example.login_backend.dto.JewelryItemDto;
import com.example.login_backend.entity.Cart;
import com.example.login_backend.entity.CartItem;
import com.example.login_backend.repository.CartItemRepository;
import com.example.login_backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Autowired
    private JewelryItemService jewelryItemService;

    /** ------------------------------------------------------
     *  Kullanıcıya ait sepet varsa getir, yoksa oluştur
     * ------------------------------------------------------ */
    public CartDto getOrCreateCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().userId(userId).build()
                ));

        return mapToDto(cart);
    }

    /** ------------------------------------------------------
     *  Cart içindeki item'ları listele
     * ------------------------------------------------------ */
    public List<CartItemDto> getCartItems(Long cartId) {
        return cartItemRepository.findByCartId(cartId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /** ------------------------------------------------------
     *  Sepete ürün ekle
     * ------------------------------------------------------ */
    public CartItemDto addItemToCart(Long cartId, Long jewelryId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = CartItem.builder()
                .cart(cart)
                .jewelryId(jewelryId)
                .quantity(quantity)
                .build();

        return mapToDto(cartItemRepository.save(item));
    }

    /** ------------------------------------------------------
     *  Ürün sepetten sil
     * ------------------------------------------------------ */
    public void removeItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    /** ------------------------------------------------------
     *  Cart → DTO (totalPrice dahil!)
     * ------------------------------------------------------ */
    private CartDto mapToDto(Cart cart) {
        List<CartItemDto> items = cart.getItems() != null
                ? cart.getItems().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList())
                : List.of();

        // BigDecimal ile toplam
        BigDecimal total = items.stream()
                .map(i -> {
                    BigDecimal price = i.getJewelry().getPrice(); // JewelryItemDto.price -> BigDecimal
                    BigDecimal qty = BigDecimal.valueOf(i.getQuantity());
                    return price.multiply(qty);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDto.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .createdAt(cart.getCreatedAt())
                .items(items)
                .totalPrice(total)
                .build();
    }

    /** ------------------------------------------------------
     *  CartItem → DTO
     * ------------------------------------------------------ */
    private CartItemDto mapToDto(CartItem item) {
        JewelryItemDto jewelry = jewelryItemService.getById(item.getJewelryId());

        return CartItemDto.builder()
                .id(item.getId())
                .jewelryId(item.getJewelryId())
                .quantity(item.getQuantity())
                .jewelry(jewelry)
                .build();
    }

    /** ------------------------------------------------------
     *  Ürün miktarını güncelle
     * ------------------------------------------------------ */
    public CartItemDto updateQuantity(Long itemId, Integer quantity) {

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return mapToDto(item);  // Jewelry detaylı DTO döner
    }
}
