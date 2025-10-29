package com.inmedt.ecommerce.config;

import com.inmedt.ecommerce.service.CatalogoImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private CatalogoImportService catalogoImportService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n🚀 ========================================");
        System.out.println("📦 INICIANDO IMPORTACIÓN DE CATÁLOGO");
        System.out.println("========================================\n");

        try {
            Map<String, Object> resultado = catalogoImportService.importarCatalogo("catalogo.json");

            if ((Boolean) resultado.get("success")) {
                System.out.println("\n✅ ========================================");
                System.out.println("✅ IMPORTACIÓN COMPLETADA");
                System.out.println("========================================");
                System.out.println("📊 Categorías creadas: " + resultado.get("categoriasCreadas"));
                System.out.println("📦 Productos creados: " + resultado.get("productosCreados"));
                System.out.println("🔧 Variantes creadas: " + resultado.get("variantesCreadas"));
                System.out.println("💰 Unidades creadas: " + resultado.get("unidadesCreadas"));
                if (resultado.containsKey("errores")) {
                    System.out.println("⚠️  Errores encontrados: " + resultado.get("errores"));
                }
                System.out.println("========================================\n");
            } else {
                System.err.println("\n❌ ========================================");
                System.err.println("❌ ERROR EN LA IMPORTACIÓN");
                System.err.println("========================================");
                System.err.println("Error: " + resultado.get("error"));
                System.err.println("========================================\n");
            }

        } catch (Exception e) {
            System.err.println("\n❌ ========================================");
            System.err.println("❌ ERROR CRÍTICO EN LA IMPORTACIÓN");
            System.err.println("========================================");
            System.err.println("Error: " + e.getMessage());
            System.err.println("Causa: Verifica que el archivo catalogo.json esté en la raíz del proyecto");
            System.err.println("========================================\n");
            e.printStackTrace();
        }
    }
}

