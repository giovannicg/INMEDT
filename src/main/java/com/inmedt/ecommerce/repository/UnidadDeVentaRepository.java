package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.UnidadDeVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnidadDeVentaRepository extends JpaRepository<UnidadDeVenta, Long> {
    
    Optional<UnidadDeVenta> findBySku(String sku);
    
    List<UnidadDeVenta> findByActivaTrueAndStockGreaterThan(Integer stock);
    
    List<UnidadDeVenta> findByActivaTrueAndVarianteId(Long varianteId);
    
    List<UnidadDeVenta> findByActivaTrueAndVarianteActivaTrueAndVarianteProductoActivoTrueAndVarianteProductoId(Long productoId);
    
    @Query("SELECT u FROM UnidadDeVenta u WHERE u.activa = true AND u.stock > 0 AND " +
           "u.variante.activa = true AND u.variante.producto.activo = true AND " +
           "u.variante.producto.id = :productoId")
    List<UnidadDeVenta> findAvailableByProductoId(@Param("productoId") Long productoId);
    
    boolean existsBySku(String sku);
}
