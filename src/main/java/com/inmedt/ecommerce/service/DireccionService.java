package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.DireccionRequest;
import com.inmedt.ecommerce.dto.DireccionResponse;
import com.inmedt.ecommerce.model.Direccion;
import com.inmedt.ecommerce.model.User;
import com.inmedt.ecommerce.repository.DireccionRepository;
import com.inmedt.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DireccionResponse> getDireccionesByUser(Long userId) {
        List<Direccion> direcciones = direccionRepository.findByUserIdAndActivaTrue(userId);
        return direcciones.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public DireccionResponse createDireccion(Long userId, DireccionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si ya existe una dirección con el mismo nombre
        if (direccionRepository.existsByUserIdAndNombre(userId, request.getNombre())) {
            throw new RuntimeException("Ya existe una dirección con ese nombre");
        }

        // Si es la primera dirección o se marca como principal, limpiar otras principales
        if (request.getEsPrincipal() || !direccionRepository.findByUserIdAndActivaTrue(userId).isEmpty() == false) {
            if (request.getEsPrincipal()) {
                direccionRepository.clearPrincipalByUserId(userId);
            }
        }

        Direccion direccion = new Direccion();
        direccion.setUser(user);
        direccion.setNombre(request.getNombre());
        direccion.setDireccion(request.getDireccion());
        direccion.setCiudad(request.getCiudad());
        direccion.setSector(request.getSector());
        direccion.setTelefono(request.getTelefono());
        direccion.setReferencias(request.getReferencias());
        direccion.setEsPrincipal(request.getEsPrincipal());

        // Si es la primera dirección, hacerla principal automáticamente
        List<Direccion> direccionesExistentes = direccionRepository.findByUserIdAndActivaTrue(userId);
        if (direccionesExistentes.isEmpty()) {
            direccion.setEsPrincipal(true);
        }

        Direccion savedDireccion = direccionRepository.save(direccion);
        return convertToResponse(savedDireccion);
    }

    public DireccionResponse updateDireccion(Long userId, Long direccionId, DireccionRequest request) {
        Direccion direccion = direccionRepository.findById(direccionId)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));

        // Verificar que la dirección pertenece al usuario
        if (!direccion.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permisos para editar esta dirección");
        }

        // Verificar si el nuevo nombre ya existe (excluyendo la dirección actual)
        if (!direccion.getNombre().equals(request.getNombre()) &&
            direccionRepository.existsByUserIdAndNombre(userId, request.getNombre())) {
            throw new RuntimeException("Ya existe una dirección con ese nombre");
        }

        // Si se marca como principal, limpiar otras principales
        if (request.getEsPrincipal() && !direccion.getEsPrincipal()) {
            direccionRepository.clearPrincipalByUserId(userId);
        }

        direccion.setNombre(request.getNombre());
        direccion.setDireccion(request.getDireccion());
        direccion.setCiudad(request.getCiudad());
        direccion.setSector(request.getSector());
        direccion.setTelefono(request.getTelefono());
        direccion.setReferencias(request.getReferencias());
        direccion.setEsPrincipal(request.getEsPrincipal());
        direccion.setUpdatedAt(LocalDateTime.now());

        Direccion savedDireccion = direccionRepository.save(direccion);
        return convertToResponse(savedDireccion);
    }

    public void deleteDireccion(Long userId, Long direccionId) {
        Direccion direccion = direccionRepository.findById(direccionId)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));

        // Verificar que la dirección pertenece al usuario
        if (!direccion.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permisos para eliminar esta dirección");
        }

        // Marcar como inactiva en lugar de eliminar
        direccion.setActiva(false);
        direccion.setUpdatedAt(LocalDateTime.now());
        direccionRepository.save(direccion);
    }

    public DireccionResponse setPrincipal(Long userId, Long direccionId) {
        Direccion direccion = direccionRepository.findById(direccionId)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));

        // Verificar que la dirección pertenece al usuario
        if (!direccion.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permisos para modificar esta dirección");
        }

        // Limpiar otras direcciones principales
        direccionRepository.clearPrincipalByUserId(userId);

        // Establecer como principal
        direccion.setEsPrincipal(true);
        direccion.setUpdatedAt(LocalDateTime.now());

        Direccion savedDireccion = direccionRepository.save(direccion);
        return convertToResponse(savedDireccion);
    }

    public DireccionResponse getDireccionPrincipal(Long userId) {
        return direccionRepository.findByUserIdAndEsPrincipalTrue(userId)
                .map(this::convertToResponse)
                .orElse(null);
    }

    private DireccionResponse convertToResponse(Direccion direccion) {
        return new DireccionResponse(
                direccion.getId(),
                direccion.getNombre(),
                direccion.getDireccion(),
                direccion.getCiudad(),
                direccion.getSector(),
                direccion.getTelefono(),
                direccion.getReferencias(),
                direccion.getEsPrincipal(),
                direccion.getActiva(),
                direccion.getCreatedAt(),
                direccion.getUpdatedAt()
        );
    }
}
