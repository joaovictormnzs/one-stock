package com.joao.gestao_produtos.security;

import com.joao.gestao_produtos.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class TokenService {

    // Gerando uma chave secreta segura para assinar o token
    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);


    private final long expirationTime = 7200000;

    // Metodo para gerar o token
    public String gerarToken(Usuario usuario) {
        Date hoje = new Date();
        Date dataExpiracao = new Date(hoje.getTime() + expirationTime);
        return Jwts.builder()
                .setIssuer("API Gestao de Produtos")
                .setSubject(usuario.getEmail())
                .claim("nome", usuario.getNome())
                .setIssuedAt(hoje)
                .setExpiration(dataExpiracao)
                .signWith(secretKey)
                .compact();
    }

    // Metodo para validar o Token
    public boolean isTokenValido(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Metodo para pegar o email do usuario dentro do token
    public String getEmailUsuario(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
}