package com.inmedt.ecommerce.repository;

import com.inmedt.ecommerce.model.PedidoItem;
import com.inmedt.ecommerce.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoItemRepository extends JpaRepository<PedidoItem, Long> {
    
    List<PedidoItem> findByPedido(Pedido pedido);
    
    List<PedidoItem> findByPedidoId(Long pedidoId);
}
