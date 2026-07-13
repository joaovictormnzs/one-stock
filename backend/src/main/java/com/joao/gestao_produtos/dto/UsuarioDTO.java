package com.joao.gestao_produtos.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UsuarioDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create {

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        private String nome;

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Insira um email válido")
        private String email;

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        private String senha;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Update {

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        private String nome;

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Insira um email válido")
        private String email;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonPropertyOrder({ "id", "nome", "email" })
    public static class Response {
        private Long id;
        private String nome;
        private String email;
    }

}
