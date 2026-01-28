const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const predefinedCategories = [
    "food",
    "rent",
    "travel",
    "shopping",
    "entertainment",
    "utilities",
    "healthcare",
    "salary",
    "freelance",
    "business",
    "interest",
    "investments",
  ];

  for (const name of predefinedCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        name,
        userId: null, // system category
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name,
          userId: null,
        },
      });
    }
  }

  console.log("✅ Predefined categories seeded");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
