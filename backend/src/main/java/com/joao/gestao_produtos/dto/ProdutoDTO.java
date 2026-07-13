package com.joao.gestao_produtos.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class ProdutoDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {

        @NotBlank(message = "O nome do produto é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        private String nome;

        @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres")
        private String descricao;

        @NotNull(message = "O preço é obrigatório")
        @Positive(message = "O preço deve ser maior que zero")
        private BigDecimal preco;

        @NotNull(message = "A quantidade em estoque é obrigatória")
        private Integer quantidadeEstoque;

    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Update {

        @NotBlank(message = "O nome do produto é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        private String nome;

        @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres")
        private String descricao;

        @NotNull(message = "O preço é obrigatório")
        @Positive(message = "O preço deve ser maior que zero")
        private BigDecimal preco;

        @NotNull(message = "A quantidade em estoque é obrigatória")
        private Integer quantidadeEstoque;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonPropertyOrder({ "id", "nome", "descricao", "preco", "quantidadeEstoque", "usuarioId", "usuarioNome"})
    public static class Response {
        private Long id;
        private String nome;
        private String descricao;
        private BigDecimal preco;
        private Integer quantidadeEstoque;
        private Long usuarioId;
        private String usuarioNome;
    }

}
