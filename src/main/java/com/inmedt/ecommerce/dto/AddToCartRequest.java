package com.inmedt.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class AddToCartRequest {
    
    @NotNull(message = "El ID de la unidad de venta es obligatorio")
    private Long unidadVentaId;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;
    
    // Constructores
    public AddToCartRequest() {}
    
    public AddToCartRequest(Long unidadVentaId, Integer cantidad) {
        this.unidadVentaId = unidadVentaId;
        this.cantidad = cantidad;
    }
    
    // Getters y Setters
    public Long getUnidadVentaId() { return unidadVentaId; }
    public void setUnidadVentaId(Long unidadVentaId) { this.unidadVentaId = unidadVentaId; }
    
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
