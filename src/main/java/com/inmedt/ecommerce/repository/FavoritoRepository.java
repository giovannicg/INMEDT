package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    
    List<Favorito> findByUserId(Long userId);
    
    Optional<Favorito> findByUserIdAndProductoId(Long userId, Long productoId);
    
    boolean existsByUserIdAndProductoId(Long userId, Long productoId);
    
    void deleteByUserIdAndProductoId(Long userId, Long productoId);
    
    @Query("SELECT COUNT(f) FROM Favorito f WHERE f.producto.id = :productoId")
    long countByProductoId(@Param("productoId") Long productoId);
}
