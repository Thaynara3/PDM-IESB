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

  res.json(categories);
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

app.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.update({
      where: { id },
      data: req.body,
    });

    res.json(category);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao atualizar categoria",
      details: error.message,
    });
  }
});

app.delete("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        error: "Categoria não encontrada",
      });
    }

    if (category.isDefault) {
      return res.status(400).json({
        error: "Categorias padrão não podem ser excluídas",
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: "Erro ao excluir categoria",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});