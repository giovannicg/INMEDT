package com.inmedt.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CheckoutRequest {
    
    @NotBlank(message = "La dirección de envío es obligatoria")
    @Size(max = 200, message = "La dirección no puede exceder 200 caracteres")
    private String direccionEnvio;
    
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefonoContacto;
    
    @Size(max = 500, message = "Las notas no pueden exceder 500 caracteres")
    private String notas;
    
    // Constructores
    public CheckoutRequest() {}
    
    public CheckoutRequest(String direccionEnvio, String telefonoContacto, String notas) {
        this.direccionEnvio = direccionEnvio;
        this.telefonoContacto = telefonoContacto;
        this.notas = notas;
    }
    
    // Getters y Setters
    public String getDireccionEnvio() { return direccionEnvio; }
    public void setDireccionEnvio(String direccionEnvio) { this.direccionEnvio = direccionEnvio; }
    
    public String getTelefonoContacto() { return telefonoContacto; }
    public void setTelefonoContacto(String telefonoContacto) { this.telefonoContacto = telefonoContacto; }
    
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
}
