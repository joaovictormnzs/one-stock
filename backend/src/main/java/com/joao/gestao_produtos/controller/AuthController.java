package com.joao.gestao_produtos.controller;

import com.joao.gestao_produtos.dto.AuthDTO;
import com.joao.gestao_produtos.dto.UsuarioDTO;
import com.joao.gestao_produtos.model.Usuario;
import com.joao.gestao_produtos.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private com.joao.gestao_produtos.repository.UsuarioRepository usuarioRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.Response> login(@RequestBody @Valid AuthDTO.Request dados) {
        // Cria o token de credenciais que o Spring Security exige
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(dados.getEmail(), dados.getSenha());

        // O Spring Security valida se o e-mail existe e se a senha bate
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        // Se deu certo, extrai o usuário e gera o Token JWT real
        String token = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        // Retorna a instância interna estática
        return ResponseEntity.ok(new AuthDTO.Response(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registro(@RequestBody @Valid UsuarioDTO.Create dados) {
        // 1. Verifica se o e-mail/login já está cadastrado no banco
        if (usuarioRepository.findByEmail(dados.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Este e-mail já está cadastrado.");
        }

        // 2. Instancia a sua entidade base Usuario
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dados.getNome());
        novoUsuario.setEmail(dados.getEmail()); // Ou setLogin se sua entidade usar login

        // 3. Criptografa a senha usando o BCrypt do Spring Security
        String senhaCriptografada = passwordEncoder.encode(dados.getSenha());
        novoUsuario.setSenha(senhaCriptografada);

        // 4. Grava no banco de dados
        usuarioRepository.save(novoUsuario);

        // Retorna status 200 OK informando que deu certo
        return ResponseEntity.ok().build();
    }
}
