package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.CheckoutRequest;
import com.inmedt.ecommerce.dto.PedidoResponse;
import com.inmedt.ecommerce.model.*;
import com.inmedt.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private PedidoItemRepository pedidoItemRepository;
    
    @Autowired
    private CarritoRepository carritoRepository;
    
    @Autowired
    private CarritoItemRepository carritoItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UnidadDeVentaRepository unidadDeVentaRepository;
    
    public PedidoResponse checkout(CheckoutRequest request) {
        User user = getCurrentUser();
        Carrito carrito = carritoRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
        
        List<CarritoItem> carritoItems = carritoItemRepository.findByCarrito(carrito);
        
        if (carritoItems.isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }
        
        // Verificar stock disponible
        for (CarritoItem item : carritoItems) {
            if (item.getUnidadVenta().getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + item.getUnidadVenta().getDescripcion());
            }
        }
        
        // Crear pedido
        String numeroPedido = generateNumeroPedido();
        Pedido pedido = new Pedido(numeroPedido, carrito.getTotal(), request.getDireccionEnvio(), user);
        pedido.setTelefonoContacto(request.getTelefonoContacto());
        pedido.setNotas(request.getNotas());
        pedido.setEstado(Pedido.EstadoPedido.CONFIRMADO);
        
        Pedido savedPedido = pedidoRepository.save(pedido);
        
        // Crear items del pedido y actualizar stock
        for (CarritoItem carritoItem : carritoItems) {
            PedidoItem pedidoItem = new PedidoItem(
                carritoItem.getCantidad(),
                carritoItem.getPrecioUnitario(),
                savedPedido,
                carritoItem.getUnidadVenta()
            );
            pedidoItemRepository.save(pedidoItem);
            
            // Actualizar stock
            UnidadDeVenta unidadVenta = carritoItem.getUnidadVenta();
            unidadVenta.setStock(unidadVenta.getStock() - carritoItem.getCantidad());
            unidadDeVentaRepository.save(unidadVenta);
        }
        
        // Limpiar carrito
        carritoItemRepository.deleteByCarrito(carrito);
        carrito.setTotal(BigDecimal.ZERO);
        carrito.setUpdatedAt(LocalDateTime.now());
        carritoRepository.save(carrito);
        
        return convertToPedidoResponse(savedPedido);
    }
    
    public Page<PedidoResponse> getPedidosByUser(Pageable pageable) {
        User user = getCurrentUser();
        Page<Pedido> pedidos = pedidoRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return pedidos.map(this::convertToPedidoResponse);
    }
    
    public List<PedidoResponse> getAllPedidosByUser() {
        User user = getCurrentUser();
        List<Pedido> pedidos = pedidoRepository.findByUserOrderByCreatedAtDesc(user);
        return pedidos.stream()
                .map(this::convertToPedidoResponse)
                .collect(Collectors.toList());
    }
    
    public PedidoResponse getPedidoById(Long id) {
        User user = getCurrentUser();
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        if (!pedido.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No tienes permisos para ver este pedido");
        }
        
        return convertToPedidoResponse(pedido);
    }
    
    public PedidoResponse updatePedidoEstado(Long id, String nuevoEstado) {
        User user = getCurrentUser();
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        if (!pedido.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No tienes permisos para modificar este pedido");
        }
        
        try {
            Pedido.EstadoPedido estado = Pedido.EstadoPedido.valueOf(nuevoEstado.toUpperCase());
            pedido.setEstado(estado);
            pedido.setUpdatedAt(LocalDateTime.now());
            Pedido savedPedido = pedidoRepository.save(pedido);
            
            return convertToPedidoResponse(savedPedido);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado de pedido inválido: " + nuevoEstado);
        }
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    private String generateNumeroPedido() {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "PED-" + timestamp.substring(timestamp.length() - 6) + "-" + uuid;
    }
    
    private PedidoResponse convertToPedidoResponse(Pedido pedido) {
        PedidoResponse response = new PedidoResponse(
            pedido.getId(),
            pedido.getNumeroPedido(),
            pedido.getTotal(),
            pedido.getEstado().name(),
            pedido.getDireccionEnvio(),
            pedido.getCreatedAt()
        );
        
        response.setTelefonoContacto(pedido.getTelefonoContacto());
        response.setNotas(pedido.getNotas());
        response.setUpdatedAt(pedido.getUpdatedAt());
        
        List<PedidoResponse.PedidoItemResponse> items = pedidoItemRepository.findByPedido(pedido)
                .stream()
                .map(this::convertToPedidoItemResponse)
                .collect(Collectors.toList());
        
        response.setItems(items);
        return response;
    }
    
    private PedidoResponse.PedidoItemResponse convertToPedidoItemResponse(PedidoItem item) {
        PedidoResponse.PedidoItemResponse itemResponse = new PedidoResponse.PedidoItemResponse(
            item.getId(),
            item.getCantidad(),
            item.getPrecioUnitario(),
            item.getSubtotal()
        );
        
        UnidadDeVenta unidadVenta = item.getUnidadVenta();
        PedidoResponse.UnidadVentaResponse unidadResponse = new PedidoResponse.UnidadVentaResponse(
            unidadVenta.getId(),
            unidadVenta.getSku(),
            unidadVenta.getDescripcion(),
            unidadVenta.getPrecio()
        );
        
        // Agregar información adicional
        unidadResponse.setVarianteNombre(unidadVenta.getVariante().getNombre());
        unidadResponse.setProductoNombre(unidadVenta.getVariante().getProducto().getNombre());
        unidadResponse.setMarca(unidadVenta.getVariante().getProducto().getMarca());
        
        itemResponse.setUnidadVenta(unidadResponse);
        return itemResponse;
    }
}
