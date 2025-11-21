package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.FavoritoResponse;
import com.inmedt.ecommerce.model.Favorito;
import com.inmedt.ecommerce.model.Producto;
import com.inmedt.ecommerce.model.User;
import com.inmedt.ecommerce.repository.FavoritoRepository;
import com.inmedt.ecommerce.repository.ProductoRepository;
import com.inmedt.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<FavoritoResponse> getFavoritosByUser(Long userId) {
        List<Favorito> favoritos = favoritoRepository.findByUserId(userId);
        return favoritos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public FavoritoResponse addFavorito(Long userId, Long productoId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Verificar si ya existe
        if (favoritoRepository.existsByUserIdAndProductoId(userId, productoId)) {
            throw new RuntimeException("El producto ya está en favoritos");
        }

        // Verificar que el producto esté activo
        if (!producto.getActivo()) {
            throw new RuntimeException("No se puede agregar un producto inactivo a favoritos");
        }

        Favorito favorito = new Favorito(user, producto);
        Favorito savedFavorito = favoritoRepository.save(favorito);
        return convertToResponse(savedFavorito);
    }

    public void removeFavorito(Long userId, Long productoId) {
        if (!favoritoRepository.existsByUserIdAndProductoId(userId, productoId)) {
            throw new RuntimeException("El producto no está en favoritos");
        }

        favoritoRepository.deleteByUserIdAndProductoId(userId, productoId);
    }

    public boolean isFavorito(Long userId, Long productoId) {
        return favoritoRepository.existsByUserIdAndProductoId(userId, productoId);
    }

    public long getFavoritosCountByProducto(Long productoId) {
        return favoritoRepository.countByProductoId(productoId);
    }

    public FavoritoResponse toggleFavorito(Long userId, Long productoId) {
        if (favoritoRepository.existsByUserIdAndProductoId(userId, productoId)) {
            removeFavorito(userId, productoId);
            return null; // Indica que se removió
        } else {
            return addFavorito(userId, productoId);
        }
    }

    private FavoritoResponse convertToResponse(Favorito favorito) {
        Producto producto = favorito.getProducto();
        
        // Construir URL de imagen si existe
        String imagenUrl = producto.getImagenPrincipal() != null 
            ? "/uploads/productos/" + producto.getImagenPrincipal() 
            : null;
        String imagenThumbnailUrl = producto.getImagenThumbnail() != null 
            ? "/uploads/productos/" + producto.getImagenThumbnail() 
            : null;
        
        FavoritoResponse response = new FavoritoResponse(
                favorito.getId(),
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                imagenUrl,
                producto.getActivo(),
                favorito.getCreatedAt()
        );

        // Crear información básica del producto
        FavoritoResponse.ProductoBasicoResponse productoBasico = new FavoritoResponse.ProductoBasicoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                imagenThumbnailUrl,
                producto.getActivo(),
                producto.getCategoria().getNombre()
        );

        response.setProducto(productoBasico);
        return response;
    }
}
