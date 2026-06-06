const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "gestao-financeira-api",
  });
});

app.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      displayName: "asc",
    },
  });

  app.post("/categories", async (req, res) => {
  try {
    const { name, displayName, icon, background, isIncome } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        displayName,
        icon,
        background,
        isIncome,
        isDefault: false,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar categoria",
      details: error.message,
    });
  }
});

  res.json(categories);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});