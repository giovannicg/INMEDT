package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.CategoriaRequest;
import com.inmedt.ecommerce.dto.CategoriaResponse;
import com.inmedt.ecommerce.model.Categoria;
import com.inmedt.ecommerce.repository.CategoriaRepository;
import com.inmedt.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminCategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public Page<CategoriaResponse> getAllCategorias(Pageable pageable) {
        Page<Categoria> categorias = categoriaRepository.findAll(pageable);
        return categorias.map(this::convertToResponse);
    }

    public CategoriaResponse getCategoriaById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        return convertToResponse(categoria);
    }

    public CategoriaResponse createCategoria(CategoriaRequest request) {
        // Verificar si ya existe una categoría con el mismo nombre
        if (categoriaRepository.existsByNombre(request.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setActiva(request.getActiva() != null ? request.getActiva() : true);

        categoria = categoriaRepository.save(categoria);
        return convertToResponse(categoria);
    }

    public CategoriaResponse updateCategoria(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        // Verificar si el nuevo nombre ya existe en otra categoría
        if (!categoria.getNombre().equals(request.getNombre()) && 
            categoriaRepository.existsByNombre(request.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        if (request.getActiva() != null) {
            categoria.setActiva(request.getActiva());
        }

        categoria = categoriaRepository.save(categoria);
        return convertToResponse(categoria);
    }

    public CategoriaResponse toggleCategoriaStatus(Long id, boolean activa) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        categoria.setActiva(activa);
        categoria = categoriaRepository.save(categoria);
        return convertToResponse(categoria);
    }

    public void deleteCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        // Verificar si tiene productos asociados
        long productosCount = productoRepository.countByCategoriaId(id);
        if (productosCount > 0) {
            throw new RuntimeException("No se puede eliminar la categoría porque tiene productos asociados");
        }

        categoriaRepository.delete(categoria);
    }

    public Long getTotalCategorias() {
        return categoriaRepository.count();
    }

    private CategoriaResponse convertToResponse(Categoria categoria) {
        CategoriaResponse response = new CategoriaResponse();
        response.setId(categoria.getId());
        response.setNombre(categoria.getNombre());
        response.setDescripcion(categoria.getDescripcion());
        response.setActiva(categoria.getActiva());
        
        // Contar productos asociados
        long productosCount = productoRepository.countByCategoriaId(categoria.getId());
        response.setProductosCount((int) productosCount);
        
        return response;
    }
}
