package com.inmedt.ecommerce.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductoResponse {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private String marca;
    private String categoriaNombre;
    private Boolean activo;
    private List<VarianteResponse> variantes;
    
    // Constructores
    public ProductoResponse() {}
    
    public ProductoResponse(Long id, String nombre, String descripcion, String marca, String categoriaNombre) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.marca = marca;
        this.categoriaNombre = categoriaNombre;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    
    public String getCategoriaNombre() { return categoriaNombre; }
    public void setCategoriaNombre(String categoriaNombre) { this.categoriaNombre = categoriaNombre; }
    
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    
    public List<VarianteResponse> getVariantes() { return variantes; }
    public void setVariantes(List<VarianteResponse> variantes) { this.variantes = variantes; }
    
    public static class VarianteResponse {
        private Long id;
        private String nombre;
        private String descripcion;
        private Boolean activa;
        private List<UnidadVentaResponse> unidadesVenta;
        
        // Constructores
        public VarianteResponse() {}
        
        public VarianteResponse(Long id, String nombre, String descripcion) {
            this.id = id;
            this.nombre = nombre;
            this.descripcion = descripcion;
        }
        
        public VarianteResponse(Long id, String nombre, String descripcion, Boolean activa) {
            this.id = id;
            this.nombre = nombre;
            this.descripcion = descripcion;
            this.activa = activa;
        }
        
        // Getters y Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
        
        public Boolean getActiva() { return activa; }
        public void setActiva(Boolean activa) { this.activa = activa; }
        
        public List<UnidadVentaResponse> getUnidadesVenta() { return unidadesVenta; }
        public void setUnidadesVenta(List<UnidadVentaResponse> unidadesVenta) { this.unidadesVenta = unidadesVenta; }
    }
    
    public static class UnidadVentaResponse {
        private Long id;
        private String sku;
        private String descripcion;
        private BigDecimal precio;
        private Integer stock;
        private Boolean activa;
        private Boolean disponible;
        
        // Constructores
        public UnidadVentaResponse() {}
        
        public UnidadVentaResponse(Long id, String sku, String descripcion, BigDecimal precio, Integer stock) {
            this.id = id;
            this.sku = sku;
            this.descripcion = descripcion;
            this.precio = precio;
            this.stock = stock;
            this.disponible = stock > 0;
        }
        
        public UnidadVentaResponse(Long id, String sku, String descripcion, BigDecimal precio, Integer stock, Boolean activa) {
            this.id = id;
            this.sku = sku;
            this.descripcion = descripcion;
            this.precio = precio;
            this.stock = stock;
            this.activa = activa;
            this.disponible = stock > 0 && activa;
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
        public void setStock(Integer stock) { 
            this.stock = stock;
            this.disponible = stock > 0 && (activa != null ? activa : true);
        }
        
        public Boolean getActiva() { return activa; }
        public void setActiva(Boolean activa) { 
            this.activa = activa;
            this.disponible = (stock != null ? stock > 0 : false) && activa;
        }
        
        public Boolean getDisponible() { return disponible; }
        public void setDisponible(Boolean disponible) { this.disponible = disponible; }
    }
}
