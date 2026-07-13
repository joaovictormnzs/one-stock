# 🏴‍☠️ One Stock — Sistema de Gestão de Estoque

<p align="center">
  <img src="./frontend/public/logo.png" alt="One Stock Logo" width="150" />
</p>

<p align="center">
  <strong>Gerencie os suprimentos e cargas do seu bando com robustez, segurança e muito estilo.</strong>
</p>

<p align="center">
  <a href="#🌊-sobre-o-projeto">Sobre</a> •
  <a href="#🛠-tecnologias-utilizadas">Tecnologias</a> •
  <a href="#📂-Estrutura-do-Repositório">Estrutura</a> •
  <a href="#-como-executar">Como Executar</a> •
  <a href="#-autor">Autor</a>
</p>

---

## 🌊 Sobre o Projeto

O **One Stock** é um sistema de controle e gerenciamento de estoque inspirado no universo de *One Piece*. Desenvolvido para centralizar o controle de mercadorias de forma ágil e intuitiva, ele simula a organização do porão de cargas de um navio pirata, garantindo que nenhum suprimento essencial fique de fora.

A aplicação conta com um ecossistema moderno baseado em uma API REST robusta desenvolvida em **Spring Boot (Java)** e uma interface dinâmica e responsiva construída em **React (Vite)** com estilização utilitária do **Tailwind CSS**.

---

## 🛠 Tecnologias Utilizadas

O projeto foi construído separando as responsabilidades de forma clara entre cliente e servidor:

### ☕ Backend (API)
*   **Java** (versão 17+) & **Spring Boot** — Estrutura sólida para criação de endpoints rápidos, seguros e escaláveis.
*   **Spring Data JPA** — Abstração e persistência de dados de forma simplificada.
*   **Banco de Dados Relacional** — Armazenamento seguro das informações de produtos e estoque.
*   **Maven** — Gerenciamento de dependências e automação do build.

### ⚛️ Frontend (Interface)
*   **React** (Vite) — Biblioteca componentizada para uma experiência de usuário fluida e reativa.
*   **Tailwind CSS** — Framework CSS utilitário para um design moderno, limpo e adaptável.

---

## 📂 Estrutura do Repositório

O repositório é unificado (monorepo), mantendo o código do cliente e do servidor no mesmo lugar para facilitar a manutenção:

```text
one-stock/
├── backend/                  # API Spring Boot (Java)
│   ├── src/                  # Código-fonte (Controllers, Services, Repositories...)
│   └── pom.xml               # Configurações do Maven
│
├── frontend/                 # Painel web em React (Vite)
│   ├── src/                  # Páginas, componentes e estilização
│   └── package.json          # Dependências do Node
│
└── README.md                 # Documentação principal
