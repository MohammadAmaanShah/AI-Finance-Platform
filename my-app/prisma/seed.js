const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const predefinedCategories = [
    "Food",
    "Rent",
    "Travel",
    "Shopping",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Salary",
    "Freelance",
    "Business",
    "Interest",
    "Investments",
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
