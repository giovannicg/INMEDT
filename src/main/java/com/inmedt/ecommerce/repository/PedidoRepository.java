package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.Pedido;
import com.inmedt.ecommerce.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    List<Pedido> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Pedido> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Optional<Pedido> findByNumeroPedido(String numeroPedido);
    
    boolean existsByNumeroPedido(String numeroPedido);
}
