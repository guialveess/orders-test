# Order Management API

API RESTful para gerenciamento de pedidos com autenticação JWT, documentação Swagger e suíte completa de testes.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [Boas Práticas](#boas-práticas)
- [Deploy](#deploy)
- [Troubleshooting](#troubleshooting)
- [Uso de IA no Desenvolvimento](#uso-de-ia-no-desenvolvimento)

## Visão Geral

Esta API foi desenvolvida para gerenciar pedidos, permitindo:

- Registro e autenticação de usuários
- Criação e gerenciamento de pedidos
- Fluxo de estados dos pedidos (CREATED → ANALYSIS → COMPLETED)
- Listagem com paginação e filtros
- Documentação interativa com Swagger
- Suíte completa de testes automatizados

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript/TypeScript
- **TypeScript** - Tipagem estática para maior segurança
- **Express.js 5** - Framework web minimalista e flexível
- **Bun** - Package manager e runtime ultra-rápido

### Banco de Dados
- **MongoDB** - Banco de dados NoSQL orientado a documentos
- **Mongoose** - ODM (Object Data Modeling) para MongoDB com validação de esquemas

### Autenticação
- **JWT (JSON Web Tokens)** - Autenticação stateless e segura
- **bcrypt** - Hash de senhas com salt rounds

### Documentação
- **Swagger UI** - Interface interativa para documentação e testes de API
- **swagger-jsdoc** - Geração automática de documentação a partir de JSDoc

### Testes
- **Vitest** - Framework de testes moderno e rápido
- **Supertest** - Biblioteca para testar APIs HTTP
- **MongoDB Memory Server** - Banco de dados MongoDB em memória para testes

### Desenvolvimento
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers
- **ESLint** (opcional) - Linting de código
- **Prettier** (opcional) - Formatação de código

## Arquitetura do Projeto

### Estrutura de Diretórios

```
order-test/
├── config/
│   ├── database.ts          # Configuração de conexão com MongoDB
│   └── swagger.ts           # Configuração do Swagger
├── middlewares/
│   └── auth.middleware.ts   # Middleware de autenticação JWT
├── routes/
│   ├── index.ts             # Exportador de rotas
│   ├── auth.routes.ts       # Rotas de autenticação
│   └── orders.routes.ts     # Rotas de pedidos
├── src/
│   ├── @types/
│   │   └── express/
│   │       └── index.d.ts  # Tipos personalizados do Express
│   └── models/
│       ├── users/
│       │   ├── user.interface.ts
│       │   └── user.schema.ts
│       └── orders/
│           ├── order.interface.ts
│           ├── order.schema.ts
│           └── order.enums.ts
├── test/
│   ├── setup.ts            # Configuração do banco de testes
│   ├── utils.ts            # Utilitários de teste
│   ├── app.ts              # App Express para testes
│   ├── auth.routes.test.ts  # Testes de autenticação
│   └── orders.routes.test.ts# Testes de pedidos
├── .dockerignore           # Arquivos ignorados no Docker
├── .env                   # Variáveis de ambiente
├── .env.test             # Variáveis de ambiente para testes
├── .gitignore            # Arquivos ignorados no Git
├── app.ts                # Configuração principal do Express
├── server.ts             # Ponto de entrada e inicialização
├── docker-compose.yml     # Configuração do Docker Compose
├── Dockerfile            # Configuração do Docker
├── package.json          # Dependências do projeto
├── tsconfig.json         # Configuração do TypeScript
├── vitest.config.ts      # Configuração do Vitest
├── README.md             # Este arquivo
├── TESTING.md            # Guia detalhado de testes
└── TROUBLESHOOTING.md   # Guia de troubleshooting
```

### Padrões de Arquitetura

#### 1. Separation of Concerns (SoC)
- **Rotas**: Responsáveis apenas por definir endpoints HTTP
- **Middlewares**: Responsáveis por interceptar e modificar requisições/respostas
- **Models**: Responsáveis pela estrutura de dados e validação
- **Controllers**: Lógica de negócio (integrada nas rotas neste projeto)

#### 2. Middleware Chain
```
Request → Body Parser → Auth Middleware → Route Handler → Response
```

#### 3. Fluxo de Autenticação
```
1. Usuário faz login → POST /auth/login
2. Server valida credenciais
3. Server gera token JWT
4. Cliente recebe token
5. Cliente envia token no header Authorization: Bearer <token>
6. AuthMiddleware valida token
7. Requisição prossegue para handler protegido
```

#### 4. Fluxo de Estados do Pedido
```
CREATED → ANALYSIS → COMPLETED
  ↓           ↓           ↓
Novo       Em         Final
pedido      análise
```

### Design Decisions

#### Por que Express 5?
- Melhor performance em comparação com versões anteriores
- Suporte nativo a async/await
- Middleware stack mais flexível
- Comunidade ativa e bem documentada

#### Por que MongoDB?
- Schema flexível para dados de pedidos
- Escalabilidade horizontal natural
- Performance em leituras
- JSON nativo

#### Por que JWT?
- Stateless (não precisa de sessão no servidor)
- Escalável (pode usar load balancer)
- Seguro (assinatura criptográfica)
- Padrão da indústria para APIs REST

#### Por que Vitest?
- Mais rápido que Jest
- Integração nativa com TypeScript
- Watch mode eficiente
- Ecosystem moderno

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+ ou Bun 1+
- MongoDB 7+ (ou Docker)
- Git

### Instalação Local

```bash
# Clone o repositório
git clone <repository-url>
cd order-test

# Instale as dependências
bun install
# ou
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Inicie o servidor em modo desenvolvimento
bun run dev
```

### Instalação com Docker

```bash
# Clone o repositório
git clone <repository-url>
cd order-test

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie os containers
docker-compose up -d

# Verifique os logs
docker-compose logs -f api
```

### Variáveis de Ambiente

```env
PORT=8080                          # Porta do servidor
MONGO_URI=mongodb://mongo:27017/order_mongo  # URI do MongoDB
JWT_SECRET=your-secret-key-here      # Chave secreta para JWT
```

## Documentação da API

A documentação completa da API está disponível através do Swagger UI:

**Acesse: http://localhost:8080/api-docs**

### O que é Swagger?

O Swagger é uma ferramenta que fornece uma interface interativa para documentar e testar APIs. Com ele, você pode:

- Visualizar todos os endpoints disponíveis
- Ver os parâmetros e formatos esperados
- Testar os endpoints diretamente da interface
- Testar autenticação com tokens JWT
- Ver exemplos de requisições e respostas

### Endpoints Disponíveis

#### Autenticação (`/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/register` | Registrar novo usuário | Não |
| POST | `/auth/login` | Fazer login | Não |

#### Pedidos (`/orders`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/orders` | Criar novo pedido | Sim |
| GET | `/orders` | Listar pedidos | Sim |
| PATCH | `/orders/:id/advance` | Avançar estado do pedido | Sim |

### Como Usar o Swagger

#### 1. Registrar um novo usuário
1. Expanda o endpoint `POST /auth/register`
2. Clique em "Try it out"
3. Preencha o corpo da requisição:
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
4. Clique em "Execute"

#### 2. Fazer login
1. Expanda o endpoint `POST /auth/login`
2. Clique em "Try it out"
3. Preencha o corpo da requisição:
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
4. Clique em "Execute"
5. **Copie o token** retornado na resposta

#### 3. Configurar Autenticação
1. No topo da página, clique no botão **"Authorize"**
2. Cole o token JWT que você copiou
3. Clique em **"Authorize"**
4. Clique em **"Close"**

Agora você pode testar os endpoints que requerem autenticação!

#### 4. Criar um pedido
1. Expanda o endpoint `POST /orders`
2. Clique em "Try it out"
3. Preencha o corpo da requisição:
   ```json
   {
     "lab": "Lab A",
     "patient": "Patient Name",
     "customer": "Customer Name",
     "services": [
       {
         "name": "Service 1",
         "value": 100
       },
       {
         "name": "Service 2",
         "value": 200
       }
     ]
   }
   ```
4. Clique em "Execute"

## Testes

Este projeto possui uma suíte completa de testes automatizados usando Vitest.

### Executar os Testes

```bash
# Modo watch (desenvolvimento)
bun test
# ou
npm test

# Modo run (CI/CD)
bun test:run
# ou
npm run test:run

# Com cobertura de código
bun test:coverage
# ou
npm run test:coverage
```

### Cobertura de Testes

- Autenticação: 9 testes
- Pedidos: 21 testes
- Total: 30 testes

### Estrutura dos Testes

```
test/
├── setup.ts              # Configuração do banco em memória
├── utils.ts              # Utilitários de teste
├── app.ts                # App Express para testes
├── auth.routes.test.ts    # Testes de autenticação
└── orders.routes.test.ts  # Testes de pedidos
```

### Funcionalidades dos Testes

- Banco de dados em memória: Testes rápidos e isolados
- Limpeza automática: Cada teste começa com um banco limpo
- Testes de integração: Testam toda a stack (HTTP → Express → MongoDB)
- Cobertura de cenários: Sucesso, falha e casos de borda

### Escrever Novos Testes

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';

describe('My Feature', () => {
  it('should do something', async () => {
    const response = await request(app)
      .get('/my-endpoint')
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });
});
```

Para mais informações sobre testes, consulte o [`TESTING.md`](TESTING.md:1).

## Boas Práticas

### 1. Organização de Código

#### Separação de Responsabilidades
```typescript
// BOM - Rotas apenas definem endpoints
router.post('/orders', async (req, res) => {
  const order = await createOrder(req.body);
  return res.status(201).json(order);
});

// RUIM - Lógica de negócio misturada com rotas
router.post('/orders', async (req, res) => {
  const { lab, patient, customer } = req.body;
  // ... 50 linhas de lógica de negócio
  return res.status(201).json(order);
});
```

#### Validação de Dados
```typescript
// BOM - Validação explícita
if (!lab || !patient || !customer) {
  return res.status(400).json({ 
    message: "Campos obrigatórios ausentes" 
  });
}

// RUIM - Assume que dados estão válidos
const order = await Order.create(req.body);
```

### 2. Middleware

#### Ordem de Execução
```typescript
// BOM - Ordem correta
app.use(express.json());           // 1. Parse body
app.use(express.urlencoded());      // 2. Parse URL-encoded
app.use('/orders', authMiddleware, orderRoutes); // 3. Auth + rotas

// RUIM - Ordem incorreta
app.use('/orders', authMiddleware, orderRoutes);
app.use(express.json()); // Nunca será executado
```

#### Middleware de Erro
```typescript
// BOM - Tratamento de erros centralizado
app.use((err: any, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// RUIM - Tratamento duplicado em cada rota
router.post('/orders', async (req, res) => {
  try {
    // lógica
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});
```

### 3. Segurança

#### Nunca Exponha Senhas
```typescript
// BOM - Remove senha da resposta
return res.status(201).json({
  id: user._id,
  email: user.email,
  // senha não incluída
});

// RUIM - Exponha senha
return res.status(201).json(user);
```

#### Validação de JWT
```typescript
// BOM - Middleware de autenticação
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não informado' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// RUIM - Validação manual em cada rota
router.post('/orders', async (req, res) => {
  const token = req.headers.authorization;
  // ... validação repetida
});
```

### 4. Testes

#### Testes Independentes
```typescript
// BOM - Cada teste é independente
it('should create order', async () => {
  const user = await createTestUser();
  const token = generateToken(user._id);
  const response = await request(app)
    .post('/orders')
    .set('Authorization', `Bearer ${token}`)
    .send(orderData);
  expect(response.status).toBe(201);
});

// RUIM - Testes dependentes
let userId;
beforeAll(async () => {
  userId = (await createTestUser())._id;
});
it('should create order', async () => {
  // depende de userId do beforeAll
});
```

#### Nomes Descritivos
```typescript
// BOM - Nome descreve o que é testado
it('should return 400 if email is missing', async () => {
  // teste
});

// RUIM - Nome vago
it('test email', async () => {
  // teste
});
```

### 5. Banco de Dados

#### Uso de Índices
```typescript
// BOM - Índices para queries frequentes
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

// RUIM - Sem índices
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
```

#### Queries Eficientes
```typescript
// BOM - Seleciona apenas campos necessários
const users = await User.find({}, { email: 1, _id: 1 });

// RUIM - Retorna todos os campos
const users = await User.find({});
```

### 6. Documentação

#### Comentários Significativos
```typescript
// BOM - Explica o PORQUÊ
// Usamos bcrypt com 10 salt rounds para balancear segurança e performance
const hashedPassword = await bcrypt.hash(password, 10);

// RUIM - Repete o código
// Hash password
const hashedPassword = await bcrypt.hash(password, 10);
```

#### Documentação de API
```typescript
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
router.post("/orders", async (req, res) => {
  // handler
});
```

## Deploy

### Docker (Recomendado)

```bash
# Build da imagem
docker build -t order-api .

# Run do container
docker run -p 8080:8080 \
  -e MONGO_URI=mongodb://your-mongo-host:27017/order_mongo \
  -e JWT_SECRET=your-production-secret \
  order-api
```

### Docker Compose

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f api

# Parar serviços
docker-compose down
```

### Variáveis de Ambiente de Produção

```env
PORT=8080
MONGO_URI=mongodb://production-mongo:27017/order_mongo
JWT_SECRET=use-a-strong-random-secret-in-production
NODE_ENV=production
```

## Troubleshooting

### Erro "request size did not match content length"

**Causa**: Middleware deletando header `content-length` antes do body parser.

**Solução**: Remover middleware que modifica headers desnecessariamente.

Para mais detalhes, consulte [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md:1).

### Erro "Right side of assignment cannot be destructured"

**Causa**: `req.body` está undefined quando tentado desestruturar.

**Solução**: Garantir que body parser é executado antes dos handlers.

Para mais detalhes, consulte [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md:1).

### Testes Falhando

**Problema**: Testes retornam 404 ao invés de status esperado.

**Solução**: Verificar se o app de teste está montando as rotas corretamente.

Para mais informações sobre testes, consulte [`TESTING.md`](TESTING.md:1).

## Modelos de Dados

### User
```typescript
{
  _id: string,
  email: string,
  password: string (hashed)
}
```

### Order
```typescript
{
  _id: string,
  lab: string,
  patient: string,
  customer: string,
  services: Array<{
    name: string,
    value: number,
    status: 'PENDING' | 'DONE'
  }>,
  state: 'CREATED' | 'ANALYSIS' | 'COMPLETED',
  status: 'ACTIVE' | 'DELETED',
  createdAt: Date,
  updatedAt: Date
}
```

## Scripts Disponíveis

```json
{
  "dev": "bun --watch server.ts",
  "start": "bun server.ts",
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é apenas para fins educacionais.

## Recursos Adicionais

- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Swagger Documentation](https://swagger.io/)
- [JWT.io](https://jwt.io/)
- [Docker Documentation](https://docs.docker.com/)

## Uso de IA no Desenvolvimento

Este projeto foi desenvolvido com auxílio de Inteligência Artificial (IA) para acelerar o processo de desenvolvimento e garantir qualidade.

### Onde a IA foi utilizada:

1. Geração de Testes - Criação da suíte completa de 30 testes automatizados
2. Documentação de API (Swagger) - Geração de especificações OpenAPI 3.0
3. Documentação do Projeto - Criação de README completo e detalhado
4. Configuração de Ambiente - Setup do Vitest com MongoDB Memory Server
5. Refatoração e Correção de Bugs - Correção de erros e ajustes

### Benefícios do Uso de IA:

- Velocidade: Geração rápida de código boilerplate
- Cobertura: Testes cobrindo todos os cenários
- Qualidade: Código seguindo boas práticas
- Documentação: Documentação completa e atualizada
- Consistência: Padrões consistentes em todo o projeto

### Limitações e Validação:

Todo o código gerado pela IA foi revisado para garantir funcionamento correto e testado para validar a lógica implementada.

### Responsabilidade:

Embora a IA tenha auxiliado na geração de código e documentação, todo o conhecimento técnico, decisões de arquitetura e validação de requisitos foram feitas por desenvolvedor humano. A IA funcionou como uma ferramenta de produtividade, acelerando o processo de desenvolvimento sem substituir a criatividade e julgamento técnico.
