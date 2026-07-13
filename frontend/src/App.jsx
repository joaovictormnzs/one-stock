import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Produtos from './pages/Produtos'; // Certifique-se de que o arquivo Produtos.jsx está na pasta pages

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login e Registro*/}
        <Route path="/" element={<Login />} />

        {/* Rota de produtos */}
        <Route path="/produtos" element={<Produtos />} />

        {/*Se digitar qualquer rota inexistente, manda de volta para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}