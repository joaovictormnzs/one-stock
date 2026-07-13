package com.joao.gestao_produtos.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

public class AuthDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Insira um e-mail válido")
        private String email;

        @NotBlank(message = "A senha é obrigatória")
        private String senha;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String token;
    }
}
