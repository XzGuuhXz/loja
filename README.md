# Loja

E-commerce em Next.js + TypeScript + Supabase.

## Configuração local

Crie `.env.local` (não commite):

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_publico
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
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

Nunca exponha `service_role` no navegador, no GitHub ou em variáveis `NEXT_PUBLIC_*`.

## Segurança

- RLS em tabelas de negócio.
- Políticas de cliente/admin separadas.
- Checkout transacional valida usuário, produto ativo, preço e estoque no PostgreSQL.
- Preço/total enviado pelo cliente não é confiável.
- Senhas são tratadas pelo Supabase Auth.
- Segredos ficam fora do repositório.
- Uploads de imagens são restritos a administradores e limitados por extensão/tamanho no cliente; as políticas do Storage também bloqueiam usuários comuns.
- Headers HTTP de proteção configurados no Next.js.
- Após mudanças no banco, confira o Security Advisor do Supabase.

## Pagamento

O checkout cria pedidos como `pending`. Um gateway de pagamento (ex.: Mercado Pago/Stripe) pode ser conectado posteriormente sem mover chaves privadas para o frontend.