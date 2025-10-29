package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.VarianteProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VarianteProductoRepository extends JpaRepository<VarianteProducto, Long> {
    
    List<VarianteProducto> findByActivaTrueAndProductoId(Long productoId);
    
    List<VarianteProducto> findByActivaTrueAndProductoActivoTrueAndProductoId(Long productoId);
    
    List<VarianteProducto> findByProductoId(Long productoId);
}
