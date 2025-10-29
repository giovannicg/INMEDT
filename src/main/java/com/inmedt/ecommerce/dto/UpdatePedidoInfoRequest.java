package com.inmedt.ecommerce.dto;

import jakarta.validation.constraints.Size;

public class UpdatePedidoInfoRequest {

    @Size(max = 500, message = "La dirección no puede exceder 500 caracteres")
    private String direccionEnvio;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefonoContacto;

    @Size(max = 1000, message = "Las notas no pueden exceder 1000 caracteres")
    private String notas;

    @Size(max = 100, message = "La ciudad no puede exceder 100 caracteres")
    private String ciudad;

    @Size(max = 100, message = "El sector no puede exceder 100 caracteres")
    private String sector;

    // Constructors
    public UpdatePedidoInfoRequest() {}

    public UpdatePedidoInfoRequest(String direccionEnvio, String telefonoContacto, String notas, String ciudad, String sector) {
        this.direccionEnvio = direccionEnvio;
        this.telefonoContacto = telefonoContacto;
        this.notas = notas;
        this.ciudad = ciudad;
        this.sector = sector;
    }

    // Getters and Setters
    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    public String getTelefonoContacto() {
        return telefonoContacto;
    }

    public void setTelefonoContacto(String telefonoContacto) {
        this.telefonoContacto = telefonoContacto;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }
}
