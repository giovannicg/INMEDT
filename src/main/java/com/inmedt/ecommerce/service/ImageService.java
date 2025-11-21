package com.inmedt.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${app.upload.dir:uploads/productos}")
    private String uploadDir;

    @Value("${app.image.max-size:1920}")
    private int maxImageSize;

    @Value("${app.image.thumbnail-size:300}")
    private int thumbnailSize;

    @Value("${app.image.quality:0.85}")
    private float imageQuality;

    public String saveProductImage(MultipartFile file, boolean createThumbnail) throws IOException {
        // Validar que sea una imagen
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("El archivo debe ser una imagen");
        }

        // Crear directorio si no existe
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generar nombre único
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String filename = UUID.randomUUID().toString() + extension;

        // Leer la imagen original
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new IllegalArgumentException("No se pudo leer la imagen");
        }

        // Optimizar y guardar imagen principal
        BufferedImage optimizedImage = resizeImage(originalImage, maxImageSize);
        String fullPath = uploadDir + "/" + filename;
        saveCompressedImage(optimizedImage, fullPath, extension);

        // Crear thumbnail si se solicita
        if (createThumbnail) {
            BufferedImage thumbnail = resizeImage(originalImage, thumbnailSize);
            String thumbnailFilename = "thumb_" + filename;
            String thumbnailPath = uploadDir + "/" + thumbnailFilename;
            saveCompressedImage(thumbnail, thumbnailPath, extension);
        }

        return filename;
    }

    public String getThumbnailName(String originalFilename) {
        return "thumb_" + originalFilename;
    }

    public void deleteImage(String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            Files.deleteIfExists(filePath);
            
            // Intentar eliminar thumbnail también
            Path thumbnailPath = Paths.get(uploadDir, getThumbnailName(filename));
            Files.deleteIfExists(thumbnailPath);
        } catch (IOException e) {
            System.err.println("Error al eliminar imagen: " + e.getMessage());
        }
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int maxSize) {
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        // Si la imagen ya es más pequeña, no redimensionar
        if (originalWidth <= maxSize && originalHeight <= maxSize) {
            return originalImage;
        }

        // Calcular nuevas dimensiones manteniendo la proporción
        int newWidth, newHeight;
        if (originalWidth > originalHeight) {
            newWidth = maxSize;
            newHeight = (int) ((double) originalHeight * maxSize / originalWidth);
        } else {
            newHeight = maxSize;
            newWidth = (int) ((double) originalWidth * maxSize / originalHeight);
        }

        // Crear imagen redimensionada
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = resizedImage.createGraphics();
        
        // Mejorar calidad de redimensionamiento
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        g.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g.dispose();

        return resizedImage;
    }

    private void saveCompressedImage(BufferedImage image, String outputPath, String extension) throws IOException {
        File outputFile = new File(outputPath);
        
        // Determinar formato
        String formatName = extension.toLowerCase().replace(".", "");
        if (formatName.equals("jpg")) {
            formatName = "jpeg";
        }

        // Para JPEG, aplicar compresión
        if (formatName.equals("jpeg")) {
            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
            if (!writers.hasNext()) {
                throw new IllegalStateException("No hay escritores JPEG disponibles");
            }

            ImageWriter writer = writers.next();
            ImageWriteParam param = writer.getDefaultWriteParam();
            
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(imageQuality);
            }

            try (FileOutputStream fos = new FileOutputStream(outputFile);
                 ImageOutputStream ios = ImageIO.createImageOutputStream(fos)) {
                
                writer.setOutput(ios);
                writer.write(null, new IIOImage(image, null, null), param);
                writer.dispose();
            }
        } else {
            // Para otros formatos, usar ImageIO estándar
            ImageIO.write(image, formatName, outputFile);
        }
    }

    public Path getImagePath(String filename) {
        return Paths.get(uploadDir, filename);
    }

    public boolean imageExists(String filename) {
        if (filename == null) return false;
        Path path = getImagePath(filename);
        return Files.exists(path);
    }
}

