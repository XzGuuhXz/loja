import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não configurada.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await Promise.all(
    [
      ["Eletrônicos", "eletronicos"],
      ["Casa", "casa"],
      ["Moda", "moda"],
      ["Games", "games"],
    ].map(([name, slug]) =>
      prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      }),
    ),
  );

  const electronics = categories.find((category) => category.slug === "eletronicos");

  if (!electronics) {
    throw new Error("Categoria de eletrônicos não encontrada.");
  }

  await prisma.product.upsert({
    where: { sku: "NV-FONE-001" },
    update: {},
    create: {
      categoryId: electronics.id,
      name: "Fone Pulse Pro",
      slug: "fone-pulse-pro",
      description: "Fone sem fio demonstrativo da NovaVitrine.",
      sku: "NV-FONE-001",
      price: "249.90",
      stock: 25,
      isFeatured: true,
    },
  });

  await prisma.storeSettings.upsert({
    where: { id: "store-settings" },
    update: {},
    create: {
      id: "store-settings",
      storeName: "NovaVitrine",
    },
  });

  console.log("Seed concluído.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
