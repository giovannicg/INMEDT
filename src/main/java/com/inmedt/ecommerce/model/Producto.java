package com.inmedt.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

@Entity
@Table(name = "productos")
public class Producto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Size(max = 1000)
    @Column(name = "descripcion")
    private String descripcion;
    
    @Size(max = 100)
    @Column(name = "marca")
    private String marca;
    
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
    
    @Column(name = "imagen_principal")
    private String imagenPrincipal;
    
    @Column(name = "imagen_thumbnail")
    private String imagenThumbnail;
    
    @ElementCollection
    @CollectionTable(name = "producto_imagenes", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "imagen_url")
    private List<String> imagenesGaleria;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;
    
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VarianteProducto> variantes;
    
    // Constructores
    public Producto() {}
    
    public Producto(String nombre, String descripcion, String marca, Categoria categoria, Boolean activo) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.marca = marca;
        this.categoria = categoria;
        this.activo = activo;
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
    
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
    
    public List<VarianteProducto> getVariantes() { return variantes; }
    public void setVariantes(List<VarianteProducto> variantes) { this.variantes = variantes; }
    
    public String getImagenPrincipal() { return imagenPrincipal; }
    public void setImagenPrincipal(String imagenPrincipal) { this.imagenPrincipal = imagenPrincipal; }
    
    public String getImagenThumbnail() { return imagenThumbnail; }
    public void setImagenThumbnail(String imagenThumbnail) { this.imagenThumbnail = imagenThumbnail; }
    
    public List<String> getImagenesGaleria() { return imagenesGaleria; }
    public void setImagenesGaleria(List<String> imagenesGaleria) { this.imagenesGaleria = imagenesGaleria; }
}
