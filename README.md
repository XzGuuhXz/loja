# 🛍️ Loja

<div align="center">

### E-commerce moderno, seguro e pronto para produção

**Next.js · TypeScript · Supabase · PostgreSQL · Mercado Pago · Vercel**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-ready-black?logo=vercel)](https://vercel.com/)
[![Mercado Pago](https://img.shields.io/badge/Mercado%20Pago-checkout-009ee3)](https://www.mercadopago.com.br/)

**Uma base completa para uma loja virtual com catálogo, autenticação, carrinho, pedidos, administração, estoque e pagamentos online.**

</div>

---

## ✨ Visão geral

A **Loja** foi construída com foco em uma experiência de compra simples no frontend e regras críticas protegidas no backend.

```text
┌─────────────────────────────────────────────────────────────┐
│                         🛍️ LOJA                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏠 Home / Catálogo                                         │
│       │                                                     │
│       ├── 🔎 Busca e filtros                                │
│       ├── 🏷️ Categorias                                     │
│       └── 📦 Página do produto                              │
│                    │                                        │
│                    ▼                                        │
│               🛒 Carrinho                                   │
│                    │                                        │
│                    ▼                                        │
│              💳 Checkout                                    │
│                    │                                        │
│          ┌─────────┴─────────┐                              │
│          ▼                   ▼                              │
│   🗄️ PostgreSQL       💰 Mercado Pago                       │
│          │                   │                              │
│          └─────────┬─────────┘                              │
│                    ▼                                        │
│              📦 Pedido confirmado                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 🔐 Supabase Auth · RLS · Storage · API · Webhooks           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Interface e experiência

- 📱 **Layout responsivo** para desktop, tablet e celular.
- 🔎 Busca e filtros por categoria.
- 🖼️ Galeria de imagens dos produtos.
- 🛒 Carrinho com atualização de quantidade.
- 👤 Cadastro, login, logout e área do cliente.
- 📋 Histórico de pedidos.
- ⚡ Renderização moderna com Next.js.
- 🧭 Rotas protegidas no servidor.
- ♿ Estrutura preparada para uma experiência acessível.

---

## 🧩 Estrutura funcional do site

### 🏪 Área pública

| Área | Função |
|---|---|
| **Home / Catálogo** | Exibe produtos, busca e categorias |
| **Produto** | Detalhes, imagens, preço e estoque |
| **Carrinho** | Produtos selecionados e quantidades |
| **Login** | Autenticação do cliente |
| **Cadastro** | Criação de conta como `customer` |

### 👤 Área do cliente

- Perfil autenticado.
- Endereços de entrega.
- Histórico de pedidos.
- Acompanhamento do status do pedido.
- Checkout integrado ao Mercado Pago.

### 🛠️ Painel administrativo

- CRUD de produtos.
- CRUD de categorias.
- Gerenciamento de imagens.
- Edição de `alt text` das imagens.
- Controle de estoque.
- Gestão de pedidos.
- Acesso protegido por papel `admin`.

---

## 🔐 Arquitetura de segurança

A aplicação foi estruturada para que operações críticas **não dependam da confiança no navegador**.

```text
                    🌐 Browser
                        │
                        ▼
                 Next.js / Server
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        🔑 Supabase Auth      🛡️ Server Rules
              │                   │
              └─────────┬─────────┘
                        ▼
                  PostgreSQL
                        │
                       RLS
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       Cliente        Admin        Checkout
                                      │
                                      ▼
                               💳 Mercado Pago
                                      │
                                      ▼
                                🔏 Webhook HMAC
```

### Proteções implementadas

- 🔒 **RLS** habilitado nas tabelas de negócio.
- 🧑‍💼 Função `is_admin()` protegida com `SECURITY DEFINER` e `search_path` controlado.
- 🚫 Cadastro público não pode escolher o papel `admin`.
- 💰 Checkout calcula preço e total a partir do banco, ignorando valores enviados pelo cliente.
- 📦 Estoque é protegido de forma transacional durante o checkout.
- 🔑 Funções sensíveis possuem `EXECUTE` restrito.
- 🖼️ Storage possui políticas de acesso e limite de **5 MiB** para imagens.
- 🧾 Uploads aceitam somente tipos de imagem definidos.
- 🔏 Webhook do Mercado Pago valida assinatura HMAC antes de atualizar pedidos.
- 🖥️ `SUPABASE_SERVICE_ROLE_KEY` permanece exclusivamente no servidor.
- 🧱 Headers HTTP de segurança configurados no Next.js.
- 🚫 Arquivos `.env*` não devem ser versionados com segredos.

---

## 🗄️ Banco de dados

O backend utiliza **Supabase + PostgreSQL**.

### Principais entidades

```text
profiles
   │
   ├── addresses
   │
   └── orders ─── order_items ─── products ─── categories
                                      │
                                      └── product_images

carts ─── cart_items ─── products
```

Tabelas principais:

- `profiles`
- `categories`
- `products`
- `product_images`
- `carts`
- `cart_items`
- `addresses`
- `orders`
- `order_items`

---

## 💳 Pagamentos

A integração utiliza **Mercado Pago Checkout Pro**.

Fluxo:

```text
Cliente
   │
   ▼
Carrinho
   │
   ▼
Checkout seguro
   │
   ▼
Pedido no PostgreSQL
   │
   ▼
Preferência criada no servidor
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
Atualização segura do pedido
```

Configure o webhook do Mercado Pago para:

```text
https://SEU_DOMINIO/api/pagamento/webhook
```

O access token e a assinatura secreta são **server-only**.

---

## ⚙️ Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 15** | Framework web |
| **React 19** | Interface |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS** | Estilização |
| **Supabase** | Auth, PostgreSQL e Storage |
| **PostgreSQL** | Persistência e regras transacionais |
| **Zod** | Validação de dados |
| **Mercado Pago** | Pagamentos |
| **Vercel** | Deploy e hospedagem |
| **GitHub Actions** | CI |

---

## 🚀 Desenvolvimento local

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o ambiente

Copie `.env.example` para `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_publico
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
SUPABASE_SERVICE_ROLE_KEY=chave_apenas_no_servidor
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
```

> ⚠️ Nunca publique os valores reais dessas variáveis no GitHub.

### 3. Execute

```bash
npm run dev
```

Abra `http://localhost:3000` no navegador.

### 4. Valide antes do deploy

```bash
npm run lint
npm run build
```

---

## 🗃️ Supabase CLI

Vincule o ambiente local ao projeto remoto:

```bash
supabase login
supabase init
supabase link --project-ref rfzaogerwwyyaexvgkqd
```

Como o banco remoto já possui histórico de migrations, sincronize antes de aplicar mudanças:

```bash
supabase db pull
supabase migration list
```

### ⚠️ Produção

Nunca use:

```bash
supabase db reset --linked
```

Antes de um `db push`, confira o histórico e valide as alterações. O reset deve ser utilizado somente no banco local de desenvolvimento.

Para gerar os tipos TypeScript:

```bash
supabase gen types --lang typescript --linked > database.types.ts
```

---

## 👑 Administração

Novos usuários entram como `customer`.

A promoção para administrador deve ocorrer por uma conexão administrativa segura no Supabase:

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DO_USUARIO';
```

> 🔐 Nunca exponha `service_role`, `SUPABASE_SERVICE_ROLE_KEY` ou qualquer secret no navegador, GitHub ou em variáveis `NEXT_PUBLIC_*`.

---

## ☁️ Deploy na Vercel

Configure no ambiente **Production** e, quando necessário, também em **Preview**:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
```

As credenciais reais devem existir somente na Vercel e no ambiente local apropriado.

Depois de alterar variáveis de ambiente, faça um novo deploy para que a nova configuração seja aplicada.

---

## 🔄 CI/CD

O projeto possui validações automatizadas para ajudar a impedir que código quebrado chegue à produção.

```text
Git push
   │
   ▼
GitHub Actions
   │
   ├── npm install
   ├── lint
   └── build
          │
          ▼
       Vercel
          │
          ▼
      Production 🚀
```

---

## 📁 Organização do projeto

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
│   ├── page.tsx
│   └── layout.tsx
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

## 📌 Status do projeto

| Módulo | Status |
|---|:---:|
| Catálogo | ✅ |
| Busca e filtros | ✅ |
| Produto | ✅ |
| Carrinho | ✅ |
| Autenticação | ✅ |
| Pedidos | ✅ |
| Área administrativa | ✅ |
| CRUD de produtos | ✅ |
| CRUD de categorias | ✅ |
| Imagens / Storage | ✅ |
| Controle de estoque | ✅ |
| Checkout PostgreSQL | ✅ |
| Mercado Pago | ✅ |
| Webhook HMAC | ✅ |
| RLS | ✅ |
| Headers de segurança | ✅ |
| CI / Build | ✅ |
| Deploy Vercel | 🚀 |

---

## 🛡️ Checklist de segurança

- [x] RLS nas tabelas de negócio
- [x] Separação entre cliente e servidor
- [x] Service Role somente server-side
- [x] Checkout com preço calculado no banco
- [x] Controle transacional de estoque
- [x] Webhook com assinatura HMAC
- [x] Policies do Storage
- [x] Limite e MIME types para imagens
- [x] Proteção de rotas administrativas
- [x] Headers HTTP de segurança
- [x] Segredos fora do Git
- [x] Dependências Next.js/React atualizadas
- [x] Lint e build no CI

---

## 📜 Licença

Projeto desenvolvido para a aplicação **Loja**.

<div align="center">

### 🛍️ Loja

**Construída para vender. Projetada para crescer. Protegida para produção.**

</div>
