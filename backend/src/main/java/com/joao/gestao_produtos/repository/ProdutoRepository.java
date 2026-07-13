package com.joao.gestao_produtos.repository;

import com.joao.gestao_produtos.model.Produto;
import com.joao.gestao_produtos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // Indica ao spring que essa interface é um componente de acesso ao banco de dados.
public interface ProdutoRepository extends JpaRepository<Produto, Long>{
    List<Produto> findByUsuario(Usuario usuario);
}
