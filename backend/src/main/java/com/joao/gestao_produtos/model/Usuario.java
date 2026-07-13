package com.joao.gestao_produtos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "tb_usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento
    private Long id;

    @NotBlank(message = "O nome do é obrigatório")
    @Column(nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Insira um email válido")
    @Column(nullable = false, unique = true, length = 100) // unique=true impede e-mails repetidos no banco
    private String email;

    @Column(nullable = false)
    private String senha;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Define que qualquer usuário cadastrado possui a regra padrão de acesso
        return List.of(new SimpleGrantedAuthority("USUARIO_PADRAO"));
    }

    @Override
    public String getPassword() {
        return this.senha; // Indica ao Spring que o campo de senha é o 'senha'
    }

    @Override
    public String getUsername() {
        return this.email; // Indica ao Spring que o campo de login (identificador) é o 'email'
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Conta não expirada
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Conta não bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credenciais de senha válidas e não expiradas
    }

    @Override
    public boolean isEnabled() {
        return true; // Usuário ativo
    }
}

