package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.CarritoItem;
import com.inmedt.ecommerce.model.Carrito;
import com.inmedt.ecommerce.model.UnidadDeVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {
    
    List<CarritoItem> findByCarrito(Carrito carrito);
    
    List<CarritoItem> findByCarritoId(Long carritoId);
    
    Optional<CarritoItem> findByCarritoAndUnidadVenta(Carrito carrito, UnidadDeVenta unidadVenta);
    
    Optional<CarritoItem> findByCarritoIdAndUnidadVentaId(Long carritoId, Long unidadVentaId);
    
    void deleteByCarrito(Carrito carrito);
    
    void deleteByCarritoId(Long carritoId);
}
