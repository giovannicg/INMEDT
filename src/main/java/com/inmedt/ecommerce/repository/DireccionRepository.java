package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    
    List<Direccion> findByUserIdAndActivaTrue(Long userId);
    
    List<Direccion> findByUserId(Long userId);
    
    Optional<Direccion> findByUserIdAndEsPrincipalTrue(Long userId);
    
    @Modifying
    @Query("UPDATE Direccion d SET d.esPrincipal = false WHERE d.user.id = :userId")
    void clearPrincipalByUserId(@Param("userId") Long userId);
    
    boolean existsByUserIdAndNombre(Long userId, String nombre);
}
