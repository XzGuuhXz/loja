# Loja

E-commerce em Next.js + TypeScript + Supabase, preparado para deploy na Vercel.

## Configuração local

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_publico
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
SUPABASE_SERVICE_ROLE_KEY=chave_apenas_no_servidor
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
```

Instale e execute:

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Admin

Novos usuários entram como `customer`. Para promover um usuário a admin, faça isso somente por uma conexão administrativa segura no Supabase:

```sql
update public.profiles set role='admin' where id='UUID_DO_USUARIO';
```

Nunca exponha `service_role` ou `SUPABASE_SERVICE_ROLE_KEY` no navegador, no GitHub ou em variáveis `NEXT_PUBLIC_*`.

## Funcionalidades

- Catálogo responsivo com busca e filtro por categoria.
- Cadastro, login, logout e histórico de pedidos.
- Carrinho local com checkout seguro no PostgreSQL.
- CRUD completo de produtos e categorias no painel admin.
- Upload, visualização, edição de alt text e exclusão de imagens.
- Controle de estoque com bloqueio transacional no checkout.
- Mercado Pago Checkout Pro com webhook assinado.
- RLS e Storage Policies no Supabase.
- Rotas administrativas protegidas no servidor.
- Headers HTTP de proteção no Next.js.
- CI com typecheck e build.

## Pagamento Mercado Pago

A integração usa o Checkout Pro: a preferência é criada no servidor, usando os itens e preços registrados no pedido; o comprador é redirecionado para o Mercado Pago e o status retorna por webhook. A documentação oficial descreve a Preferences API, `back_urls` e notificações com assinatura secreta.

Na aplicação do Mercado Pago, configure o webhook para:

```text
https://SEU_DOMINIO/api/pagamento/webhook
```

Ative as notificações de pagamento e copie a assinatura secreta para `MERCADOPAGO_WEBHOOK_SECRET`. O access token fica somente em `MERCADOPAGO_ACCESS_TOKEN`.

## Vercel

No projeto `loja`, configure estas variáveis em Production e Preview conforme necessário:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
```

Depois de salvar as variáveis, faça um novo deploy. O projeto conectado ao GitHub será atualizado automaticamente por push na `main`.

## Segurança

- RLS em todas as tabelas de negócio.
- Função `is_admin()` com `SECURITY DEFINER` e `search_path` controlado.
- Papel `admin` não pode ser escolhido pelo cadastro público.
- Checkout ignora preço/total enviados pelo navegador e calcula com os dados do banco.
- Estoque é bloqueado durante a confirmação do pedido.
- Funções sensíveis têm `EXECUTE` restrito aos papéis necessários.
- Uploads de Storage são restritos a administradores por política do Storage.
- Webhook do Mercado Pago valida assinatura HMAC antes de alterar pedidos.
- Service role é usado apenas em código server-side.
- `.env*` local não deve ser versionado com segredos.
- Headers de segurança configurados no Next.js.

Após alterações no banco, revise também o Security Advisor do Supabase.
