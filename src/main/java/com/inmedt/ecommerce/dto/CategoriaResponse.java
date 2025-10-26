package com.inmedt.ecommerce.dto;

public class CategoriaResponse {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer cantidadProductos;
    
    // Constructores
    public CategoriaResponse() {}
    
    public CategoriaResponse(Long id, String nombre, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
    
    public CategoriaResponse(Long id, String nombre, String descripcion, Integer cantidadProductos) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cantidadProductos = cantidadProductos;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public Integer getCantidadProductos() { return cantidadProductos; }
    public void setCantidadProductos(Integer cantidadProductos) { this.cantidadProductos = cantidadProductos; }
}
