package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.Carrito;
import com.inmedt.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    
    Optional<Carrito> findByUser(User user);
    
    Optional<Carrito> findByUserId(Long userId);
    
    boolean existsByUserId(Long userId);
}
