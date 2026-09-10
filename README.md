# NovaVitrine

E-commerce full-stack construído **do zero** com Next.js, React, TypeScript e Tailwind CSS.

## Etapa atual

**Etapa 1 — Fundação do projeto.** Banco, autenticação, catálogo, carrinho, checkout e painel administrativo serão implementados nas próximas etapas.

## Requisitos

- Node.js 20.9+
- npm 10+

## Rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra http://localhost:3000.

## Estrutura

```text
app/          # rotas, páginas e estilos
components/   # componentes reutilizáveis
actions/      # regras de negócio
lib/          # infraestrutura e serviços
stores/       # estado do cliente
hooks/        # hooks reutilizáveis
types/        # tipos compartilhados
prisma/       # banco de dados
tests/        # testes
```

## Identidade visual

Primária #5B5FEF · Secundária #7C3AED · Destaque #F59E0B · Fundo #F8FAFC.

Fontes: Inter + Plus Jakarta Sans.
