import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";

export default function Produtos() {
    const navigate = useNavigate();

    // Estados do Formulário
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
    const [idConfigEdicao, setIdConfigEdicao] = useState(null);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
    const [busca, setBusca] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('Usuário');

    // Estados de feedback e listagem
    const [listaProdutos, setListaProdutos] = useState([]);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);


    const token = localStorage.getItem('token');

    //FUNÇÃO PARA BUSCAR PRODUTOS 
    const carregarProdutos = async () => {
        try {
            const response = await api.get('/api/produtos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListaProdutos(response.data);
        } catch (err) {
            console.error("Erro ao carregar produtos:", err);
        }
    };

    // Dispara a busca assim que o usuário entra na tela
    useEffect(() => {
        if (token) {
            try {
                // Decodifica o token salvo no localStorage
                const tokenDecodificado = jwtDecode(token);

                if (tokenDecodificado.nome) {
                    setNomeUsuario(tokenDecodificado.nome);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }

            carregarProdutos();
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Envio do formulário de cadastro

    const prepararEdicao = (produto) => {
        setIdConfigEdicao(produto.id); // Ativa o modo edição guardando o ID
        setNome(produto.nome);
        setDescricao(produto.descricao || '');
        setPreco(produto.preco);
        setQuantidadeEstoque(produto.quantidadeEstoque);
    };

    const cancelarEdicao = () => {
        setIdConfigEdicao(null); // Desativa o modo edição
        setNome('');
        setDescricao('');
        setPreco('');
        setQuantidadeEstoque('');
        setErro('');
        setSucesso('');
    };

    const handleSalvarProduto = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');
        setCarregando(true);

        try {
            const dadosProduto = {
                nome,
                descricao,
                preco: parseFloat(preco),
                quantidadeEstoque: parseInt(quantidadeEstoque)
            };

            if (idConfigEdicao) {
                // MODO EDIÇÃO: Faz o PUT passando o ID na URL
                await api.put(`/api/produtos/${idConfigEdicao}`, dadosProduto, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSucesso('Produto atualizado com sucesso!');
            } else {
                // MODO CADASTRO: Faz o POST normal
                await api.post('/api/produtos', dadosProduto, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSucesso('Produto cadastrado com sucesso!');
            }

            // Reseta o formulário e recarrega a lista
            cancelarEdicao();
            carregarProdutos();

        } catch (err) {
            console.error(err);
            setErro('Erro ao salvar o produto. Verifique os dados.');
        } finally {
            setCarregando(false);
        }
    };


    const abrirConfirmacaoExcluir = (produto) => {
        setProdutoParaExcluir(produto);
        setModalExcluirAberto(true);
    };

    const fecharModalExcluir = () => {
        setModalExcluirAberto(false);
        setProdutoParaExcluir(null);
    };

    const handleExcluirConfirmado = async () => {
        if (!produtoParaExcluir) return;
        try {
            await api.delete(`/api/produtos/${produtoParaExcluir.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fecharModalExcluir();
            carregarProdutos();
        } catch (err) {
            console.error("Erro ao excluir produto:", err);
            alert("Não foi possível excluir o produto.");
        }
    };

    const produtosFiltrados = listaProdutos.filter((prod) => {
        const termo = busca.toLowerCase();
        const nomeDisponivel = prod.nome ? prod.nome.toLowerCase() : '';
        const descricaoDisponivel = prod.descricao ? prod.descricao.toLowerCase() : '';

        return nomeDisponivel.includes(termo) || descricaoDisponivel.includes(termo);
    });

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 font-sans p-8 ">
            {/* Header */}
            <header className="max-w-6xl mx-auto flex justify-between items-end border-b border-stone-800 pb-6 mb-8">
                <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
                        Olá, <span className="text-amber-500 font-bold">{nomeUsuario}</span> • Bem-vindo de volta
                    </p>

                    <div className="flex items-center gap-3.5">
                        <div className="flex items-center gap-3.5">
                            <img
                                src="/logo.png"
                                alt="Logo do Projeto"
                                className="w-11 h-11 object-contain filter transition-transform duration-300 hover:scale-110"
                            />
                        </div>

                        <h1 className="text-3xl font-black text-amber-400 tracking-tight">
                            Inventário de Cargas
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-stone-400 text-sm">
                            Gerencie os suprimentos do seu bando com segurança
                        </p>
                        <span className="text-stone-700 text-xs">•</span>
                        <div className="flex items-center gap-2 bg-stone-900/50 border border-stone-800 px-2 py-0.5 rounded-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                                Inventário Ativo
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-stone-800 hover:bg-red-950/40 border border-stone-700 hover:border-red-800 text-stone-300 hover:text-red-400 font-semibold rounded-lg transition-all duration-200 cursor-pointer text-sm mb-1"
                >
                    Sair do Sistema
                </button>
            </header>

            {/* Conteúdo Principal dividido em 2 Colunas (Formulário à esquerda, Listagem à direita) */}
            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* COLUNA 1: Formulário de Cadastro */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 h-fit">
                    <h2 className="text-xl font-bold text-amber-400 mb-4">
                        {idConfigEdicao ? 'Editar Produto' : 'Novo Produto'}
                    </h2>

                    {erro && (
                        <div className="bg-red-950/30 border border-red-800 text-red-300 p-2.5 rounded-lg mb-4 text-xs text-center font-semibold">
                            {erro}
                        </div>
                    )}
                    {sucesso && (
                        <div className="bg-emerald-950/30 border border-emerald-800 text-emerald-300 p-2.5 rounded-lg mb-4 text-xs text-center font-semibold">
                            {sucesso}
                        </div>
                    )}

                    <form onSubmit={handleSalvarProduto} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1">Nome do Produto</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Teclado Mecânico"
                                className="w-full px-3 py-2 bg-stone-800/80 border border-stone-700 rounded-lg text-white text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1">Descrição</label>
                            <textarea
                                placeholder="Breve descrição do item..."
                                rows="3"
                                className="w-full px-3 py-2 bg-stone-800/80 border border-stone-700 rounded-lg text-white text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 resize-none"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-stone-300 mb-1">Preço (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 bg-stone-800/80 border border-stone-700 rounded-lg text-white text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                                    value={preco}
                                    onChange={(e) => setPreco(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-300 mb-1">Qtd. Estoque</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="0"
                                    className="w-full px-3 py-2 bg-stone-800/80 border border-stone-700 rounded-lg text-white text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                                    value={quantidadeEstoque}
                                    onChange={(e) => setQuantidadeEstoque(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 rounded-lg transition-all duration-200 uppercase text-xs tracking-wider cursor-pointer disabled:opacity-50 mt-2"
                        >
                            {carregando ? 'Salvando...' : idConfigEdicao ? 'Salvar Alterações' : 'Cadastrar Produto'}
                        </button>

                        {idConfigEdicao && (
                            <button
                                type="button"
                                onClick={cancelarEdicao}
                                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold py-2 rounded-lg transition-all duration-200 text-xs mt-2 cursor-pointer"
                            >
                                Cancelar Edição
                            </button>
                        )}
                    </form>
                </div>

                {/* COLUNA 2 e 3: Visualização*/}
                <div className="md:col-span-2 bg-stone-900 border border-stone-800 rounded-xl flex flex-col h-[580px] md:h-full overflow-hidden">
                    {listaProdutos.length === 0 ? (
                        <div className="p-6 text-center text-stone-400 h-full flex flex-col justify-center items-center">
                            <p className="text-lg font-medium">Nenhum produto em estoque.</p>
                            <p className="text-sm text-stone-500 mt-1">Use o formulário ao lado para registrar o seu primeiro item!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full overflow-hidden">

                            <div className="pt-6 px-6 pb-5 border-b border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                                <h2 className="text-xl font-bold text-stone-100">
                                    Itens em Estoque
                                </h2>
                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Buscar produto..."
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                        className="w-full pl-3 pr-9 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-white text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 placeholder-stone-500 transition-all"
                                    />
                                    <span className="absolute right-3 top-2.5 text-stone-500 text-xs pointer-events-none">🔍</span>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto max-h-[460px] mt-2 scrollbar-thin scrollbar-track-stone-900 scrollbar-thumb-stone-800 hover:scrollbar-thumb-stone-700">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-stone-950 z-10">
                                        <tr className="text-stone-350 text-xs font-semibold uppercase tracking-wider border-b border-stone-800">
                                            <th className="pl-6 pr-4 py-4 w-[20%] text-left">Produto</th>
                                            <th className="px-4 py-4 w-[20%] text-left">Descrição</th>
                                            <th className="px-4 py-4 w-[20%] text-right">Preço</th>
                                            <th className="px-4 py-4 w-[20%] text-center">Qtd</th>
                                            <th className="pl-4 pr-6 py-4 w-[20%] text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-800/60 text-sm text-stone-300">
                                        {produtosFiltrados.map((prod) => (
                                            <tr key={prod.id} className="hover:bg-stone-800/30 transition-colors">
                                                <td className="pl-6 pr-4 py-4 font-semibold text-amber-400/90 max-w-[200px] truncate">{prod.nome}</td>
                                                <td className="px-4 py-4 text-stone-400 max-w-[200px] truncate" title={prod.descricao}>
                                                    {prod.descricao || '—'}
                                                </td>
                                                <td className="px-4 py-4 text-right font-mono">R$ {prod.preco.toFixed(2)}</td>
                                                <td className="px-4 py-4 text-center">
                                                    {prod.quantidadeEstoque <= 0 ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-red-950/40 text-red-400 border border-red-900/50 rounded-md">
                                                            Esgotado
                                                        </span>
                                                    ) : prod.quantidadeEstoque <= 5 ? (
                                                        <span className="inline-flex items-center px-1.5 py-1 text-xs font-bold bg-orange-950/40 text-orange-400 border border-orange-900/50 rounded-md">
                                                            Apenas {prod.quantidadeEstoque} un
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 rounded-md">
                                                            {prod.quantidadeEstoque} un
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="pl-4 pr-6 py-4 text-center space-x-2">
                                                    <button
                                                        onClick={() => prepararEdicao(prod)}
                                                        className="text-stone-400 hover:text-amber-400 transition-colors cursor-pointer px-1.5 py-1"
                                                        title="Editar produto"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => abrirConfirmacaoExcluir(prod)}
                                                        className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer px-1.5 py-1"
                                                        title="Excluir produto"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}
                </div>
            </main>
            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO*/}
            {
                modalExcluirAberto && produtoParaExcluir && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
                        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
                            <div className="text-center">
                                <span className="text-4xl">⚠️</span>
                                <h3 className="text-lg font-bold text-stone-100 mt-3">
                                    Excluir Produto?
                                </h3>
                                <p className="text-stone-400 text-sm mt-2">
                                    Tem certeza que deseja apagar <span className="text-amber-400 font-semibold">"{produtoParaExcluir.nome}"</span>? Esta ação não pode ser desfeita.
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={fecharModalExcluir}
                                    className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold py-2 rounded-lg transition-colors text-sm cursor-pointer"
                                >
                                    Não, cancelar
                                </button>
                                <button
                                    onClick={handleExcluirConfirmado}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg transition-colors text-sm shadow-lg shadow-red-950/20 cursor-pointer"
                                >
                                    Sim, excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            <footer className="relative z-10 mt-auto pt-16 pb-10 border-t border-stone-900/50 text-center">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-stone-400 font-medium">
                        Desenvolvido por <span className="text-stone-200 font-semibold">João Victor</span> em {new Date().getFullYear()}
                    </p>

                    <div className="flex items-center gap-6">
                        <a
                            href="https://github.com/joaovictormnzs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-stone-400 hover:text-amber-500 transition-colors duration-300 text-sm group"
                        >
                            {/* Ícone SVG do GitHub */}
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            <span className="group-hover:underline">GitHub</span>
                        </a>    

                        <span className="text-stone-700">|</span>

                        <a
                            href="https://instagram.com/joaovictormnzsl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-stone-400 hover:text-amber-500 transition-colors duration-300 text-sm group"
                        >
                            {/* Ícone SVG do Instagram */}
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
                            </svg>
                            <span className="group-hover:underline">Instagram</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div >
    );
}