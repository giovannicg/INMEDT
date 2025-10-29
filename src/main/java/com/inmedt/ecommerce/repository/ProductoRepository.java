package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    Page<Producto> findByActivoTrue(Pageable pageable);
    
    Page<Producto> findByActivoTrueAndCategoriaId(Long categoriaId, Pageable pageable);
    
    Page<Producto> findByActivoTrueAndMarcaContainingIgnoreCase(String marca, Pageable pageable);
    
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.marca) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Producto> findByActivoTrueAndSearchTerm(@Param("search") String search, Pageable pageable);
    
    List<Producto> findByActivoTrueAndCategoriaId(Long categoriaId);
    
    boolean existsByNombreAndCategoriaId(String nombre, Long categoriaId);
    
    Optional<Producto> findByNombreAndCategoriaId(String nombre, Long categoriaId);
    
    long countByCategoriaId(Long categoriaId);
}
