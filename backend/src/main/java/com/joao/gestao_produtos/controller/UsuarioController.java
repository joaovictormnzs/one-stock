package com.joao.gestao_produtos.controller;

import com.joao.gestao_produtos.dto.UsuarioDTO;
import com.joao.gestao_produtos.model.Usuario;
import com.joao.gestao_produtos.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //Rota 1: Criar Usuario
    @PostMapping
    public ResponseEntity<UsuarioDTO.Response> criar(@Valid @RequestBody UsuarioDTO.Create dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());

        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));

        Usuario salvo = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(converterParaDTO(salvo));
    }

    // Rota 2: Lista de usuarios
    @GetMapping
    public ResponseEntity<List<UsuarioDTO.Response>> listarTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioDTO.Response> dtos = usuarios.stream()
                .map(this::converterParaDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // Rota 3: Buscar usuario por id.
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO.Response> buscarPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> ResponseEntity.ok(converterParaDTO(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Rota 4: Atualizar dados cadastrais.
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO.Response> atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioDTO.Update dto) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    usuarioExistente.setNome(dto.getNome());
                    usuarioExistente.setEmail(dto.getEmail());


                    Usuario salvo = usuarioRepository.save(usuarioExistente);
                    return ResponseEntity.ok(converterParaDTO(salvo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    //Rota 5: Deletar Usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuarioRepository.delete(usuario);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Metodo auxiliar.
    private UsuarioDTO.Response converterParaDTO(Usuario usuario) {
        UsuarioDTO.Response dto = new UsuarioDTO.Response();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        return dto;
    }

}