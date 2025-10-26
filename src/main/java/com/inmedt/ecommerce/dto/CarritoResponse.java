package com.inmedt.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CarritoResponse {
    
    private Long id;
    private BigDecimal total;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CarritoItemResponse> items;
    
    // Constructores
    public CarritoResponse() {}
    
    public CarritoResponse(Long id, BigDecimal total, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.total = total;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<CarritoItemResponse> getItems() { return items; }
    public void setItems(List<CarritoItemResponse> items) { this.items = items; }
    
    public static class CarritoItemResponse {
        private Long id;
        private Integer cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;
        private UnidadVentaResponse unidadVenta;
        
        // Constructores
        public CarritoItemResponse() {}
        
        public CarritoItemResponse(Long id, Integer cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {
            this.id = id;
            this.cantidad = cantidad;
            this.precioUnitario = precioUnitario;
            this.subtotal = subtotal;
        }
        
        // Getters y Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        
        public BigDecimal getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
        
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
        
        public UnidadVentaResponse getUnidadVenta() { return unidadVenta; }
        public void setUnidadVenta(UnidadVentaResponse unidadVenta) { this.unidadVenta = unidadVenta; }
    }
    
    public static class UnidadVentaResponse {
        private Long id;
        private String sku;
        private String descripcion;
        private BigDecimal precio;
        private Integer stock;
        private String varianteNombre;
        private String productoNombre;
        private String marca;
        
        // Constructores
        public UnidadVentaResponse() {}
        
        public UnidadVentaResponse(Long id, String sku, String descripcion, BigDecimal precio, Integer stock) {
            this.id = id;
            this.sku = sku;
            this.descripcion = descripcion;
            this.precio = precio;
            this.stock = stock;
        }
        
        // Getters y Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
        
        public BigDecimal getPrecio() { return precio; }
        public void setPrecio(BigDecimal precio) { this.precio = precio; }
        
        public Integer getStock() { return stock; }
        public void setStock(Integer stock) { this.stock = stock; }
        
        public String getVarianteNombre() { return varianteNombre; }
        public void setVarianteNombre(String varianteNombre) { this.varianteNombre = varianteNombre; }
        
        public String getProductoNombre() { return productoNombre; }
        public void setProductoNombre(String productoNombre) { this.productoNombre = productoNombre; }
        
        public String getMarca() { return marca; }
        public void setMarca(String marca) { this.marca = marca; }
    }
}
