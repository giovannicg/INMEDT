package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.*;
import com.inmedt.ecommerce.model.*;
import com.inmedt.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @Autowired
    private VarianteProductoRepository varianteProductoRepository;
    
    @Autowired
    private UnidadDeVentaRepository unidadDeVentaRepository;
    
    // Gestión de Productos
    public Page<ProductoResponse> getAllProductos(Pageable pageable) {
        Page<Producto> productos = productoRepository.findAll(pageable);
        return productos.map(this::convertToProductoResponse);
    }
    
    public ProductoResponse getProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return convertToProductoResponse(producto);
    }
    
    public ProductoResponse createProducto(ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setMarca(request.getMarca());
        producto.setCategoria(categoria);
        producto.setActivo(request.getActivo());
        
        Producto savedProducto = productoRepository.save(producto);
        return convertToProductoResponse(savedProducto);
    }
    
    public ProductoResponse updateProducto(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setMarca(request.getMarca());
        producto.setCategoria(categoria);
        producto.setActivo(request.getActivo());
        
        Producto savedProducto = productoRepository.save(producto);
        return convertToProductoResponse(savedProducto);
    }
    
    public void deleteProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        productoRepository.delete(producto);
    }
    
    // Gestión de Categorías
    public List<CategoriaResponse> getAllCategorias() {
        List<Categoria> categorias = categoriaRepository.findAll();
        return categorias.stream()
                .map(this::convertToCategoriaResponse)
                .collect(Collectors.toList());
    }
    
    public CategoriaResponse createCategoria(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setActiva(request.getActiva());
        
        Categoria savedCategoria = categoriaRepository.save(categoria);
        return convertToCategoriaResponse(savedCategoria);
    }
    
    public CategoriaResponse updateCategoria(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setActiva(request.getActiva());
        
        Categoria savedCategoria = categoriaRepository.save(categoria);
        return convertToCategoriaResponse(savedCategoria);
    }
    
    public void deleteCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        categoriaRepository.delete(categoria);
    }
    
    // Gestión de Variantes
    public List<ProductoResponse.VarianteResponse> getVariantesByProducto(Long productoId) {
        List<VarianteProducto> variantes = varianteProductoRepository.findByProductoId(productoId);
        return variantes.stream()
                .map(this::convertToVarianteResponse)
                .collect(Collectors.toList());
    }
    
    public ProductoResponse.VarianteResponse createVariante(VarianteRequest request) {
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        VarianteProducto variante = new VarianteProducto();
        variante.setNombre(request.getNombre());
        variante.setDescripcion(request.getDescripcion());
        variante.setProducto(producto);
        variante.setActiva(request.getActiva());
        
        VarianteProducto savedVariante = varianteProductoRepository.save(variante);
        return convertToVarianteResponse(savedVariante);
    }
    
    public ProductoResponse.VarianteResponse updateVariante(Long id, VarianteUpdateRequest request) {
        VarianteProducto variante = varianteProductoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
        
        variante.setNombre(request.getNombre());
        variante.setDescripcion(request.getDescripcion());
        variante.setActiva(request.getActiva());
        
        VarianteProducto savedVariante = varianteProductoRepository.save(variante);
        return convertToVarianteResponse(savedVariante);
    }
    
    public void deleteVariante(Long id) {
        VarianteProducto variante = varianteProductoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
        varianteProductoRepository.delete(variante);
    }
    
    // Gestión de Unidades de Venta
    public List<ProductoResponse.UnidadVentaResponse> getUnidadesByVariante(Long varianteId) {
        List<UnidadDeVenta> unidades = unidadDeVentaRepository.findByVarianteId(varianteId);
        return unidades.stream()
                .map(this::convertToUnidadVentaResponse)
                .collect(Collectors.toList());
    }
    
    public ProductoResponse.UnidadVentaResponse createUnidadVenta(UnidadVentaRequest request) {
        VarianteProducto variante = varianteProductoRepository.findById(request.getVarianteId())
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
        
        UnidadDeVenta unidad = new UnidadDeVenta();
        unidad.setSku(request.getSku());
        unidad.setDescripcion(request.getDescripcion());
        unidad.setPrecio(request.getPrecio());
        unidad.setStock(request.getStock());
        unidad.setVariante(variante);
        unidad.setActiva(request.getActiva());
        
        UnidadDeVenta savedUnidad = unidadDeVentaRepository.save(unidad);
        return convertToUnidadVentaResponse(savedUnidad);
    }
    
    public ProductoResponse.UnidadVentaResponse updateUnidadVenta(Long id, UnidadVentaUpdateRequest request) {
        UnidadDeVenta unidad = unidadDeVentaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unidad de venta no encontrada"));
        
        // Verificar que el SKU no esté en uso por otra unidad
        if (!unidad.getSku().equals(request.getSku()) && unidadDeVentaRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("SKU ya existe");
        }
        
        unidad.setSku(request.getSku());
        unidad.setDescripcion(request.getDescripcion());
        unidad.setPrecio(request.getPrecio());
        unidad.setStock(request.getStock());
        unidad.setActiva(request.getActiva());
        
        UnidadDeVenta savedUnidad = unidadDeVentaRepository.save(unidad);
        return convertToUnidadVentaResponse(savedUnidad);
    }
    
    public void deleteUnidadVenta(Long id) {
        UnidadDeVenta unidad = unidadDeVentaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unidad de venta no encontrada"));
        unidadDeVentaRepository.delete(unidad);
    }
    
    // Métodos de conversión
    private ProductoResponse convertToProductoResponse(Producto producto) {
        ProductoResponse response = new ProductoResponse(
            producto.getId(),
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getMarca(),
            producto.getCategoria().getNombre()
        );
        response.setActivo(producto.getActivo());
        List<ProductoResponse.VarianteResponse> variantes = producto.getVariantes() != null 
                ? producto.getVariantes().stream()
                    .map(this::convertToVarianteResponse)
                    .collect(Collectors.toList())
                : new ArrayList<>();
        
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
    
    private ProductoResponse.VarianteResponse convertToVarianteResponse(VarianteProducto variante) {
        ProductoResponse.VarianteResponse response = new ProductoResponse.VarianteResponse(
            variante.getId(),
            variante.getNombre(),
            variante.getDescripcion(),
            variante.getActiva()
        );
        
        List<ProductoResponse.UnidadVentaResponse> unidadesVenta = variante.getUnidadesVenta() != null
                ? variante.getUnidadesVenta().stream()
                    .map(this::convertToUnidadVentaResponse)
                    .collect(Collectors.toList())
                : new ArrayList<>();
        
        response.setUnidadesVenta(unidadesVenta);
        return response;
    }
    
    private ProductoResponse.UnidadVentaResponse convertToUnidadVentaResponse(UnidadDeVenta unidad) {
        return new ProductoResponse.UnidadVentaResponse(
            unidad.getId(),
            unidad.getSku(),
            unidad.getDescripcion(),
            unidad.getPrecio(),
            unidad.getStock(),
            unidad.getActiva()
        );
    }
}
