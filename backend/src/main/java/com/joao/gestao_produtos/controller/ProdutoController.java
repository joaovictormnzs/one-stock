package com.joao.gestao_produtos.controller;

import com.joao.gestao_produtos.dto.ProdutoDTO;
import com.joao.gestao_produtos.model.Produto;
import com.joao.gestao_produtos.model.Usuario;
import com.joao.gestao_produtos.repository.ProdutoRepository;
import com.joao.gestao_produtos.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Define que esta classe é um controlador do tipo REST (retorna JSON).
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:5173")// Define a url base para acessar as rotas.
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Rota 1: Criar um produto.
    @PostMapping
    public ResponseEntity<ProdutoDTO.Response> criar(@Valid @RequestBody ProdutoDTO.Create dto, Authentication authentication) {

        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());

        produto.setUsuario(usuarioLogado);

        Produto salvo = produtoRepository.save(produto);

        return ResponseEntity.status(HttpStatus.CREATED).body(converterParaDTO(salvo));
    }

    // Rota 2: Listar todos os produtos.
    @GetMapping
    public ResponseEntity<List<ProdutoDTO.Response>> listarTodos(Authentication authentication) {
        // Busca todos os produtos do banco
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        List<Produto> produtos = produtoRepository.findByUsuario(usuarioLogado);

        List<ProdutoDTO.Response> dtos = produtos.stream()
                .map(this::converterParaDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    // Rota 3: Listar produtos por id
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO.Response> buscarPorId(@PathVariable Long id, Authentication authentication) {

        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        //Busca o produto pelo ID no banco
        return produtoRepository.findById(id)
                .map(produto -> {
                    if (!produto.getUsuario().getId().equals(usuarioLogado.getId())) {
                        // Se o produto for de outro usuário, barra o acesso com 403 Forbidden
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<ProdutoDTO.Response>build();
                    }
                    // Se for dele, retorna o produto convertido em DTO com 200 OK
                    return ResponseEntity.ok(converterParaDTO(produto));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    //Rota 4: Atualizar produto.
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoDTO.Update dto,  Authentication authentication) {

        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        return produtoRepository.findById(id)
                .map(produtoExistente -> {
                    // o produto pertence ao utilizador informado?
                    if (!produtoExistente.getUsuario().getId().equals(usuarioLogado.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Retorna 403 Proibido
                    }

                    // Atualiza os campos usando os dados que vieram do DTO
                    produtoExistente.setNome(dto.getNome());
                    produtoExistente.setDescricao(dto.getDescricao());
                    produtoExistente.setPreco(dto.getPreco());
                    produtoExistente.setQuantidadeEstoque(dto.getQuantidadeEstoque());

                    // Salva as alterações
                    Produto atualizado = produtoRepository.save(produtoExistente);
                    return ResponseEntity.ok(converterParaDTO(atualizado));// Retorna 200 OK
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build()); // Retorna 404 Not Found
    }

    // Rota 5: Deletar produto.
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication authentication) {

        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        return produtoRepository.findById(id)
                .map(produto -> {
                    // o produto pertence ao utilizador informado?
                    if (!produto.getUsuario().getId().equals(usuarioLogado.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Retorna 403 Proibido
                    }

                    produtoRepository.delete(produto);
                    return ResponseEntity.noContent().build(); // Retorna 204 No Content
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build()); // Retorna 404 Not Found
    }

    // Metodo auxiliar.
    private ProdutoDTO.Response converterParaDTO(Produto produto) {
        ProdutoDTO.Response dto = new ProdutoDTO.Response();
        dto.setId(produto.getId());
        dto.setNome(produto.getNome());
        dto.setDescricao(produto.getDescricao());
        dto.setPreco(produto.getPreco());
        dto.setQuantidadeEstoque(produto.getQuantidadeEstoque());

        if (produto.getUsuario() != null) {
            dto.setUsuarioId(produto.getUsuario().getId());
            dto.setUsuarioNome(produto.getUsuario().getNome());
        }
        return dto;
    }
}
