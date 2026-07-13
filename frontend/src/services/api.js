import axios from 'axios';

// Criamos uma instância do Axios apontando para o seu Spring Boot
const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Interruptor para interceptar qualquer requisição antes dela sair do seu app
api.interceptors.request.use((config) => {
    // Busca o Token JWT que guardamos no localStorage do navegador
    const token = localStorage.getItem('token');
    
    // Se o token existir, anexa ele automaticamente no cabeçalho Authorization
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;