# 🛍️ Loja

<div align="center">

### E-commerce moderno, seguro e escalável

Uma loja virtual construída com **Next.js, TypeScript, Supabase, PostgreSQL, Mercado Pago e Vercel**, com foco em segurança, experiência de compra e arquitetura server-side.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Mercado Pago](https://img.shields.io/badge/Mercado%20Pago-Checkout-009EE3)](https://www.mercadopago.com.br/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com/)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/XzGuuhXz/loja/actions)

**Catálogo · Autenticação · Carrinho · Pedidos · Admin · Estoque · Pagamentos**

</div>

---

## 📌 Sobre o projeto

A **Loja** é uma aplicação de e-commerce full-stack projetada para separar responsabilidades entre navegador, servidor e banco de dados.

O objetivo é manter a experiência do cliente simples enquanto regras críticas — como preços, estoque, autorização administrativa e pagamentos — são verificadas no servidor.

### ✨ Principais recursos

- 🏪 Catálogo de produtos
- 🔎 Busca e filtros por categoria
- 🖼️ Imagens de produtos via Supabase Storage
- 🛒 Carrinho de compras
- 👤 Cadastro, login e sessão de usuário
- 📦 Criação e acompanhamento de pedidos
- 🧾 Histórico de compras
- 👑 Painel administrativo
- 📋 CRUD de produtos e categorias
- 📊 Controle de estoque
- 💳 Checkout com Mercado Pago
- 🔏 Webhook de pagamento com validação HMAC
- 🛡️ RLS e políticas de acesso no PostgreSQL
- ⚡ Deploy preparado para Vercel
- 🔄 CI com lint e build

---

## 🧭 Fluxo da aplicação

```text
                         🛍️ LOJA
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          Catálogo       Autenticação    Administração
             │              │              │
             ▼              ▼              ▼
          Produto        Cliente          Admin
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                         🛒 Carrinho
                            │
                            ▼
                       💳 Checkout
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
          PostgreSQL              Mercado Pago
                 │                     │
                 └──────────┬──────────┘
                            ▼
                       📦 Pedido
                            │
                            ▼
                    🔏 Webhook HMAC
```

---

## 🏗️ Arquitetura

```text
┌─────────────────────────────────────────────────────────┐
│                      🌐 CLIENTE                         │
│              Next.js / React / Tailwind                 │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    ⚙️ SERVIDOR                          │
│       Route Handlers · Auth · Validação · Regras        │
└───────────────┬─────────────────────┬───────────────────┘
                │                     │
                ▼                     ▼
       ┌────────────────┐    ┌────────────────────┐
       │   Supabase     │    │   Mercado Pago     │
       │ Auth/Postgres  │    │     Checkout       │
       │    /Storage    │    │     Webhook        │
       └───────┬────────┘    └─────────┬──────────┘
               │                       │
               └───────────┬───────────┘
                           ▼
                    🔐 Regras seguras
```

---

## 🔐 Segurança

Segurança é tratada como parte da arquitetura, não apenas como uma camada do frontend.

### Proteções implementadas

| Proteção | Implementação |
|---|---|
| 🔐 Autenticação | Supabase Auth |
| 🛡️ Banco | PostgreSQL + Row Level Security (RLS) |
| 👑 Administração | Autorização server-side + função privada `is_admin()` |
| 💰 Preços | Calculados a partir dos dados confiáveis do banco |
| 📦 Estoque | Controle transacional durante o checkout |
| 💳 Pagamento | Preferência criada no servidor |
| 🔏 Webhook | Validação de assinatura HMAC |
| 🔑 Service Role | Restrita ao servidor |
| 🖼️ Uploads | MIME types permitidos + limite de 5 MiB |
| 🌐 HTTP | Headers de segurança configurados |
| 🚫 Segredos | Fora do Git e fora de `NEXT_PUBLIC_*` |

> **Importante:** nenhuma credencial real deve ser colocada no código-fonte, README, navegador ou GitHub.

---

## 🗄️ Banco de dados

A persistência utiliza **Supabase + PostgreSQL**.

### Modelo principal

```text
profiles
   │
   ├── addresses
   │
   └── orders
          │
          └── order_items ─── products ─── categories
                                  │
                                  └── product_images

carts
   │
   └── cart_items ─── products
```

### Tabelas principais

- `profiles`
- `categories`
- `products`
- `product_images`
- `carts`
- `cart_items`
- `addresses`
- `orders`
- `order_items`

As regras de acesso são aplicadas no banco com **RLS**, reduzindo a dependência de validações feitas somente pelo cliente.

---

## 💳 Pagamentos

A integração utiliza **Mercado Pago Checkout Pro**.

```text
Cliente
  │
  ▼
Carrinho
  │
  ▼
API do servidor
  │
  ├── valida usuário
  ├── valida pedido
  ├── consulta itens/preços
  └── cria preferência
          │
          ▼
     Mercado Pago
          │
          ▼
       Pagamento
          │
          ▼
    Webhook assinado
          │
          ▼
     Validação HMAC
          │
          ▼
 Atualização do pedido
```

Endpoint esperado do webhook:

```text
/api/pagamento/webhook
```

Os secrets do Mercado Pago são **server-only**.

---

## 🧰 Stack

| Tecnologia | Papel |
|---|---|
| **Next.js 15** | Framework full-stack |
| **React 19** | Interface de usuário |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS** | Estilização |
| **Supabase Auth** | Autenticação |
| **PostgreSQL** | Banco de dados |
| **Supabase Storage** | Imagens |
| **Zod** | Validação |
| **Mercado Pago** | Pagamentos |
| **Vercel** | Deploy e hospedagem |
| **GitHub Actions** | CI |

---

## 📁 Estrutura do projeto

```text
loja/
├── app/
│   ├── api/
│   │   └── pagamento/
│   ├── admin/
│   ├── auth/
│   ├── carrinho/
│   ├── pedidos/
│   ├── produtos/
│   ├── error.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
├── lib/
│   └── supabase/
├── supabase/
│   └── migrations/
├── public/
├── .github/
│   └── workflows/
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

---

## 🚀 Rodando localmente

### 1. Clone o projeto

```bash
git clone https://github.com/XzGuuhXz/loja.git
cd loja
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie `.env.local` a partir do `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_publico
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
SUPABASE_SERVICE_ROLE_KEY=chave_apenas_no_servidor
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
```

> ⚠️ Nunca faça commit dos valores reais dessas variáveis.

### 4. Inicie o ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

### 5. Valide o projeto

```bash
npm run lint
npm run build
```

---

## 🗃️ Supabase

Para trabalhar com as migrations:

```bash
supabase login
supabase init
supabase link --project-ref rfzaogerwwyyaexvgkqd
supabase migration list
```

Antes de aplicar alterações em produção, confira cuidadosamente o histórico de migrations.

Para gerar os tipos TypeScript:

```bash
supabase gen types --lang typescript --linked > database.types.ts
```

> 🚨 **Produção:** não use `supabase db reset --linked`. Reset deve ser reservado para bancos locais de desenvolvimento.

---

## 👑 Administração

Usuários comuns entram como `customer`.

A promoção para administrador deve ser realizada por uma conexão administrativa segura no Supabase:

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DO_USUARIO';
```

O frontend não deve permitir que um usuário escolha ou altere seu próprio papel para `admin`.

---

## ☁️ Deploy

O projeto está estruturado para deploy na **Vercel**.

### Variáveis de Production

Configure no ambiente **Production**:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
```

Depois de alterar variáveis de ambiente, faça um novo deploy para aplicar a configuração.

### Pipeline

```text
        git push
            │
            ▼
     GitHub Actions
            │
       ┌────┴────┐
       ▼         ▼
      Lint      Build
       │         │
       └────┬────┘
            ▼
         Vercel
            │
            ▼
       🚀 Production
```

---

## 🔄 CI/CD

O workflow do GitHub Actions executa validações antes da publicação:

- ✅ Instalação das dependências
- ✅ Lint
- ✅ Build de produção
- ✅ Runtime alinhado com Node.js 24

---

## 📊 Status atual

> O código e a infraestrutura de segurança estão em evolução contínua. O deploy de produção depende das variáveis secretas configuradas na Vercel.

| Módulo | Status |
|---|:---:|
| Catálogo | ✅ |
| Busca e filtros | ✅ |
| Página de produto | ✅ |
| Carrinho | ✅ |
| Autenticação | ✅ |
| Pedidos | ✅ |
| Área administrativa | ✅ |
| CRUD de produtos | ✅ |
| CRUD de categorias | ✅ |
| Storage / imagens | ✅ |
| Controle de estoque | ✅ |
| Checkout | ✅ |
| Mercado Pago | ✅ |
| Webhook HMAC | ✅ |
| RLS | ✅ |
| Headers de segurança | ✅ |
| CI / Build | ✅ |
| Configuração Production Vercel | ⚠️ Requer secrets |

---

## 🛡️ Checklist de segurança

- [x] RLS nas tabelas de negócio
- [x] Service Role somente server-side
- [x] Checkout validado no servidor
- [x] Preços confiáveis vindos do banco
- [x] Controle de estoque transacional
- [x] Webhook protegido por HMAC
- [x] Policies do Storage
- [x] Limite e MIME types para imagens
- [x] Rotas administrativas protegidas
- [x] Função administrativa fora do schema público
- [x] Funções sensíveis com privilégios restritos
- [x] Headers HTTP de segurança
- [x] Segredos fora do Git
- [x] CI com lint e build

---

## 🧪 Antes de colocar em produção

```text
[ ] Configurar variáveis Production na Vercel
[ ] Configurar domínio oficial
[ ] Configurar webhook do Mercado Pago
[ ] Validar login/cadastro
[ ] Testar carrinho e estoque
[ ] Testar checkout em ambiente apropriado
[ ] Testar retorno do webhook
[ ] Confirmar RLS e permissões
[ ] Executar lint e build
[ ] Fazer deploy
[ ] Validar a aplicação publicada
```

---

## 🤝 Desenvolvimento

Contribuições, correções e melhorias são bem-vindas.

Fluxo recomendado:

```bash
git checkout -b feature/minha-melhoria
git add .
git commit -m "feat: minha melhoria"
git push origin feature/minha-melhoria
```

Depois, abra um Pull Request para revisão.

---

## 📜 Licença

Projeto desenvolvido para a aplicação **Loja**.

<div align="center">

### 🛍️ Loja

**Construída para vender. Projetada para crescer. Protegida para produção.**

⭐ Se este projeto for útil, considere deixar uma estrela no repositório.

</div>
