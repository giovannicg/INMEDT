package com.inmedt.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoResponse {
    
    private Long id;
    private String numeroPedido;
    private BigDecimal subtotal;
    private BigDecimal costoEnvio;
    private BigDecimal total;
    private String estado;
    private String direccionEnvio;
    private String telefonoContacto;
    private String ciudad;
    private String sector;
    private String notas;
    private String userEmail;
    private String userNombre;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PedidoItemResponse> items;
    
    // Constructores
    public PedidoResponse() {}
    
    public PedidoResponse(Long id, String numeroPedido, BigDecimal subtotal, BigDecimal costoEnvio,
                         BigDecimal total, String estado, String direccionEnvio, LocalDateTime createdAt) {
        this.id = id;
        this.numeroPedido = numeroPedido;
        this.subtotal = subtotal;
        this.costoEnvio = costoEnvio;
        this.total = total;
        this.estado = estado;
        this.direccionEnvio = direccionEnvio;
        this.createdAt = createdAt;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNumeroPedido() { return numeroPedido; }
    public void setNumeroPedido(String numeroPedido) { this.numeroPedido = numeroPedido; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    
    public BigDecimal getCostoEnvio() { return costoEnvio; }
    public void setCostoEnvio(BigDecimal costoEnvio) { this.costoEnvio = costoEnvio; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public String getDireccionEnvio() { return direccionEnvio; }
    public void setDireccionEnvio(String direccionEnvio) { this.direccionEnvio = direccionEnvio; }
    
    public String getTelefonoContacto() { return telefonoContacto; }
    public void setTelefonoContacto(String telefonoContacto) { this.telefonoContacto = telefonoContacto; }
    
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    
    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public String getUserNombre() { return userNombre; }
    public void setUserNombre(String userNombre) { this.userNombre = userNombre; }
    
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<PedidoItemResponse> getItems() { return items; }
    public void setItems(List<PedidoItemResponse> items) { this.items = items; }
    
    public static class PedidoItemResponse {
        private Long id;
        private Integer cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;
        private UnidadVentaResponse unidadVenta;
        
        // Constructores
        public PedidoItemResponse() {}
        
        public PedidoItemResponse(Long id, Integer cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {
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
        private String varianteNombre;
        private String productoNombre;
        private String marca;
        
        // Constructores
        public UnidadVentaResponse() {}
        
        public UnidadVentaResponse(Long id, String sku, String descripcion, BigDecimal precio) {
            this.id = id;
            this.sku = sku;
            this.descripcion = descripcion;
            this.precio = precio;
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
        
        public String getVarianteNombre() { return varianteNombre; }
        public void setVarianteNombre(String varianteNombre) { this.varianteNombre = varianteNombre; }
        
        public String getProductoNombre() { return productoNombre; }
        public void setProductoNombre(String productoNombre) { this.productoNombre = productoNombre; }
        
        public String getMarca() { return marca; }
        public void setMarca(String marca) { this.marca = marca; }
    }
}
