package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.PedidoResponse;
import com.inmedt.ecommerce.model.Pedido;
import com.inmedt.ecommerce.repository.PedidoRepository;
import com.inmedt.ecommerce.repository.PedidoItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminPedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private PedidoItemRepository pedidoItemRepository;
    
    public Page<PedidoResponse> getAllPedidos(Pageable pageable) {
        Page<Pedido> pedidos = pedidoRepository.findAll(pageable);
        return pedidos.map(this::convertToPedidoResponse);
    }
    
    public List<PedidoResponse> getAllPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        return pedidos.stream()
                .map(this::convertToPedidoResponse)
                .collect(Collectors.toList());
    }
    
    public PedidoResponse getPedidoById(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return convertToPedidoResponse(pedido);
    }
    
    public PedidoResponse updatePedidoEstado(Long id, String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
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
    
    public List<PedidoResponse> getPedidosByEstado(String estado) {
        try {
            Pedido.EstadoPedido estadoPedido = Pedido.EstadoPedido.valueOf(estado.toUpperCase());
            List<Pedido> pedidos = pedidoRepository.findAll().stream()
                    .filter(pedido -> pedido.getEstado() == estadoPedido)
                    .collect(Collectors.toList());
            return pedidos.stream()
                    .map(this::convertToPedidoResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado de pedido inválido: " + estado);
        }
    }
    
    public List<PedidoResponse> getPedidosByUser(Long userId) {
        List<Pedido> pedidos = pedidoRepository.findAll().stream()
                .filter(pedido -> pedido.getUser().getId().equals(userId))
                .collect(Collectors.toList());
        return pedidos.stream()
                .map(this::convertToPedidoResponse)
                .collect(Collectors.toList());
    }
    
    public List<PedidoResponse> getPedidosByDateRange(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        List<Pedido> pedidos = pedidoRepository.findAll().stream()
                .filter(pedido -> pedido.getCreatedAt().isAfter(fechaInicio) && 
                                 pedido.getCreatedAt().isBefore(fechaFin))
                .collect(Collectors.toList());
        return pedidos.stream()
                .map(this::convertToPedidoResponse)
                .collect(Collectors.toList());
    }
    
    public void deletePedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        // Solo permitir eliminar pedidos cancelados
        if (pedido.getEstado() != Pedido.EstadoPedido.CANCELADO) {
            throw new RuntimeException("Solo se pueden eliminar pedidos cancelados");
        }
        
        pedidoRepository.delete(pedido);
    }
    
    public PedidoResponse updatePedidoInfo(Long id, String direccionEnvio, String telefonoContacto, String notas) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        pedido.setDireccionEnvio(direccionEnvio);
        pedido.setTelefonoContacto(telefonoContacto);
        pedido.setNotas(notas);
        pedido.setUpdatedAt(LocalDateTime.now());
        
        Pedido savedPedido = pedidoRepository.save(pedido);
        return convertToPedidoResponse(savedPedido);
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
    
    private PedidoResponse.PedidoItemResponse convertToPedidoItemResponse(com.inmedt.ecommerce.model.PedidoItem item) {
        PedidoResponse.PedidoItemResponse itemResponse = new PedidoResponse.PedidoItemResponse(
            item.getId(),
            item.getCantidad(),
            item.getPrecioUnitario(),
            item.getSubtotal()
        );
        
        com.inmedt.ecommerce.model.UnidadDeVenta unidadVenta = item.getUnidadVenta();
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
