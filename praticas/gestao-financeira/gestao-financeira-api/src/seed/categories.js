const prisma = require("../lib/prisma");

async function seedCategories() {
  const categories = [
    {
      name: "income",
      displayName: "Renda",
      icon: "attach_money",
      background: "#7ED957",
      isIncome: true,
      isDefault: true,
    },
    {
      name: "food",
      displayName: "Alimentação",
      icon: "restaurant",
      background: "#FFB26B",
      isIncome: false,
      isDefault: true,
    },
    {
      name: "home",
      displayName: "Casa",
      icon: "home",
      background: "#F9E076",
      isIncome: false,
      isDefault: true,
    },
    {
      name: "education",
      displayName: "Educação",
      icon: "school",
      background: "#C9A0DC",
      isIncome: false,
      isDefault: true,
    },
    {
      name: "travel",
      displayName: "Viagens",
      icon: "flight",
      background: "#8ED1FC",
      isIncome: false,
      isDefault: true,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("Categorias inseridas com sucesso!");
}

seedCategories()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });