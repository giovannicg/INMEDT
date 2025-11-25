package com.inmedt.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    @Value("${cloudinary.enabled:true}")
    private boolean cloudinaryEnabled;

    /**
     * Sube una imagen a Cloudinary
     * @param file Archivo a subir
     * @param folder Carpeta en Cloudinary (ej: "productos")
     * @return URL de la imagen subida
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (!cloudinaryEnabled || cloudinary == null) {
            throw new RuntimeException("Cloudinary no está configurado. Por favor, configura las credenciales de Cloudinary.");
        }

        try {
            // Crear transformación básica para optimización
            Transformation transformation = new Transformation()
                .quality("auto:good")
                .fetchFormat("auto");

            // Opciones de subida
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "auto",
                "transformation", transformation
            );

            // Subir imagen
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            
            // Retornar URL segura
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new IOException("Error al subir imagen a Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Sube una imagen con transformaciones
     * @param file Archivo a subir
     * @param folder Carpeta en Cloudinary
     * @param width Ancho deseado
     * @param height Alto deseado
     * @return URL de la imagen subida
     */
    public String uploadImageWithTransformation(MultipartFile file, String folder, int width, int height) throws IOException {
        if (!cloudinaryEnabled || cloudinary == null) {
            throw new RuntimeException("Cloudinary no está configurado. Por favor, configura las credenciales de Cloudinary.");
        }

        try {
            // Crear transformación usando el objeto Transformation de Cloudinary
            Transformation transformation = new Transformation()
                .width(width)
                .height(height)
                .crop("limit")
                .quality("auto:good")
                .fetchFormat("auto");

            @SuppressWarnings("unchecked")
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "auto",
                "transformation", transformation
            );

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new IOException("Error al subir imagen a Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Genera una URL de thumbnail desde una imagen ya subida
     * @param publicId ID público de la imagen en Cloudinary
     * @param width Ancho del thumbnail
     * @param height Alto del thumbnail
     * @return URL del thumbnail
     */
    public String getThumbnailUrl(String publicId, int width, int height) {
        return cloudinary.url()
            .format("jpg")
            .transformation(new com.cloudinary.Transformation()
                .width(width)
                .height(height)
                .crop("fill")
                .quality("auto:good")
                .fetchFormat("auto"))
            .generate(publicId);
    }

    /**
     * Elimina una imagen de Cloudinary
     * @param publicId ID público de la imagen
     */
    public void deleteImage(String publicId) throws IOException {
        if (!cloudinaryEnabled || cloudinary == null) {
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new IOException("Error al eliminar imagen de Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Extrae el public_id de una URL de Cloudinary
     * @param url URL de Cloudinary
     * @return Public ID
     */
    public String extractPublicId(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }

        // Ejemplo de URL: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/image.jpg
        // Public ID sería: folder/image
        
        try {
            String[] parts = url.split("/upload/");
            if (parts.length < 2) {
                return null;
            }
            
            String afterUpload = parts[1];
            // Remover versión (v123456/)
            String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
            // Remover extensión
            int lastDot = withoutVersion.lastIndexOf('.');
            if (lastDot > 0) {
                withoutVersion = withoutVersion.substring(0, lastDot);
            }
            
            return withoutVersion;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Verifica si Cloudinary está configurado y habilitado
     */
    public boolean isEnabled() {
        return cloudinaryEnabled && cloudinary != null;
    }
}

