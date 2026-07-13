# 🏴‍☠️ One Stock — Sistema de Gestão de Estoque

<p align="center">
  <img src="./frontend/public/logo.png" alt="One Stock Logo" width="150" />
</p>

<p align="center">
  <strong>Gerencie os suprimentos e cargas do seu bando com robustez, segurança e muito estilo.</strong>
</p>


---

## 🌊 Sobre o Projeto

O **One Stock** é um sistema de controle e gerenciamento de estoque inspirado no universo de **One Piece**. Desenvolvido para centralizar o controle de mercadorias de forma ágil e intuitiva, ele simula a organização de um estoque em tempo real para que cada intem possa ser supevisionado de perto.

A aplicação conta com um ecossistema moderno baseado em uma API REST robusta desenvolvida em **Spring Boot (Java)** e uma interface dinâmica e responsiva construída em **React (Vite)** com estilização utilitária do **Tailwind CSS**.

---

## 🛠 Tecnologias Utilizadas

O projeto foi construído separando as responsabilidades de forma clara entre cliente e servidor:

### ☕ Backend (API)
*   **Java** (versão 21) & **Spring Boot** — Estrutura sólida para criação de endpoints rápidos, seguros e escaláveis.
*   **Spring Security & JWT (JSON Web Tokens)** — Sistema robusto de **autenticação e autorização** para proteger as rotas da API e garantir que apenas tripulantes autorizados acessem os dados.
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
```
🚀 Como Executar o Projeto
Para rodar o One Stock localmente, você precisará ter o Java JDK (versão 17 ou superior), seu Banco de Dados configurado e ativo, e o Node.js instalados.

1. Clonar o Repositório

$ git clone [link do repositorio]
$ cd OneStock

---

2. Executando o Backend (Spring Boot)
 
- Certifique-se de que seu banco de dados está rodando.
- Configure as credenciais de acesso ao banco e as chaves de assinatura do JWT (se aplicável) no arquivo backend/src/main/resources/application.properties.
- Abra a pasta backend na sua IDE de preferência (como o IntelliJ IDEA) e execute a classe principal, ou utilize o terminal:

Bash
$ cd backend

No Windows (PowerShell/CMD):
$ .\mvnw.cmd spring-boot:run

No Linux/macOS:
$ ./mvnw spring-boot:run

O backend estará ativo em http://localhost:8080.

---

3. Executando o Frontend (React)
Abra uma nova janela de terminal e execute:

Bash
$ cd frontend

Instalar as dependências do projeto
$ npm install

Iniciar o servidor de desenvolvimento do Vite
$ npm run dev

A interface estará acessível no endereço indicado no terminal. Realize o login com um usuário cadastrado no banco para acessar o painel de controle.
