package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
    List<Categoria> findByActivaTrueOrderByNombreAsc();
    
    boolean existsByNombre(String nombre);
    
    Optional<Categoria> findByNombre(String nombre);
}
