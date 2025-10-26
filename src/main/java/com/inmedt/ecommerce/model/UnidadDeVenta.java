package com.inmedt.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "unidades_venta")
public class UnidadDeVenta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "sku", nullable = false, unique = true)
    private String sku;
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "descripcion", nullable = false)
    private String descripcion;
    
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;
    
    @Min(0)
    @Column(name = "stock", nullable = false)
    private Integer stock = 0;
    
    @Column(name = "activa", nullable = false)
    private Boolean activa = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variante_id", nullable = false)
    private VarianteProducto variante;
    
    @OneToMany(mappedBy = "unidadVenta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CarritoItem> carritoItems;
    
    @OneToMany(mappedBy = "unidadVenta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PedidoItem> pedidoItems;
    
    // Constructores
    public UnidadDeVenta() {}
    
    public UnidadDeVenta(String sku, String descripcion, BigDecimal precio, Integer stock, VarianteProducto variante) {
        this.sku = sku;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.variante = variante;
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
    
    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }
    
    public VarianteProducto getVariante() { return variante; }
    public void setVariante(VarianteProducto variante) { this.variante = variante; }
    
    public List<CarritoItem> getCarritoItems() { return carritoItems; }
    public void setCarritoItems(List<CarritoItem> carritoItems) { this.carritoItems = carritoItems; }
    
    public List<PedidoItem> getPedidoItems() { return pedidoItems; }
    public void setPedidoItems(List<PedidoItem> pedidoItems) { this.pedidoItems = pedidoItems; }
}
