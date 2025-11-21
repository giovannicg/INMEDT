package com.inmedt.ecommerce.dto;

import java.time.LocalDateTime;

public class FavoritoResponse {

    private Long id;
    private Long productoId;
    private String productoNombre;
    private String productoDescripcion;
    private String productoImagen;
    private Boolean productoActivo;
    private LocalDateTime createdAt;

    // Información básica del producto para mostrar en favoritos
    private ProductoBasicoResponse producto;

    // Constructors
    public FavoritoResponse() {}

    public FavoritoResponse(Long id, Long productoId, String productoNombre, String productoDescripcion,
                          String productoImagen, Boolean productoActivo, LocalDateTime createdAt) {
        this.id = id;
        this.productoId = productoId;
        this.productoNombre = productoNombre;
        this.productoDescripcion = productoDescripcion;
        this.productoImagen = productoImagen;
        this.productoActivo = productoActivo;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public String getProductoNombre() {
        return productoNombre;
    }

    public void setProductoNombre(String productoNombre) {
        this.productoNombre = productoNombre;
    }

    public String getProductoDescripcion() {
        return productoDescripcion;
    }

    public void setProductoDescripcion(String productoDescripcion) {
        this.productoDescripcion = productoDescripcion;
    }

    public String getProductoImagen() {
        return productoImagen;
    }

    public void setProductoImagen(String productoImagen) {
        this.productoImagen = productoImagen;
    }

    public Boolean getProductoActivo() {
        return productoActivo;
    }

    public void setProductoActivo(Boolean productoActivo) {
        this.productoActivo = productoActivo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ProductoBasicoResponse getProducto() {
        return producto;
    }

    public void setProducto(ProductoBasicoResponse producto) {
        this.producto = producto;
    }

    // Clase interna para información básica del producto
    public static class ProductoBasicoResponse {
        private Long id;
        private String nombre;
        private String descripcion;
        private String imagen;
        private String imagenThumbnail;
        private Boolean activo;
        private String categoriaNombre;

        public ProductoBasicoResponse() {}

        public ProductoBasicoResponse(Long id, String nombre, String descripcion, String imagenThumbnail,
                                    Boolean activo, String categoriaNombre) {
            this.id = id;
            this.nombre = nombre;
            this.descripcion = descripcion;
            this.imagenThumbnail = imagenThumbnail;
            this.activo = activo;
            this.categoriaNombre = categoriaNombre;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }

        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

        public String getImagen() { return imagen; }
        public void setImagen(String imagen) { this.imagen = imagen; }

        public String getImagenThumbnail() { return imagenThumbnail; }
        public void setImagenThumbnail(String imagenThumbnail) { this.imagenThumbnail = imagenThumbnail; }

        public Boolean getActivo() { return activo; }
        public void setActivo(Boolean activo) { this.activo = activo; }

        public String getCategoriaNombre() { return categoriaNombre; }
        public void setCategoriaNombre(String categoriaNombre) { this.categoriaNombre = categoriaNombre; }
    }
}
