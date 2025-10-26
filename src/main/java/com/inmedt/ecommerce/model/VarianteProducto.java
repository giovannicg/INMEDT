package com.inmedt.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

@Entity
@Table(name = "variantes_producto")
public class VarianteProducto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Size(max = 500)
    @Column(name = "descripcion")
    private String descripcion;
    
    @Column(name = "activa", nullable = false)
    private Boolean activa = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;
    
    @OneToMany(mappedBy = "variante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UnidadDeVenta> unidadesVenta;
    
    // Constructores
    public VarianteProducto() {}
    
    public VarianteProducto(String nombre, String descripcion, Producto producto) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.producto = producto;
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
    
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    
    public List<UnidadDeVenta> getUnidadesVenta() { return unidadesVenta; }
    public void setUnidadesVenta(List<UnidadDeVenta> unidadesVenta) { this.unidadesVenta = unidadesVenta; }
}
