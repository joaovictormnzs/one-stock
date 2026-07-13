package com.joao.gestao_produtos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity // Informa ao spring que essa classe representa uma tabela no banco de dados.
@Table(name= "tb_produto") // Define o nome da tabela no PostgreSQL
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do produto é obrigatório")
    @Column(nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "A descricao do produto é obrigatória")
    @Column(columnDefinition = "TEXT")
    private String descricao;

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser maior que zero")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @NotNull(message = "A quantidade em estoque é obrigatória")
    @Min(value = 0, message = "A quantidade em estoque não pode ser negativa")
    @Column(nullable = false)
    private Integer quantidadeEstoque;

    //adicionar imagem para cada produto futuramente

    @ManyToOne // Muitos para um
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}
