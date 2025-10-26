package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.AddToCartRequest;
import com.inmedt.ecommerce.dto.CarritoResponse;
import com.inmedt.ecommerce.dto.UpdateCartItemRequest;
import com.inmedt.ecommerce.model.*;
import com.inmedt.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CarritoService {
    
    @Autowired
    private CarritoRepository carritoRepository;
    
    @Autowired
    private CarritoItemRepository carritoItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UnidadDeVentaRepository unidadDeVentaRepository;
    
    public CarritoResponse getCarrito() {
        User user = getCurrentUser();
        Carrito carrito = getOrCreateCarrito(user);
        
        return convertToCarritoResponse(carrito);
    }
    
    public CarritoResponse addToCart(AddToCartRequest request) {
        User user = getCurrentUser();
        Carrito carrito = getOrCreateCarrito(user);
        
        UnidadDeVenta unidadVenta = unidadDeVentaRepository.findById(request.getUnidadVentaId())
                .orElseThrow(() -> new RuntimeException("Unidad de venta no encontrada"));
        
        if (!unidadVenta.getActiva()) {
            throw new RuntimeException("Producto no disponible");
        }
        
        if (unidadVenta.getStock() < request.getCantidad()) {
            throw new RuntimeException("Stock insuficiente");
        }
        
        // Verificar si el item ya existe en el carrito
        Optional<CarritoItem> existingItem = carritoItemRepository.findByCarritoAndUnidadVenta(carrito, unidadVenta);
        
        if (existingItem.isPresent()) {
            // Actualizar cantidad existente
            CarritoItem item = existingItem.get();
            int nuevaCantidad = item.getCantidad() + request.getCantidad();
            
            if (unidadVenta.getStock() < nuevaCantidad) {
                throw new RuntimeException("Stock insuficiente para la cantidad solicitada");
            }
            
            item.setCantidad(nuevaCantidad);
            carritoItemRepository.save(item);
        } else {
            // Crear nuevo item
            CarritoItem newItem = new CarritoItem(
                request.getCantidad(),
                unidadVenta.getPrecio(),
                carrito,
                unidadVenta
            );
            carritoItemRepository.save(newItem);
        }
        
        // Recalcular total del carrito
        updateCarritoTotal(carrito);
        
        return convertToCarritoResponse(carrito);
    }
    
    public CarritoResponse updateCartItem(Long itemId, UpdateCartItemRequest request) {
        User user = getCurrentUser();
        Carrito carrito = getOrCreateCarrito(user);
        
        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item del carrito no encontrado"));
        
        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new RuntimeException("No tienes permisos para modificar este item");
        }
        
        if (item.getUnidadVenta().getStock() < request.getCantidad()) {
            throw new RuntimeException("Stock insuficiente");
        }
        
        item.setCantidad(request.getCantidad());
        carritoItemRepository.save(item);
        
        // Recalcular total del carrito
        updateCarritoTotal(carrito);
        
        return convertToCarritoResponse(carrito);
    }
    
    public CarritoResponse removeFromCart(Long itemId) {
        User user = getCurrentUser();
        Carrito carrito = getOrCreateCarrito(user);
        
        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item del carrito no encontrado"));
        
        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new RuntimeException("No tienes permisos para eliminar este item");
        }
        
        carritoItemRepository.delete(item);
        
        // Recalcular total del carrito
        updateCarritoTotal(carrito);
        
        return convertToCarritoResponse(carrito);
    }
    
    public CarritoResponse clearCart() {
        User user = getCurrentUser();
        Carrito carrito = getOrCreateCarrito(user);
        
        carritoItemRepository.deleteByCarrito(carrito);
        carrito.setTotal(BigDecimal.ZERO);
        carrito.setUpdatedAt(LocalDateTime.now());
        carritoRepository.save(carrito);
        
        return convertToCarritoResponse(carrito);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    private Carrito getOrCreateCarrito(User user) {
        Optional<Carrito> carritoOpt = carritoRepository.findByUser(user);
        
        if (carritoOpt.isPresent()) {
            return carritoOpt.get();
        } else {
            Carrito carrito = new Carrito(user);
            return carritoRepository.save(carrito);
        }
    }
    
    private void updateCarritoTotal(Carrito carrito) {
        List<CarritoItem> items = carritoItemRepository.findByCarrito(carrito);
        BigDecimal total = items.stream()
                .map(CarritoItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        carrito.setTotal(total);
        carrito.setUpdatedAt(LocalDateTime.now());
        carritoRepository.save(carrito);
    }
    
    private CarritoResponse convertToCarritoResponse(Carrito carrito) {
        CarritoResponse response = new CarritoResponse(
            carrito.getId(),
            carrito.getTotal(),
            carrito.getCreatedAt(),
            carrito.getUpdatedAt()
        );
        
        List<CarritoResponse.CarritoItemResponse> items = carritoItemRepository.findByCarrito(carrito)
                .stream()
                .map(this::convertToCarritoItemResponse)
                .collect(Collectors.toList());
        
        response.setItems(items);
        return response;
    }
    
    private CarritoResponse.CarritoItemResponse convertToCarritoItemResponse(CarritoItem item) {
        CarritoResponse.CarritoItemResponse itemResponse = new CarritoResponse.CarritoItemResponse(
            item.getId(),
            item.getCantidad(),
            item.getPrecioUnitario(),
            item.getSubtotal()
        );
        
        UnidadDeVenta unidadVenta = item.getUnidadVenta();
        CarritoResponse.UnidadVentaResponse unidadResponse = new CarritoResponse.UnidadVentaResponse(
            unidadVenta.getId(),
            unidadVenta.getSku(),
            unidadVenta.getDescripcion(),
            unidadVenta.getPrecio(),
            unidadVenta.getStock()
        );
        
        // Agregar información adicional
        unidadResponse.setVarianteNombre(unidadVenta.getVariante().getNombre());
        unidadResponse.setProductoNombre(unidadVenta.getVariante().getProducto().getNombre());
        unidadResponse.setMarca(unidadVenta.getVariante().getProducto().getMarca());
        
        itemResponse.setUnidadVenta(unidadResponse);
        return itemResponse;
    }
}
