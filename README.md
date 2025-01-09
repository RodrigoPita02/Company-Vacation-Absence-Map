# 📌 Gestão de Férias

Este projeto é um sistema de gestão de férias desenvolvido com **Node.js, MySQL, HTML, CSS e JavaScript**. O objetivo é permitir que os usuários possam cadastrar funcionários, agendar férias, visualizar um calendário interativo e gerenciar faltas.

---

## 📜 Funcionalidades

- 📅 **Calendário de Férias**: Mostra as férias agendadas para cada funcionário com cores específicas por cargo.
- 🏢 **Gestão de Funcionários**: Permite adicionar, editar e remover funcionários.
- ⏳ **Cadastro de Férias**: Define a data de início e fim das férias para um funcionário.
- 🔍 **Filtros**: Permite filtrar férias por funcionário e mês.
- ✏️ **Edição e Exclusão**: Opção para modificar ou excluir férias cadastradas.
- ❌ **Gestão de Faltas**: Registra e exibe as faltas de funcionários.

---

## 📂 Estrutura do Projeto

```
📁 Company-Vacation-Absence-Map
│── 📁 backend
│   │── 📄 server.js          # Servidor Node.js
│   │── 📄 package.json       # Dependências do projeto
│   │── 📁 routes             # Rotas da API
│   │   │── 📄 funcionarios.js
│   │   │── 📄 ferias.js
│   │   │── 📄 faltas.js
│   │── 📁 models             # Modelos do banco de dados
│   │── 📁 database           # Modelos do banco de dados
│   │   │── 📄 database.js    # Configuração do banco de dados MySQL
│── 📁 frontend
│   │── 📄 index.html         # Página principal com calendário
│   │── 📄 funcionarios.html  # Página de gestão de funcionários
│   │── 📄 faltas.html        # Página de gestão de faltas
│   │── 📄 style.css          # Estilos CSS
│   │── 📄 script.js          # Lógica do frontend do index.html
│   │── 📄 funcionarios.js    # Lógica do frontend dos funcionarios.html
│   │── 📄 faltas.js          # Lógica do frontend das faltas.html
│── 📄 README.md              # Documentação do projeto
```

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML, CSS, JavaScript (Vanilla JS), FullCalendar
- **Back-end:** Node.js (Express.js)
- **Banco de Dados:** MySQL (com MySQL Workbench)

---

## 🚀 Como Executar o Projeto

### 📌 Requisitos
- Node.js instalado
- MySQL instalado e configurado

### 🖥️ Passo a Passo

1. **Clone o repositório**
```sh
 git clone https://github.com/RodrigoPita02/Company-Vacation-Absence-Map
```

2. **Acesse a pasta do projeto**
```sh
 cd Company-Vacation-Map/backend
```

3. **Instale as dependências**
```sh
 npm install
```

4. **Configure o banco de dados**
   - Crie um banco de dados no MySQL
   - Execute o script SQL fornecido para criar as tabelas necessárias
   - Configure a conexão no arquivo `database.js`

5. **Inicie o servidor**
```sh
 npm start
```
O servidor será iniciado em `http://localhost:5000`

6. **Abra o frontend**
   - Abra `index.html` no navegador

---

## 📝 API Endpoints

### 📌 Funcionários
| Método | Rota | Descrição |
|--------|------|------------|
| GET | `/funcionarios` | Retorna todos os funcionários |
| POST | `/funcionarios` | Adiciona um novo funcionário |
| PUT | `/funcionarios/:id` | Edita um funcionário |
| DELETE | `/funcionarios/:id` | Remove um funcionário |

### 📌 Férias
| Método | Rota | Descrição |
|--------|------|------------|
| GET | `/ferias` | Retorna todas as férias cadastradas |
| GET | `/ferias?funcionario_id=1&mes=02` | Filtra férias por funcionário e mês |
| POST | `/ferias` | Adiciona novas férias |
| PUT | `/ferias/:id` | Edita as férias |
| DELETE | `/ferias/:id` | Remove um registro de férias |

### 📌 Faltas
| Método | Rota | Descrição |
|--------|------|------------|
| GET | `/faltas` | Retorna todas as faltas cadastradas |
| POST | `/faltas` | Registra uma nova falta |
| PUT | `/faltas/:id` | Edita uma falta |
| DELETE | `/faltas/:id` | Remove um registro de falta |

---

## 🎨 Personalização
As cores dos cargos podem ser alteradas no banco de dados e são usadas automaticamente no calendário.

---

## 📌 Autor
👤 Desenvolvido por **Rodrigo Pita**

📧 Contato: rodrigomcpita@gmail.com
