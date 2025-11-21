package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.CategoriaResponse;
import com.inmedt.ecommerce.dto.ProductoResponse;
import com.inmedt.ecommerce.model.Categoria;
import com.inmedt.ecommerce.model.Producto;
import com.inmedt.ecommerce.model.UnidadDeVenta;
import com.inmedt.ecommerce.model.VarianteProducto;
import com.inmedt.ecommerce.repository.CategoriaRepository;
import com.inmedt.ecommerce.repository.ProductoRepository;
import com.inmedt.ecommerce.repository.UnidadDeVentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @Autowired
    private UnidadDeVentaRepository unidadDeVentaRepository;
    
    public Page<ProductoResponse> getAllProductos(Pageable pageable) {
        Page<Producto> productos = productoRepository.findByActivoTrue(pageable);
        return productos.map(this::convertToProductoResponse);
    }
    
    public Page<ProductoResponse> getProductosByCategoria(Long categoriaId, Pageable pageable) {
        Page<Producto> productos = productoRepository.findByActivoTrueAndCategoriaId(categoriaId, pageable);
        return productos.map(this::convertToProductoResponse);
    }
    
    public Page<ProductoResponse> getProductosByMarca(String marca, Pageable pageable) {
        Page<Producto> productos = productoRepository.findByActivoTrueAndMarcaContainingIgnoreCase(marca, pageable);
        return productos.map(this::convertToProductoResponse);
    }
    
    public Page<ProductoResponse> searchProductos(String search, Pageable pageable) {
        Page<Producto> productos = productoRepository.findByActivoTrueAndSearchTerm(search, pageable);
        return productos.map(this::convertToProductoResponse);
    }
    
    public ProductoResponse getProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (!producto.getActivo()) {
            throw new RuntimeException("Producto no disponible");
        }
        
        return convertToProductoResponse(producto);
    }
    
    public List<CategoriaResponse> getAllCategorias() {
        List<Categoria> categorias = categoriaRepository.findByActivaTrueOrderByNombreAsc();
        return categorias.stream()
                .map(this::convertToCategoriaResponse)
                .collect(Collectors.toList());
    }
    
    public CategoriaResponse getCategoriaById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        if (!categoria.getActiva()) {
            throw new RuntimeException("Categoría no disponible");
        }
        
        return convertToCategoriaResponse(categoria);
    }
    
    private ProductoResponse convertToProductoResponse(Producto producto) {
        ProductoResponse response = new ProductoResponse(
            producto.getId(),
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getMarca(),
            producto.getCategoria().getNombre()
        );
        
        // Agregar imágenes
        if (producto.getImagenPrincipal() != null) {
            response.setImagenPrincipal("/uploads/productos/" + producto.getImagenPrincipal());
        }
        if (producto.getImagenThumbnail() != null) {
            response.setImagenThumbnail("/uploads/productos/" + producto.getImagenThumbnail());
        }
        if (producto.getImagenesGaleria() != null && !producto.getImagenesGaleria().isEmpty()) {
            List<String> galeriaUrls = producto.getImagenesGaleria().stream()
                .map(img -> "/uploads/productos/" + img)
                .collect(Collectors.toList());
            response.setImagenesGaleria(galeriaUrls);
        }
        
        // Convertir variantes
        List<ProductoResponse.VarianteResponse> variantes = producto.getVariantes().stream()
                .filter(VarianteProducto::getActiva)
                .map(variante -> {
                    ProductoResponse.VarianteResponse varianteResponse = new ProductoResponse.VarianteResponse(
                        variante.getId(),
                        variante.getNombre(),
                        variante.getDescripcion()
                    );
                    
                    // Convertir unidades de venta disponibles
                    List<ProductoResponse.UnidadVentaResponse> unidadesVenta = variante.getUnidadesVenta().stream()
                            .filter(UnidadDeVenta::getActiva)
                            .filter(unidad -> unidad.getStock() > 0)
                            .map(unidad -> new ProductoResponse.UnidadVentaResponse(
                                unidad.getId(),
                                unidad.getSku(),
                                unidad.getDescripcion(),
                                unidad.getPrecio(),
                                unidad.getStock()
                            ))
                            .collect(Collectors.toList());
                    
                    varianteResponse.setUnidadesVenta(unidadesVenta);
                    return varianteResponse;
                })
                .filter(variante -> !variante.getUnidadesVenta().isEmpty()) // Solo variantes con unidades disponibles
                .collect(Collectors.toList());
        
        response.setVariantes(variantes);
        return response;
    }
    
    private CategoriaResponse convertToCategoriaResponse(Categoria categoria) {
        return new CategoriaResponse(
            categoria.getId(),
            categoria.getNombre(),
            categoria.getDescripcion(),
            categoria.getProductos() != null ? categoria.getProductos().size() : 0
        );
    }
}
