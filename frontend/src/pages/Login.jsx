import React, { useState } from 'react';
import api from '../services/api';
import chapeuDePalha from '../assets/chapeu-de-palha.png';
import { useNavigate } from 'react-router-dom';

export default function Auth() {

    const navigate = useNavigate();

    // Estado para controlar se exibe Login (true) ou Cadastro (false)
    const [isLogin, setIsLogin] = useState(true);
    
    // Estados dos campos do formulário
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [nome, setNome] = useState('');
    
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    // Função que limpa os estados ao alternar de aba
    const alternarAba = () => {
        setIsLogin(!isLogin);
        setErro('');
        setSucesso('');
        setLogin('');
        setSenha('');
        setConfirmarSenha('');
        setNome('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');
        setCarregando(true);

        if (isLogin) {
            
            // LÓGICA DE LOGIN
            
            try {
                const response = await api.post('api/auth/login', { email: login, senha });
                const token = response.data.token;
                localStorage.setItem('token', token);
                setSucesso('Login realizado com sucesso! Entrando...');
                setTimeout(() => {
                    navigate('/produtos');
                }, 1500);
            } catch (err) {
                setErro('Usuário ou senha inválidos. Tente novamente.');
                console.error(err);
            } finally {
                setCarregando(false);
            }
        } else {
            
            // LÓGICA DE CADASTRO
            
            if (senha !== confirmarSenha) {
                setErro('As senhas não coincidem!');
                setCarregando(false);
                return;
            }

            try {
                // Rota do Spring Boot para cadastro de usuário --> Estudar mais depois
                await api.post('api/auth/register', { nome, email: login, senha });
                setSucesso('Usuário cadastrado com sucesso! Faça o login.');
                
                setTimeout(() => {
                    setIsLogin(true);
                    setSucesso('');
                }, 2000);
            } catch (err) {
                setErro('Erro ao cadastrar usuário. Escolha outro email/username.');
                console.error(err);
            } finally {
                setCarregando(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-100 font-sans">
            <div
                className="fixed inset-0 z-0 opacity-70" 
                style={{
                    backgroundImage: `url('/sunny-background.jpg')`, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 30%', 
                    backgroundRepeat: 'no-repeat',
                }}
            />
            <div
                className="fixed inset-0 z-0 opacity-30 blur-[1px]" 
                style={{
                    backgroundImage: `url('/sunny-background.jpg')`, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 30%', 
                    backgroundRepeat: 'no-repeat',
                }}
            />
            <div className="bg-stone-900 p-8 pt-12 rounded-xl shadow-2xl w-full max-w-md border border-stone-800 transition-all duration-300 relative z-10">

                {/* Chapeu de palha*/}
                <div className="absolute -top-16 -left-12 z-20">
                    <img 
                        src={chapeuDePalha} 
                        alt="Chapéu de Palha do Luffy" 
                        className="w-40 h-auto object-contain rotate-[340deg]"
                        style={{ filter: 'drop-shadow(0px 12px 8px rgba(0, 0, 0, 0.7))' }}
                    />
                </div>

                {/* Título Dinâmico */}
                <h2 className="text-3xl font-extrabold mb-2 text-center text-amber-400 tracking-tight">
                    {isLogin ? 'One Stock' : 'Criar Conta'}
                </h2>
                
                <p className="text-stone-400 text-center mb-6 font-medium text-sm">
                    {isLogin ? 'Faça login para acessar o sistema' : 'Cadastre-se para se tornar um tripulante'}
                </p>

                {/* Feedbacks de Erro e Sucesso */}
                {erro && (
                    <div className="bg-red-950/30 border border-red-800 text-red-300 p-3 rounded-lg mb-4 text-sm text-center font-semibold">
                        {erro}
                    </div>
                )}
                {sucesso && (
                    <div className="bg-emerald-950/30 border border-emerald-800 text-emerald-300 p-3 rounded-lg mb-4 text-sm text-center font-semibold">
                        {sucesso}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Campo Nome (Exclusivo do Cadastro) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">Username</label>
                            <input
                                type="text"
                                required
                                placeholder="Seu nome"
                                className="w-full px-4 py-2 bg-stone-800/80 border border-stone-700 rounded-lg text-white placeholder-stone-500 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Campo Email / Login */}
                    <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">Email</label>
                        <input
                            type="text"
                            required
                            placeholder="exemplo@email.com"
                            className="w-full px-4 py-2 bg-stone-800/80 border border-stone-700 rounded-lg text-white placeholder-stone-500 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    {/* Campo Senha */}
                    <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">Senha</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2 bg-stone-800/80 border border-stone-700 rounded-lg text-white placeholder-stone-500 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    {/* Campo Confirmar Senha*/}
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">Confirme a Senha</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-2 bg-stone-800/80 border border-stone-700 rounded-lg text-white placeholder-stone-500 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Botão de Envio */}
                    <button
                        type="submit"
                        disabled={carregando}
                        className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-lg shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-200 transform active:scale-[0.98] tracking-wider uppercase text-xs cursor-pointer disabled:opacity-50"
                    >
                        {carregando ? 'Processando...' : isLogin ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>

                {/* Alternador de Aba */}
                <div className="mt-6 text-center text-xs">
                    <span className="text-stone-400">
                        {isLogin ? 'Não tem uma conta? ' : 'Já possui uma conta? '}
                    </span>
                    <button
                        onClick={alternarAba}
                        className="text-amber-400 hover:text-amber-300 font-bold underline transition-all duration-150 cursor-pointer"
                    >
                        {isLogin ? 'Cadastre-se aqui' : 'Faça login aqui'}
                    </button>
                </div>

            </div>
        </div>
        
    );
}