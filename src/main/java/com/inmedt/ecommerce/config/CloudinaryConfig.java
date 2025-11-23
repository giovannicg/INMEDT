package com.inmedt.ecommerce.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.url:}")
    private String cloudinaryUrl;

    @Bean
    public Cloudinary cloudinary() {
        if (cloudinaryUrl == null || cloudinaryUrl.isEmpty()) {
            System.out.println("⚠️  Cloudinary no configurado. Las imágenes se guardarán localmente.");
            return null;
        }
        
        try {
            Cloudinary cloudinary = new Cloudinary(cloudinaryUrl);
            cloudinary.config.secure = true;
            System.out.println("✅ Cloudinary configurado correctamente");
            return cloudinary;
        } catch (Exception e) {
            System.err.println("❌ Error al configurar Cloudinary: " + e.getMessage());
            return null;
        }
    }
}

