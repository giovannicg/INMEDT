# Dockerfile para el backend Spring Boot
FROM maven:3.8.5-openjdk-17

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .

# Descargar dependencias (para cache de Docker)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src src

# Copiar archivo de catálogo
COPY catalogo.json .

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Exponer puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "target/ecommerce-medical-0.0.1-SNAPSHOT.jar"]
